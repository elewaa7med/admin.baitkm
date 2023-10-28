import * as React from 'react';
import generic from '../../platform/decorators/generic';
import {RouteComponentProps, withRouter} from "react-router";
import * as moment from 'moment';

import ROUTES from "../../platform/constants/routes";
import {byPrivateRoute} from "../../platform/decorators/routes";
// import Select from '../../components/select';
import {
    AnnouncementEstateTypeEnum,
    AnnouncementStatusEnum,
    AnnouncementStatusViewEnum,
    ColorsStatus,
    IAddSaveFilterRequestModel,
    IPagingRes,
    SortByStatusReportType
} from '../../platform/constants/interfaces';
// import { SortTypeDropdown } from 'src/platform/constants/dropdowns';
import PageLoader from 'src/components/page-loader';
import NoProfilePicture from "../../assets/images/no_profile_picture.png";
import NoBroductPicture from '../../assets/images/product_default.png'
import EmptyDataImg from '../../assets/images/file_document.png';
import Paging from '../../components/paging';
import Table from '../../components/table';
import AnnouncementController, {IGetReportsList, IUserApproved} from '../../platform/api/announcement';
import {getPageInitialFilter} from 'src/platform/services/shared-storage';
import {Link} from 'react-router-dom';
import FilterAnnouncement from "../announcements/pages/filter-announcement";
import Connection from "../../platform/services/connection";
import ReportTextModal from "../../components/report-text";
import {
    AnnouncementCLandDropdown,
    AnnouncementCommercialDropdown,
    AnnouncementResidentialDropdown
} from "../../platform/constants/dropdowns";


interface IState {
    data: IPagingRes<IGetReportsList[]> | null,
    activePage: number,
    priceString: string,
    form: IAddSaveFilterRequestModel,
    hasOpenFilter: boolean,
    filterName: string,
    CloseName: string,
    isReportPage: boolean,
    reportAnnouncementStatus: AnnouncementStatusEnum | null,
    openLivesModal:boolean;
    reportText:string;


}

interface IFilter {
    orderType: SortByStatusReportType | null;
}


interface IRouteParams {
    id: string;
}


@generic<IRouteParams>(withRouter)
@byPrivateRoute(ROUTES.REPORTS)
class Report extends React.Component<RouteComponentProps<IRouteParams>, {}> {
    private filter = getPageInitialFilter<IFilter>('users_filter', {
        orderType: 0,
    });
    public arrlist = new Array();

    public state: IState = {
        data: null,
        activePage: 1,
        priceString: '',
        filterName: 'Filter',
        CloseName: 'Close',
        form: {
            search: '',
            address: '',
            announcementType: null,
            announcementEstateType: null,
            announcementResidentialType: null,
            announcementRentType: null,
            landType: null,
            commercialType: null,
            announcementStatus: AnnouncementStatusEnum.Accepted,
            features: [],
            priceFrom: 0,
            priceTo: 0,
            minArea: 0,
            maxArea: 0,
            userName: '',
            dateFrom: null,
            dateTo: null,
            bedroomCount: 0,
            bathroomCount: 0,
            floor: 0,
            constructionStatus: null,
            ownerShip: null,
            buildingAge: null,
            furnishingStatus: null,
            saleType: null,
            maxSittingArea: 0,
            minSittingArea: 0,
            country: '',
            city: ''
        },
        reportAnnouncementStatus: null,

        hasOpenFilter: true,
        isReportPage: true,
        openLivesModal:false,
        reportText:'',

    };
    private toggleOpenFilter = () => {
        this.setState({
            hasOpenFilter: !this.state.hasOpenFilter
        });
    };
    private approveReport = async (id: number) => {
        const result = await AnnouncementController.approveReport({announcementId: id});
        if (result.success) {
            this.fetchData(1);
        }

    };
    private rejectReport = async (id: number) => {
        const result = await AnnouncementController.rejectReport({announcementId: id});
        if (result.success) {
            this.fetchData(1);
        }
    };

    private openLivesModal = () => this.setState({ openLivesModal: true });
    private closeLivesModal = () => this.setState({ openLivesModal: false });
    private openReportModal = (reportText: string) => {
        this.openLivesModal()
        this.setState({
            reportText
        })

    }

