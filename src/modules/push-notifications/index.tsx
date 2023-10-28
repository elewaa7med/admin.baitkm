import * as React from 'react';

import ROUTES from "../../platform/constants/routes";
import { byPrivateRoute } from "../../platform/decorators/routes";
import NotificationController, { IGetNotificationList, PushNotificationUserTypeView, PushNotificationActionTypeView, PushNotificationStatusType, ColorNotification } from 'src/platform/api/notification';
import PageLoader from 'src/components/page-loader';
import Paging from 'src/components/paging';
import EmptyDataImg from '../../assets/images/file_document.png';
import { IPagingRes } from 'src/platform/constants/interfaces';
import Table from 'src/components/table';
import * as moment from 'moment';
import NotificationModal from '../../components/notification-modal'



interface IState {

    data: IPagingRes<IGetNotificationList> | null,

    activePage: number,
    livesModalOpen: boolean,
};


@byPrivateRoute(ROUTES.PUSH_NOTIFICATIONS)
class PushNotification extends React.Component<{}, {}> {


    public state: IState = {

        data: null,
        activePage: 1,
        livesModalOpen: false,
    }


    private fetchData = async (page: number) => {
        const result = await NotificationController.GetNotificationList({ page, count: 10 });
        this.setState({
            data: result.data,
        });
    }


    private openLivesModal = () => this.setState({ livesModalOpen: true });
    private closeLivesModal = () => this.setState({ livesModalOpen: false });

    public componentDidMount() {
        this.fetchData(1);
    }


    private columnConfig = [
        {
            name: 'Title',
            style: { minWidth: 100 },
            cell: (row: any) => <p className="B-notification-text-style">{row.title}</p>

        },
        {
            style: { minWidth: 300 },
            name: 'Description',
            cell: (row: any) => <p className="B-notification-text-style">{row.description}</p>,

        },
        {
            style: { minWidth: 100 },
            name: 'Users',
            cell: (row: any) => <p>{PushNotificationUserTypeView[row.pushNotificationUserType]}</p>,
        },
        {
            style: { minWidth: 80 },
            name: 'Action',
            cell: (row: any) => <p>{PushNotificationActionTypeView[row.pushNotificationActionType]}</p>

        },
        {
            style: { minWidth: 100 },
            name: 'Date',
            cell: (row: any) => moment(row.sendingDate).format('DD MMM YYYY HH:mm').valueOf(),

        },

        {
            style: { minWidth: 80 },
            name: 'Status',
            cell: (row: any) =>
                <div className='announcement-prop'>
                    <div className='announcement-status'>
                        <p style={{ color: ColorNotification[row.pushNotificationStatusType] }}>{PushNotificationStatusType[row.pushNotificationStatusType]}</p>
                    </div>
                </div>
        },

    ];

    public render() {

        const { data, livesModalOpen } = this.state;
        return data ? (
            <div className="B-announcement">
                <div className="B-announcement-header">
                    <div className="B-announcement-main">
                        <div className="B-announcement-title">
                            <h3>Push notifications</h3>
                        </div>
                        <div className="B-create-notif btn">
                            <button onClick={this.openLivesModal}>Create</button>
                        </div>
                    </div>
                </div>
                <div className='B-announcement-list  B-notifications-list'>
                    {data.data.length !== 0 ?
                        <div className='B-announcement-list-box'>
                            <Table<IGetNotificationList>
                                data={data.data}
                                columnConfig={this.columnConfig}
                            />
                        </div>
                        :
                        <div className='B-data-empty'>
                            <div className='B-data-empty-img' style={{ backgroundImage: `url("${EmptyDataImg}")` }} />
                            <p>There is not a notification yet</p>
                        </div>}
                </div>
                <div className='B-pagination'>
                    <Paging
                        activePage={1}
                        page={data.pageCount}
                        onChange={this.fetchData}
                    />
                </div>
                {livesModalOpen && <NotificationModal onClose={this.closeLivesModal} updateList={()=>this.fetchData(1)} />}
            </div>
        ) : <PageLoader />;
    }
}

export default PushNotification;
