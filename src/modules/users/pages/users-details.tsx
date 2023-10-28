import * as React from 'react';
import * as moment from 'moment';
import ROUTES from "../../../platform/constants/routes";
import {byPrivateRoute} from "../../../platform/decorators/routes";
import generic from '../../../platform/decorators/generic';
import NoProfilePicture from "../../../assets/images/no_profile_picture.png";
import Table from "../../../components/table";
import {Bar} from 'react-chartjs-2';
import alertify from 'alertifyjs';

import {
    IUserDetails,
    IPagingRes,

    AnnouncementStatusViewEnum,
    ColorsStatus,
    AnnouncementStatusEnum,
    OsType, AnnouncementEstateTypeEnum, AnnouncementTypeEnum
} from '../../../platform/constants/interfaces';
import {withRouter, RouteComponentProps} from "react-router";
import AnnouncementController, {IGetUserDetailsAnnouncement} from '../../../platform/api/announcement'
import UserDetailsController from 'src/platform/api/user';
import PageLoader from 'src/components/page-loader';
import Paging from 'src/components/paging';
import NoBroductPicture from '../../../assets/images/product_default.png'
import EmptyDataImg from '../../../assets/images/file_document.png'
import BlockModal from '../../../components/block-user-modal'
import UserController from "src/platform/api/user";
import RecoverModal from "../../../components/recover-login-modal";
import {
    AnnouncementCLandDropdown,
    AnnouncementCommercialDropdown,
    AnnouncementResidentialDropdown
} from "../../../platform/constants/dropdowns";


const chartBar = {
    labels: [] as string[],
    datasets: [
        {
            backgroundColor: '#EE6B45',
            borderColor: '#EE6B45',
          reverse:false,

          borderWidth: 5,
            scaleLineColor: 'rgba(0,0,0,0)',
            data: [] as number[],
            scales: {
                yAxes: [{
                    gridLines: {
                        drawBorder: false,

                    },
                }]
            }
        }
    ]
};

interface IState {
    data: IUserDetails | null,
    dataAnnouncement: IPagingRes<IGetUserDetailsAnnouncement> | null;
    activePage: number,
    blockUser: {
        userId: number;
        day: number;
    };
    openBlockUser: boolean;
    currentDay:number;
    toggleRecover:boolean;
}

interface IRouteParams {
    id: string;
};


@generic<IRouteParams>(withRouter)
@byPrivateRoute(ROUTES.USER_DETAILS)
class UserDetails extends React.Component<RouteComponentProps<IRouteParams>, IState> {
    public arrlist = new Array();

    public state: IState = {
        data: null,
        dataAnnouncement: null,
        activePage: 1,
        blockUser: {
            userId: 0,
            day: 0,
        },
        openBlockUser: false,
        currentDay:0,
        toggleRecover:false,
    };

