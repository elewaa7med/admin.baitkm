import * as React from 'react';
import ROUTES from '../../platform/constants/routes';
import Statistic from './components/statistics-box'
import { byPrivateRoute } from '../../platform/decorators/routes';
import { Doughnut, Bar, HorizontalBar } from 'react-chartjs-2';
import AnnouncementController, {
    IDashboardAnnouncementStatisticModel,
    IDashboardAnnouncementStatisticRM,
    IGetDashboardAnnouncementList,
    IStatisticsData,
} from '../../platform/api/announcement'
import PageLoader from 'src/components/page-loader';
import * as moment from 'moment';
import DatePickerSelectDay from '../../components/date-picker-select-day/date-picker-select-day';

const optionsDought = {
    maintainAspectRatio: false,
    responsive: true,
}



const chartBar = {
    labels: [] as string[],
    datasets: [
        {
            label: 'hour',
            backgroundColor: '#EE6B45',
            borderColor: '#EE6B45',
            borderWidth: 5,
            scaleLineColor: 'rgba(0,0,0,0)',
            data: [] as number[],
            title: 'minute',
            scales: {
                yAxes: [{
                    gridLines: {
                        drawBorder: false
                    }
                }]
            }
        }
    ],

};
const chartBarAnnouncements = {
    type: 'horizontalBar',
    labels: [] as string[],
    datasets: [
        {
            backgroundColor: '#EE6B45',
            borderColor: '#EE6B45',
            borderWidth: 5,
            scaleLineColor: 'rgba(0,0,0,0)',
            data: [] as number[],
            scales: {
                yAxes: [{
                    gridLines: {
                        drawBorder: false
                    }
                }]
            }
        }
    ],

};

interface IState {
    data: IGetDashboardAnnouncementList | null,
    Chocolate: string;
    Green: string;
    MidnightBlue: string;
    androidCount: number,
    iosCount: number,
    webCount: number,
    TotalUser: number,
    TotalUserWithAnnouncement: number,
    statistics: IStatisticsData[],
    loading: boolean,
    announcementStatisticsReq: IDashboardAnnouncementStatisticRM
    announcementStatisticsData: IDashboardAnnouncementStatisticModel | null


}
@byPrivateRoute(ROUTES.DASHBOARD)
class Dashboard extends React.Component<{}, {}> {
    public arrlist = new Array();

    private get dataDought() {
        return {
            labels: [
                'IOS',
                'WEB',
                'Android',
            ],
            datasets: [{
                data: [this.state.iosCount, this.state.webCount, this.state.androidCount],
                backgroundColor: [
                    '#163C45',
                    '#07A75C',
                    '#EE6B45'
                ],
                borderWidth: 0,
            }]
        };
    }
    private get dataUser() {
        return {
            labels: [
                'Total User',
                'User With Announcement',
            ],
            datasets: [{
                data: [this.state.TotalUser, this.state.TotalUserWithAnnouncement],
                backgroundColor: [
                    '#EE6B45',
                    '#163C45'
                    
                ],
                borderWidth: 0,
            }]
        };
    }
    private dataDoughtAnnounement = () => {

        return {
            labels: [
                'IOS',
                'WEB',
            ],
            datasets: [{
                data: [this.state.announcementStatisticsData ? this.state.announcementStatisticsData.saleCount : 0, this.state.announcementStatisticsData ? this.state.announcementStatisticsData.rentCount : 0],
                backgroundColor: [
                    '#EE6B45',
                    '#163C45',
                ],
                borderWidth: 0,
            }]
        };
    }

