import * as React from 'react';

import ROUTES from "../../../platform/constants/routes";
import { byPrivateRoute } from "../../../platform/decorators/routes";
import Table from "../../../components/table";
import NoProfilePicture from "../../../assets/images/no_profile_picture.png";
import NoBroductPicture from '../../../assets/images/product_default.png'
import EmptyDataImg from '../../../assets/images/file_document.png'


import {
    AnnouncementEstateTypeEnum,
    AnnouncementStatusEnum,
    AnnouncementStatusViewEnum, AnnouncementTypeEnum,
    ColorsStatus, IAddSaveFilterRequestModel,
    IPagingRes
} from '../../../platform/constants/interfaces'

import AnnouncementController, {IPendingUsers, IUserApproved} from '../../../platform/api/announcement'
import PageLoader from 'src/components/page-loader';
import Paging from 'src/components/paging';
import * as moment from 'moment';
import { Link } from 'react-router-dom';
import Connection from "../../../platform/services/connection";
import FilterAnnouncement from "./filter-announcement";
import {
    AnnouncementCLandDropdown,
    AnnouncementCommercialDropdown,
    AnnouncementResidentialDropdown
} from "../../../platform/constants/dropdowns";


interface IState {
    data: IPagingRes<IPendingUsers> | null,
    openFilterClassName: string,
    closeFilterClassName: string,
    hasOpenFilter: boolean,
    filterName: string,
    CloseName: string,
    activePage: number,
    priceString:string,
    form:IAddSaveFilterRequestModel,
    pageFilter:boolean,
};






@byPrivateRoute(ROUTES.ANNOUNCEMENTS_REJECTED)
class Rejected extends React.Component<{}, {}> {
    public state: IState = {
        openFilterClassName: 'open-filter-block',
        closeFilterClassName: 'close-filter-block',
        hasOpenFilter: true,
        filterName: 'Filter',
        CloseName: 'Close',
        data: null,
        activePage: 1,
        priceString:'',
        form: {
            search: '',
            address: '',
            announcementType: null,
            announcementEstateType: null,
            announcementResidentialType: null,
            announcementRentType: null,
            landType: null,
            commercialType: null,
            announcementStatus: AnnouncementStatusEnum.Rejected,
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
            city: '',


        },
        pageFilter:false,
    }
    private toggleOpenFilter = () => {
        this.setState({
            hasOpenFilter: !this.state.hasOpenFilter
        });
    };
    private createPrice = (price: string) => {

        return Number(price).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    private fetchData = async (page: number) => {

            const result = await AnnouncementController.FilterAnnouncement({ page, count: 10, announcementFilter: this.state.form });
            this.setState(async()=>{
                if(result.data.data){
                    const arr = Object.values(result.data.data);
                    arr.map( (item : IUserApproved) =>{
                        item.price = this.createPrice(item.price.toString())
                    })
                }
            });
            this.setState({
                data: result.data,
            })

    };
    public changeFilters = async (form: IAddSaveFilterRequestModel) => {
            const query = Connection.queryFromObject(form);
            window.routerHistory.replace(query ? `${ROUTES.ANNOUNCEMENTS_REJECTED}?${query}` : ROUTES.ANNOUNCEMENTS_REJECTED);
            this.setState({form});
            const result = await AnnouncementController.FilterAnnouncement({ page:1, count: 10, announcementFilter: form });
            this.setState(async()=>{
                if(result.data.data){
                    const arr = Object.values(result.data.data);
                    arr.map( (item : IUserApproved) =>{
                        item.price = this.createPrice(item.price.toString())
                    })
                }
            });
            this.setState({
                data: result.data,
                pageFilter:true,
            });
        };


    public componentDidMount() {
        this.fetchData(1);
    }
    private columnConfig = [
        {
            name: 'Announcement',
            style: { minWidth:370 },
            cell: (row: any) =>
                <Link to={ROUTES.ANNOUNCEMENT_DETAILS_REJECTED.replace(':id', row.id.toString())}>    <div className='B-announcement-user'>
                    <div className='B-announcement-img' style={{ backgroundImage: `url("${(row.photo.photo || row.photo.photoBlur) || NoBroductPicture}")` }} />
                    <div className='B-announcement-user-info' >
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
            style: { minWidth: 100 },
            name: 'Property',
            cell: (row: any) => AnnouncementEstateTypeEnum[row.announcementEstateType],

        },
        {
            style: { minWidth: 100 },
            name: 'Type',
            cell: (row: any) => AnnouncementTypeEnum[row.announcementType],
        },
        {
            style: { minWidth: 150 },
            name: 'User',
            cell: (row: any) =>
            <Link to={ROUTES.USER_DETAILS.replace(':id', row.userId.toString())}>
             <div className='announcement-user' title={row.userName}>
                    <div className='announcement-user-img' style={{ backgroundImage: `url("${(row.userProfilePhoto.photo || row.userProfilePhoto.photoBlur) || NoProfilePicture}")` }} />
                    <h3>{row.userName}</h3>
                </div>
                </Link>


        },
        {

            style: { minWidth: 80 },
            name: 'Date',
            cell: (row: any) => moment(row.createDate).format('DD MMM YYYY').valueOf(),

        },
        {
            style: { minWidth: 80 },
            name: 'Status',
            cell: (row: any) =>
                <div className='announcement-prop'>
                    <div className='announcement-status'>
                        <p style={{ color: ColorsStatus[row.announcementStatus] }}>{AnnouncementStatusViewEnum[row.announcementStatus]}</p>
                    </div>

                </div>
        },

    ];



    public render() {
        const { hasOpenFilter, data } = this.state;

        return data ? (
            <div>
                <div className='B-announcement'>
                    <div className='B-announcement-header'>
                        <div className='B-announcement-main'>
                            <div className="B-announcement-title">
                                <h3>Rejected announcements</h3>
                                <div className='total-count'>
                                    <p>{data.itemCount}</p>
                                    <span>Rejected</span>
                                </div>
                            </div>
                            <div className='B-announcement-filter btn'>
                                <button
                                    onClick={this.toggleOpenFilter}>{hasOpenFilter ? this.state.filterName : this.state.CloseName}</button>
                            </div>
                        </div>
                        {!this.state.hasOpenFilter ?  <FilterAnnouncement   form={this.state.form} onChange={this.changeFilters}  /> : null}

                    </div>
                    <div className='B-announcement-list'>
                        {(data.data && data.data.length!==0)?
                            <div className='B-announcement-list-box'>
                                <Table<IPendingUsers>
                                    data={data.data || data.data}
                                    columnConfig={this.columnConfig}
                                />
                            </div>
                            :   <div className='B-data-empty'>
                                <div className='B-data-empty-img' style={{ backgroundImage: `url("${EmptyDataImg}")` }} />
                                <p>Rejected announcement list is empty</p>
                            </div>}

                    </div>
                    <div className='B-pagination'>
                        <Paging
                            activePage={1}
                            page={data.pageCount}
                            onChange={this.fetchData}
                        />
                    </div>
                </div>
            </div>
        ) : <PageLoader />;
    }
}

export default Rejected;