    public componentDidMount() {
        const {id} = this.props.match.params;

        this.fetchDataUser(id);

    }
     private togleOpenRecoverModal = ()=>{
        this.setState({
            toggleRecover:!this.state.toggleRecover
        })
     }
    private fetchDataUser = async (id: string) => {
        const resultUserInformation = await UserDetailsController.GetUser(id);
        if(resultUserInformation.success){

            this.setState({
                data: resultUserInformation.data,
                blockUser:{
                    userId:resultUserInformation.data.id,
                    day:0
                },
                currentDay: resultUserInformation.data.activities? Number(resultUserInformation.data.activities[resultUserInformation.data.activities.length-1].duration.toFixed(2)) : 0
            });
          this.fetchDataAnnouncement(1)
        }

    }
    private createPrice = (price: string) => {
        return Number(price).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    private fetchDataAnnouncement = async (page: number) => {
        const {id} = this.props.match.params;
        const resultUserAnnouncement = await AnnouncementController.GetUserList({page, count: 6}, id)
        this.setState(() => {
            if (resultUserAnnouncement.data) {
                const arr = Object.values(resultUserAnnouncement.data)
                this.arrlist = Object.values(arr[0]);

                this.arrlist.map(item => {
                    item.price = this.createPrice(item.price.toString())
                })
            }
        });
        this.setState({
            dataAnnouncement: resultUserAnnouncement.data,
        });
    };
    private unBlockUser = async () =>{
        if(this.state.data){
            const result = await UserController.UnBlockUser(this.state.data.id);
            if(result.success){
                alertify.success('This user is already active',2);
                const {id} = this.props.match.params;
                this.fetchDataUser(id);
                this.fetchDataAnnouncement(1)
            }
        }
    };

    private openBlockMenuClick = () => {
        this.setState({openBlockUser: true})
    };
    private closeBlockMenuClick = () => {
        this.setState({openBlockUser: false})
    };

    private getChartData = () => {
        chartBar.labels = [];
        chartBar.datasets[0].data = [];
        if(this.state.data){
            this.state.data.activities.forEach((x, i) => {
                chartBar.labels[i] = moment(x.day).format('DD MMM').valueOf();
                chartBar.datasets[0].data[i] = x.duration > 0 ? Number((x.duration).toFixed(2)) : 0;
            })

        }

        return chartBar;
    }
    private columnConfig = [
        {
            name: 'Announcement',
            style: {minWidth: 370},
            cell: (row: any) =>
                <div className='B-announcement-user'>
                    <div className='B-announcement-img'
                         style={{backgroundImage: `url("${(row.photo.photo || row.photo.photoBlur) || NoBroductPicture}")`}}/>
                    <div className='B-announcement-user-info'>
                        <div className='B-announcement-user-title'>
                            {row.title? <p>{row.title}</p>:null }
                            {!row.title && row.announcementEstateType === AnnouncementEstateTypeEnum.Residential ? <p>{AnnouncementResidentialDropdown()[row.announcementResidentialType].name}</p>: null }
                            {!row.title && row.announcementEstateType === AnnouncementEstateTypeEnum.Commercial ? <p>{AnnouncementCommercialDropdown()[row.commercialType].name}</p>: null }
                            {!row.title && row.announcementEstateType === AnnouncementEstateTypeEnum.Land ? <p>{AnnouncementCLandDropdown()[row.landType].name}</p>: null }
                            {row.isFavourite ? <span className='icon-dashboard '/> : null}
                        </div>
                        <div className='B-announcement-sub-title'>
                            <p>{row.address}</p>
                        </div>
                        <div className='B-announcement-price'>
                            <p>{row.price}</p>
                            <span>SAR </span>
                        </div>
                    </div>
                </div>
        },
        {
            style: {minWidth: 100},

            name: 'Property',
            cell: (row: any) => AnnouncementEstateTypeEnum[row.announcementEstateType],

        },
        {
            style: {minWidth: 60},

            name: 'Type',
            cell: (row: any) => AnnouncementTypeEnum[row.announcementType]
        },

        {
            style: {minWidth: 130},

            name: 'Published date',
            cell: (row: any) => moment(row.publishDay).format('DD MMM YYYY').valueOf(),

        },
        {
            style: {minWidth: 130},

            name: 'Remaining days',
            cell: (row: any) => row.remainingDay,

        },

        {
            style: {minWidth: 100},

            name: 'Status',
            cell: (row: any) =>
                <div className='announcement-prop'>
                    <div className='announcement-status'>
                        <p style={{color: ColorsStatus[row.announcementStatus]}}>{AnnouncementStatusViewEnum[row.announcementStatus]}</p>
                    </div>
                </div>
        },

    ];

    public render() {
        const {data, dataAnnouncement} = this.state;

        return data && dataAnnouncement ? (
            <div className="B-users-details-container">
                <div className="B-users-details-header">
                    <div className="B-user-details-header">
                        <div className="B-details-back">
                            <i className='icon-cancel' onClick={() => window.routerHistory.goBack()}/>
                            <h3>User details</h3>
                        </div>

                        <div className="B-user-buttons">
                            <div className="B-recover-login btn ">
                                <button onClick={this.togleOpenRecoverModal}>Recover login</button>
                            </div>

                            {data.isBlocked ? <div className="B-block-user-btn btn">
                                <button onClick={this.unBlockUser}>Unblock user</button>
                            </div> : <div className="B-block-user-btn btn">
                                <button onClick={this.openBlockMenuClick}>Block user</button>
                            </div>}


                        </div>


                    </div>

                    <div className="B-user-detail-personal-information">
                        <div className="B-user-personal-details">
                            <div className="B-user-inf-title">
                                <h3>Personal information</h3>
                            </div>
                            <div className="B-user-curent-info">
                                <div className="B-user-img"
                                     style={{backgroundImage: `url("${(data.profilePhoto.photo || data.profilePhoto.photoBlur) || NoProfilePicture}")`}}/>
                                <ul>

                                    <li>
                                        <span>Full name</span>
                                        <h3>{data.fullName || '-'}</h3>
                                    </li>
                                    {data.email ?
                                        <li>
                                            <span>Email</span>
                                            <h3>{data.email}</h3>
                                        </li>
                                        : null}
                                    {data.phone ?
                                        <li>
                                            <span>Phone</span>
                                            <h3>{data.phoneCode + ' ' + data.phone}</h3>
                                        </li>
                                        : null}
                                    {data.dateOfBirth ?
                                        <li>
                                            <span>Date of birth</span>
                                            <h3>{moment(data.dateOfBirth).format('DD MMM YYYY ').valueOf() || '-'}</h3>
                                        </li>
                                        : null}
                                    {data.city ?
                                        <li>
                                            <span>City</span>
                                            <h3>{data.city || '-'}</h3>
                                        </li>
                                        : null}
                                    {data.cityByIpAddress ?
                                        <li>
                                            <span>City by IP address</span>
                                            <h3>{data.cityByIpAddress || '-'}</h3>
                                        </li>
                                        : null}
                                    {data.countryByIpAddress ?
                                        <li>
                                            <span>Country by IP address</span>
                                            <h3>{data.countryByIpAddress || '-'}</h3>
                                        </li>
                                        : null}
                                    {data.ipAddress ?
                                        <li>
                                            <span>IP address</span>
                                            <h3>{data.ipAddress || '-'}</h3>
                                        </li>
                                        : null}
                                </ul>
                            </div>
                        </div>
                        <div className="B-user-details-charart">
                            <div className="B-user-inf-title">
                                <h3>Dashboard</h3>
                            </div>
                            <div className="B-user-details-chart-container">
                                <div className="B-user-details-chart-title">
                                    <h3>Daily activity  <span>(minutes and days)</span></h3>
                                </div>
                                <div className="B-user-details-chart-box">

                                    <div className="B-user-details-chart-js">
                                        <Bar
                                            data={this.getChartData}
                                            width={480}
                                            height={280}
                                            options={{
                                                scales: {
                                                    xAxes: [{
                                                        // barPercentage: 0.2,
                                                        gridLines: {display: false},
                                                        // barThickness: 10,

                                                    }]
                                                },
                                                maintainAspectRatio: false,
                                            }}
                                        />
                                    </div>

                                    <div className="B-user-details-daily">
                                        <div className="padding-daily">
                                            <div className="B-user-daily-box">
                                                <span>{data.activeAnnouncementCount}</span>
                                                <p>Active announcements</p>
                                            </div>
                                        </div>
                                        <div className="padding-daily">
                                            <div className="B-user-daily-box">
                                                <span>{data.hiddenAnnouncementCount}</span>
                                                <p>Hidden announcements</p>
                                            </div>
                                        </div>
                                        <div className="padding-daily">
                                            <div className="B-user-daily-box">
                                                <span>{this.state.currentDay} min</span>
                                                <p>Average daily usage</p>
                                            </div>
                                        </div>
                                        <div className="padding-daily">
                                            <div className="B-user-daily-box">
                                                <span>{OsType[data.osType]}</span>
                                                <p>Frequently platform usage</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='B-announcement-list'>
                        {dataAnnouncement.data.length !== 0 ?
                            <div className='B-announcement-list-box'>
                                <div className='B-announcement-list-box'>
                                    <Table<IGetUserDetailsAnnouncement>
                                        data={dataAnnouncement.data}
                                        columnConfig={this.columnConfig}
                                        redirectUrl={row => {
                                            if (row.announcementStatus === AnnouncementStatusEnum.Accepted) {
                                                return ROUTES.ANNOUNCEMENT_DETAILS_APPROVED.replace(':id', row.id.toString())
                                            }
                                            if (row.announcementStatus === AnnouncementStatusEnum.Pending) {
                                                return ROUTES.ANNOUNCEMENT_DETAILS.replace(':id', row.id.toString())
                                            }
                                            if(row.announcementStatus === AnnouncementStatusEnum.Rejected){
                                                return ROUTES.ANNOUNCEMENT_DETAILS_REJECTED.replace(':id', row.id.toString());
                                            }
                                            if(row.announcementStatus === AnnouncementStatusEnum.Featured){
                                                return ROUTES.ANNOUNCEMENT_DETAILS_FEATURED.replace(':id', row.id.toString());
                                            }
                                            if(row.announcementStatus === AnnouncementStatusEnum.InReview){
                                                return ROUTES.ANNOUNCEMENTS_DETAILS_IN_REVIEW.replace(':id', row.id.toString());
                                            }

                                            return ROUTES.ANNOUNCEMENT_DETAILS_DETAILS.replace(':id', row.id.toString());


                                        }}
                                    />
                                </div>
                            </div>
                            :
                            <div className='B-data-empty'>
                                <div className='B-data-empty-img' style={{backgroundImage: `url("${EmptyDataImg}")`}}/>
                                <p>Announcements list is empty</p>
                            </div>}

                    </div>
                    <div className='B-pagination'>
                        <Paging
                            activePage={1}
                            page={dataAnnouncement.pageCount}
                            onChange={this.fetchDataAnnouncement}
                        />
                    </div>
                </div>
                {this.state.openBlockUser ?
                    <BlockModal dataFetch = { async ()=>{
                        const {id} = this.props.match.params
                        await  this.fetchDataUser(id)
                    }}  form={this.state.blockUser} onClose={this.closeBlockMenuClick}/> : null}


                {this.state.toggleRecover ? <RecoverModal onClose={this.togleOpenRecoverModal} userId={data.id} /> : null }
            </div>
        ) : <PageLoader/>;

    }
}

export default UserDetails