    public state: IState = {
        data: null,
        Chocolate: '#EE6B45',
        Green: '#07A75C',
        MidnightBlue: '#163C45',
        androidCount: 0,
        iosCount: 0,
        webCount: 0,
        statistics: [],
        loading: false,
        announcementStatisticsReq: {
            startDate: null,
            endDate: null
        },
        announcementStatisticsData: null,
        TotalUser: 0,
        TotalUserWithAnnouncement: 0
    };
    private createPrice = (price: string) => {
        return Number(price).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    private fetchDashboardStatistic = async () => {
        this.setState({ loading: true }, async () => {
            const result = await AnnouncementController.GetDashboardStatistic();
            if (result.success) {
                this.setState({
                    statistics: result.data || [],
                    loading: false
                })
            }
        })

    };

    private fetchData = async () => {
        const result = await AnnouncementController.GetDashboardAnnouncementList();
        this.setState(async () => {
            if (result.data) {
                const arr = Object.values(result.data)
                this.arrlist = Object.values(arr[0]);

                this.arrlist.map(item => {
                    item.price = this.createPrice(item.price.toString())
                })

            }
        });
        this.setState({
            data: result.data,
            androidCount: result.data.androidCount,
            iosCount: result.data.iosCount,
            webCount: result.data.webCount,
            TotalUser: result.data.userCount,
            TotalUserWithAnnouncement: result.data.userCreateAnnouncemtsCount,
            statistics: result.data.statistics || [],
        });
    };

    public componentDidMount() {
        this.fetchData();
        this.fetchDashboardStatistic()
    }

    private getChartData = () => {
        chartBar.labels = [];
        chartBar.datasets[0].data = [];

        this.state.statistics.forEach((x, i) => {
            chartBar.labels[i] = moment(x.day).format('DD MMM').valueOf() + " / " + x.userCount + " users";
            chartBar.datasets[0].data[i] = x.duration > 0 ? Number((x.duration / 60).toFixed(2)) : 0;

        })
        return chartBar;
    }
    private getChartDataAnnouncement = () => {
        chartBarAnnouncements.type = 'horizontalBar';
        chartBarAnnouncements.labels = ['Residential', 'Commercial', 'Land'];
        chartBarAnnouncements.datasets[0].data = [
            this.state.announcementStatisticsData ? this.state.announcementStatisticsData.residentalCount : 0,
            this.state.announcementStatisticsData ? this.state.announcementStatisticsData.comercialCount : 0,
            this.state.announcementStatisticsData ? this.state.announcementStatisticsData.landCount : 0
        ];

        return chartBarAnnouncements;
    }

    private filterAnnouncementStatistic = async (filter: IDashboardAnnouncementStatisticRM) => {
        this.setState({ announcementStatisticsReq: filter })
        const result = await AnnouncementController.DashboardAnnouncementStatistic(filter)
        if (result.success) {
            this.setState({ announcementStatisticsData: result.data }, () => {
                this.dataDoughtAnnounement()
                this.getChartDataAnnouncement()
            })
        }
    }


    public render() {
        const { data, announcementStatisticsData } = this.state;
        return data ? (
            <div>
                <div className='B-announcement-main'>
                    <div className="B-announcement-title">
                        <h3>Dashboard</h3>
                    </div>
                </div>
                <div className='B-statistics'>
                    <Statistic
                        statisticsVal={data.activeAnnouncementCount}
                        statisticsName='Active announcements'
                        path={ROUTES.ANNOUNCEMENTS}
                    />
                    <Statistic
                        statisticsVal={data.featuredAnnouncementCount}
                        statisticsName='Featured announcements'
                        path={ROUTES.ANNOUNCEMENTS_FEATURED}
                    />
                    <Statistic
                        statisticsVal={data.rejectedAnnouncements}
                        statisticsName='Rejected announcements'
                        path={ROUTES.ANNOUNCEMENTS_FEATURED}
                    />
                    <Statistic
                        statisticsVal={data.expiredAnnouncements}
                        statisticsName='Expired announcements'
                        path={ROUTES.ANNOUNCEMENTS_FEATURED}
                    />
                    <Statistic
                        statisticsVal={data.isDraftAnnouncements}
                        statisticsName='IsDraft announcements'
                        path={ROUTES.ANNOUNCEMENTS_FEATURED}
                    />
                    <Statistic
                        statisticsVal={data.unreadSupportMessagesCount}
                        statisticsName='Unread support messages'
                        path={ROUTES.SUPPORTS}
                    />
                    <Statistic
                        statisticsVal={data.pendingReportingCount}
                        statisticsName='Pending Reports'
                        path={ROUTES.REPORTS}
                    />
                </div>
                <div className='B-dashboard-employment'>
                    <div className='B-employments-dought'>
                        <div className="P-chart-header G-flex-align-center G-flex-justify-between">
                            <div className='B-dashboard-employment-title'>
                                <h3>Announcements</h3>
                            </div>
                            <DatePickerSelectDay onChange={this.filterAnnouncementStatistic} />

                        </div>
                        <div className='B-employment-box'>
                            <div className='B-chart-dought'>
                                {data ? <Doughnut
                                    data={this.dataDoughtAnnounement}
                                    options={optionsDought}
                                    height={200}
                                    width={200}
                                /> : null}

                            </div>
                            {announcementStatisticsData ? <div className='B-about-device'>
                                <ul>
                                    <li>
                                        <span style={{ backgroundColor: this.state.Chocolate }} />
                                        <p>For sale {announcementStatisticsData.saleCount}</p>
                                    </li>
                                    <li>
                                        <span style={{ backgroundColor: this.state.MidnightBlue }} />
                                        <p>For rent {announcementStatisticsData.rentCount}</p>
                                    </li>

                                </ul>
                            </div> : null}
                        </div>
                    </div>
                    <div className='B-employments-dought'>
                        <div className='B-dashboard-employment-title'>
                            <h3>Average Between User &amp; Announcement</h3>
                        </div>
                        <div className='B-employment-box'>
                            <div className='B-chart-dought'>
                                {data ? <Doughnut
                                    data={this.dataUser}
                                    options={optionsDought}
                                    height={200}
                                    width={200}
                                /> : null}

                            </div>
                            <div className='B-about-device'>
                                <ul>
                                    <li>
                                        <span style={{ backgroundColor: this.state.Chocolate }} />
                                        <p>Total User {this.state.TotalUser}</p>
                                    </li>
                                    <li>
                                        <span style={{ backgroundColor: this.state.MidnightBlue }} />
                                        <p>User with Announcement {this.state.TotalUserWithAnnouncement}</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>


                    <div className='B-employments-dought'>
                        <div className='B-dashboard-employment-title'>
                            <h3>Device Usage</h3>
                        </div>
                        <div className='B-employment-box'>
                            <div className='B-chart-dought'>
                                {data ? <Doughnut
                                    data={this.dataDought}
                                    options={optionsDought}
                                    height={200}
                                    width={200}
                                /> : null}

                            </div>
                            <div className='B-about-device'>
                                <ul>
                                    <li>
                                        <span style={{ backgroundColor: this.state.Chocolate }} />
                                        <p>Android devices {this.state.androidCount}</p>
                                    </li>
                                    <li>
                                        <span style={{ backgroundColor: this.state.MidnightBlue }} />
                                        <p>iOS devices {this.state.iosCount}</p>
                                    </li>
                                    <li>
                                        <span style={{ backgroundColor: this.state.Green }} />
                                        <p>Web devices {this.state.webCount}</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='B-dashboard-employment'>
                    <div className='B-employments-bar'>
                        <div className='B-dashboard-employment-title'>
                            <h3>Average daily usage <span>(hours and days)</span></h3>
                        </div>
                        <div className='B-employment-box'>
                            <div className='B-employment-bar'>

                                {this.state.loading ? <div className="lds-ellipsis">
                                    <div />
                                    <div />
                                    <div />
                                    <div />
                                </div> : null}
                                {this.state.statistics.length ?
                                    <Bar
                                        data={this.getChartData()}
                                        height={280}
                                        options={

                                            {
                                                scales: {
                                                    xAxes: [{
                                                        // barPercentage: 0.2,
                                                        gridLines: { display: false },
                                                        // barThickness: 10,
                                                    }]
                                                },

                                                maintainAspectRatio: false,
                                            }}
                                    /> : null}

                            </div>
                        </div>
                    </div>
                </div>
                <div className='B-dashboard-employment'>
                    <div className='B-employments-bar'>
                        <div className='B-dashboard-employment-title'>
                            <h3>Property</h3>
                        </div>
                        <div className='B-employment-box'>
                            <div className='B-employment-bar'>

                                {this.state.loading ? <div className="lds-ellipsis">
                                    <div />
                                    <div />
                                    <div />
                                    <div />
                                </div> : null}
                                {this.state.announcementStatisticsData ?
                                    <HorizontalBar
                                        data={this.getChartDataAnnouncement}
                                        height={280}
                                        type='horizontalBar'
                                        options={

                                            {
                                                scales: {
                                                    xAxes: [{
                                                        // barPercentage: 0.2,
                                                        gridLines: { display: false },
                                                        // barThickness: 10,
                                                    }]
                                                },

                                                maintainAspectRatio: false,
                                            }}
                                    /> : null}

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        ) : <PageLoader />;
    }
}

export default Dashboard;
