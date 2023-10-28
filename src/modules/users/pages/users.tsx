import * as React from 'react';

import ROUTES from '../../../platform/constants/routes';
import Table from '../../../components/table';
import PageLoader from '../../../components/page-loader';
import {byPrivateRoute} from '../../../platform/decorators/routes';
import UserController, {
    ColorUserStatus,
    IFilterUserList,
    IGetAdminUserListResModel,
    UserStatusTypeEnum,
    UserStatusTypeViewEnum
} from '../../../platform/api/user';
import NoProfilePicture from '../../../assets/images/no_profile_picture.png';
import Paging from 'src/components/paging';
import {IPagingRes} from 'src/platform/constants/interfaces';
import Connection from "../../../platform/services/connection";
import UserFilter from "./user-filter";
import BlockModal from "../../../components/block-user-modal";
import {Link} from "react-router-dom";
import alertify from "alertifyjs";
// import EmptyDataImg from "../../../assets/images/file_document.png";


interface IState {
    data: IPagingRes<IGetAdminUserListResModel> | null,
    activePage: number,
    form: IFilterUserList,
    hasOpenFilter: boolean,
    filterName: string,
    CloseName: string,
    openBlockUser: boolean
    blockUser: {
        userId: number;
        day: number;
    };
}


@byPrivateRoute(ROUTES.USERS)
class Users extends React.Component<{}, {}> {

    public state: IState = {
        data: null,
        activePage: 1,
        form: {
            announcementCount: '',
            fullName: '',
            phone: '',
            email: '',
            city: '',
            userStatusType: null,
            dateFrom: '',
            page: 1,
            count: 10,
        },
        hasOpenFilter: true,
        filterName: 'Filter',
        CloseName: 'Close',
        openBlockUser: false,
        blockUser: {
            userId: 0,
            day: 0,
        }


    }


    public componentDidMount() {
        this.fetchData(1);
    }

    private toggleOpenFilter = () => {
        this.setState({
            hasOpenFilter: !this.state.hasOpenFilter
        });
    };
    private columnConfig = [
        {
            name: 'Name',
            style: {minWidth: 200},
            cell: (row: any) =>
                <Link to={ROUTES.USER_DETAILS.replace(':id', row.id.toString())}>
                    <div className='announcement-user'>
                        <div className='announcement-user-img'
                             style={{backgroundImage: `url("${row.profilePhoto.photo || NoProfilePicture}")`}}/>
                        <h3>{row.fullName || 'missing name'}</h3>
                    </div>
                </Link>
        },
        {
            style: {minWidth: 140},
            name: 'Announcements',
            cell: (row: any) => <p>{row.announcementCount}</p>,
        },
        {
            style: {minWidth: 150},
            name: 'Phone number',
            cell: (row: any) => <p> {row.phoneCode +  row.phone || '-'}</p>,
        },
        {
            style: {minWidth: 100},
            name: 'Email',
            cell: (row: any) => <p>{row.email || '-'}</p>,
        },
        {
            style: {minWidth: 100},
            name: 'Location',
            cell: (row: any) => <p>{row.city || '-'}</p>,
        },
        {
            style: {minWidth: 100},
            name: 'IP country',
            cell: (row: any) => <p>{row.ipLocation || '-'}</p>,
        },
        {
            style: {minWidth: 150, maxWidth: 150},
            name: 'Status',
            cell: (row: any) => {
                return <div className='G-user-status-block'>
                    <div className='G-user-status-title'>
                        <p style={{color: ColorUserStatus[row.userStatusType]}}>{UserStatusTypeViewEnum[row.userStatusType]} </p>
                    </div>
                    {row.userStatusType !== UserStatusTypeEnum.Deleted ?
                        <div className='announcement-click-style'>
                            <div className='click-announcement'>
                                <span/>
                                <span/>
                                <span/>
                            </div>
                            <div className='announcement-setting'>
                                <ul>
                                    {row.isBlocked ? <li onClick={this.unBlockUser} data-id={row.id}>Unblock</li> :
                                        <li data-id={row.id} onClick={this.openBlockMenuClick}>Block</li>}
                                    <li data-id={row.id} onClick={this.DeleteUser}>Delete</li>
                                </ul>
                            </div>
                        </div> : null}
                </div>
            }

            ,
        },
    ];