    private columnConfig = [
        {
            name: 'Announcement',
            style: {minWidth: 370},
            cell: (row: any) =>
                <Link to={ROUTES.ANNOUNCEMENT_DETAILS_DETAILS.replace(':id', row.announcementId.toString())}>
                    <div className='B-announcement-user'>
                        <div className='B-announcement-img'
                             style={{backgroundImage: `url("${(row.photo.photo || row.photo.photoBlur) || NoBroductPicture}")`}}/>
                        <div className='B-announcement-user-info'>
                            <div className='B-announcement-user-title'>
                                {row.title? <p>{row.title}</p>:null }
                                {!row.title && row.announcementEstateType === AnnouncementEstateTypeEnum.Residential ? <p>{AnnouncementResidentialDropdown()[row.announcementResidentialType].name}</p>: null }
                                {!row.title && row.announcementEstateType === AnnouncementEstateTypeEnum.Commercial ? <p>{AnnouncementCommercialDropdown()[row.commercialType].name}</p>: null }
                                {!row.title && row.announcementEstateType === AnnouncementEstateTypeEnum.Land ? <p>{AnnouncementCLandDropdown()[row.landType].name}</p>: null }
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
                </Link>

        },
        {
            style: {minWidth: 70},
            name: ' Status',
            cell: (row: any) => <p
                style={{color: ColorsStatus[row.announcementStatus]}}>{AnnouncementStatusViewEnum[row.announcementStatus]}</p>
        },

        {
            style: {minWidth: 150},
            name: 'Reporting user',
            cell: (row: any) =>
                <Link to={ROUTES.USER_DETAILS.replace(':id', row.userId.toString())}>
                    <div className='announcement-user' title={row.userName}>
                        <div className='announcement-user-img'
                             style={{backgroundImage: `url("${(row.userProfilePhoto.photo || row.userProfilePhoto.photoBlur) || NoProfilePicture}")`}}/>
                        <h3>{row.userName}</h3>
                    </div>
                </Link>


        },

        {
            style: {minWidth: 170},
            name: 'Reason',
            cell: (row: any) => <span className="report-tex-cursor" onClick={()=>{this.openReportModal(row.description)}}>{row.description}</span>,
        },
        {
            style: {minWidth: 100},
            name: 'Date',
            cell: (row: any) => moment(row.createDate).format('DD MMM YYYY').valueOf(),

        },
        {
            style: {minWidth: 110},
            name: ' Report status',
            cell: (row: any) => {
                return <div className='announcement-prop'>
                    <div className='announcement-status'>
                        <p style={{color: ColorsStatus[row.reportStatus]}}>{AnnouncementStatusViewEnum[row.reportStatus]}</p>
                    </div>
                    {row.reportStatus === AnnouncementStatusEnum.Pending ?
                        <div className='announcement-click-style'>
                            <div className='click-announcement'>
                                <span/>
                                <span/>
                                <span/>
                            </div>
                            <div className='announcement-setting'>
                                <ul>
                                    <li onClick={() => {
                                        this.approveReport(row.announcementId)
                                    }}>{AnnouncementStatusViewEnum[1]}</li>
                                    <li onClick={() => {
                                        this.rejectReport(row.announcementId)
                                    }}>{AnnouncementStatusViewEnum[2]}</li>
                                </ul>
                            </div>
                        </div> : null}
                </div>;
            }
        },

    ];
    private createPrice = (price: string) => {

        return Number(price).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    private fetchData = async (page: number) => {

        const result = await AnnouncementController.ReportFilter({
            page,
            count: 10,
            reportAnnouncementStatus: this.state.reportAnnouncementStatus,
            announcementFilter: this.state.form
        });
        this.setState(async () => {
            if (result.data.announcementResponseFilter) {
                const arr = Object.values(result.data);
                arr[0].map((item: IUserApproved) => {
                    item.price = this.createPrice(item.price.toString())
                })
            }
        });
        this.setState({
            data: result.data,
            pageFilter: true,
        });


    };


    public changeFilters = async (form: IAddSaveFilterRequestModel) => {
        const query = Connection.queryFromObject(form);
        window.routerHistory.replace(query ? `${ROUTES.REPORTS}?${query}` : ROUTES.REPORTS);
        this.setState({form});
        if (this.state.form.reportAnnouncementStatus || this.state.form.reportAnnouncementStatus === 0 || this.state.form.reportAnnouncementStatus === null) {
            this.setState({
                reportAnnouncementStatus: form.reportAnnouncementStatus
            }, async () => {
                const result = await AnnouncementController.ReportFilter({
                    page: 1,
                    count: 10,
                    reportAnnouncementStatus: this.state.reportAnnouncementStatus,
                    announcementFilter: form
                });
                this.setState(async () => {
                    if (result.data.announcementResponseFilter) {
                        const arr = Object.values(result.data);
                        arr[0].map((item: any) => {
                            item.price = this.createPrice(item.price.toString())
                        })
                    }
                });
                this.setState({
                    data: result.data,
                    pageFilter: true,
                });
            })
        }


    };

    public componentDidMount() {
        this.filter.orderType = 0;
        this.fetchData(1);
    }




    public render() {
        const {data, hasOpenFilter} = this.state
        return data ? (
            <div className="B-announcement">
                <div className="B-announcement-header">
                    <div className="B-announcement-main">
                        <div className="B-announcement-title">
                            <h3>Reports</h3>
                        </div>

                        <div className='B-announcement-filter btn'>
                            <button
                                onClick={this.toggleOpenFilter}>{hasOpenFilter ? this.state.filterName : this.state.CloseName}</button>
                        </div>

                    </div>
                    {!this.state.hasOpenFilter ?
                        <FilterAnnouncement isReportPage={this.state.isReportPage} form={this.state.form}
                                            onChange={this.changeFilters}  /> : null}

                </div>
                <div className='B-announcement-list'>
                    {data.announcementResponseFilter && data.announcementResponseFilter.length !== 0 ?
                        <div className='B-announcement-list-box reports-list'>
                            <Table<any>
                                data={data.announcementResponseFilter}
                                columnConfig={this.columnConfig}

                            />
                        </div>
                        :
                        <div className='B-data-empty'>
                            <div className='B-data-empty-img' style={{backgroundImage: `url("${EmptyDataImg}")`}}/>
                            {this.state.form.reportAnnouncementStatus === null ? <p>Report list is empty</p> : null}
                            {this.state.form.reportAnnouncementStatus === AnnouncementStatusEnum.Accepted ?
                                <p>Accepted report list is empty</p> : null}
                            {this.state.form.reportAnnouncementStatus === AnnouncementStatusEnum.Pending ?
                                <p>Pending report list is empty</p> : null}
                            {this.state.form.reportAnnouncementStatus === AnnouncementStatusEnum.Rejected ?
                                <p>Rejected report list is empty</p> : null}

                        </div>}
                </div>
                <div className='B-pagination'>
                    <Paging
                        activePage={1}
                        page={data.pageCount}
                        onChange={this.fetchData}
                    />
                </div>
                {this.state.openLivesModal? <ReportTextModal reportText={this.state.reportText} onClose={this.closeLivesModal}/> : null}
            </div>

        ) : <PageLoader/>;
    }
}

export default Report;