    private unBlockUser = async (e: any) => {
        const currentUserId = e.target.getAttribute('data-id');
        const result =  await UserController.UnBlockUser(currentUserId);
        if(result.success){
            this.fetchData(1);
            alertify.success('This user is already active',2);

        }

    };
    private DeleteUser = async (e: any) => {
        const currentUserId = e.target.getAttribute('data-id');
        await UserController.DeleteUser(currentUserId);
        this.fetchData(1);
    };
    private openBlockMenuClick = (e: any) => {
        this.setState({
            openBlockUser: true,
            blockUser: {
                userId: Number(e.target.getAttribute('data-id')),
                day: 0
            }
        })

    };
    private closeBlockMenuClick = () => {
        this.setState({openBlockUser: false})
    };
    private fetchData = async (page: number) => {
        this.setState({
            form: {
                ...this.state.form,
                page
            }
        }, async () => {
            const result = await UserController.FilterUsers(this.state.form);
            this.setState({
                data: result.data,
                pageFilter: true,
            });
        });

    };


    public changeFilters = async (form: IFilterUserList) => {
        form.page = 1;
        const query = Connection.queryFromObject(form);
        this.setState({ form }, async() => {
            window.routerHistory.replace(query ? `${ROUTES.USERS}?${query}` : ROUTES.USERS);
            const result = await UserController.FilterUsers(form);

            this.setState({
                data: result.data,
                pageFilter: true,
            });
        });
    };

    public resetFilter = () => {
        this.setState({
            form: {
                announcementCount: '',
                fullName: '',
                phone: '',
                email: '',
                city: '',
                userStatusType: null,
                dateFrom: '',
                page: 1,
                count: 10,
            }
        }, () => {
            this.changeFilters(this.state.form)
        })
    }

    public render() {
        const {data, hasOpenFilter} = this.state;
        return data ? (
          <div>
              <div className='B-announcement-header'>
                  <div className='B-announcement-main'>
                      <div className="B-announcement-title">
                          <h3>Users</h3>
                          <div className='total-count'>
                              <p>{data.itemCount}</p>
                              <span>users</span>
                          </div>
                      </div>
                      <div className='G-flex-align-center'>
                          {!hasOpenFilter ? <div className='B-announcement-filter btn' style={{marginRight: '15px'}}>
                              < button
                                onClick={this.resetFilter}>Reset
                              </button>
                          </div> : null}
                          <div className='B-announcement-filter btn'>
                              <button
                                onClick={this.toggleOpenFilter}>{hasOpenFilter ? this.state.filterName : this.state.CloseName}</button>
                          </div>
                      </div>

                  </div>
                  {!this.state.hasOpenFilter ?
                    <UserFilter form={this.state.form} onChange={this.changeFilters}/> : null}

              </div>
              <div className='B-user-list'>
                  {data.data.length ?
                    <div className='B-user-list-box'>
                        <Table<IGetAdminUserListResModel>
                          data={data.data}
                          columnConfig={this.columnConfig}
                          // redirectUrl={row => ROUTES.USER_DETAILS.replace(':id', row.id.toString())}
                        />
                    </div> : <div className='B-data-empty'>
                        <div className='B-data-empty-img icon-plus02'/>
                        <p>User list is empty</p>
                    </div>}

              </div>
              <div className='B-pagination'>
                  <Paging
                    activePage={this.state.form.page}
                    page={data.pageCount}
                    onChange={this.fetchData}
                  />
              </div>
                {this.state.openBlockUser ?
                    <BlockModal dataFetch = { async ()=>{
                       await  this.fetchData(1)
                    }} form={this.state.blockUser} onClose={this.closeBlockMenuClick}/> : null}
            </div>

        ) : <PageLoader/>;
    }
}

export default Users;
