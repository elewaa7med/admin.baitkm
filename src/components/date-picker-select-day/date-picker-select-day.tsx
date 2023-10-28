import * as React from 'react';
import ClickOutside from '../click-outside';
import DatePicker from 'react-datepicker';
import { IDropdownOption } from '../../platform/constants/interfaces';
import './style.scss'
import * as moment from 'moment';
import { IDashboardAnnouncementStatisticRM } from '../../platform/api/announcement';


interface IProps {
    onClick?(e: React.SyntheticEvent<HTMLElement>): void;

    onChange(filter: IDashboardAnnouncementStatisticRM): void;

}

interface IState {
    filter: IDashboardAnnouncementStatisticRM,
    value: number | null,
    isOpenPicker: boolean,
    announcementFilterDateList: any,
    isOpenSelectTimer: boolean,
    selectItem: any;
    activeItem: number | null
}


const AnnouncementFilterDateList = [
    {
        name: 'Today',
        value: 1,
    },
    {
        name: 'Yesterday',
        value: 2,
    },
    {
        name: 'Last week',
        value: 3,
    },
    {
        name: 'Last month',
        value: 4,
    },
    {
        name: 'Custom',
        value: 5,
    },

]

class DatePickerSelectDay extends React.Component<IProps, IState> {
    public state: IState = {
        filter: {
            startDate: null,
            endDate: null,
        },
        value: null,
        isOpenPicker: false,
        announcementFilterDateList: [],
        isOpenSelectTimer: false,
        selectItem: '',
        activeItem: null
    };

    public componentDidMount() {

        const toDay = new Date();
        const lastMonth = new Date(toDay.setMonth(toDay.getMonth() - 1));

        this.setState({
            announcementFilterDateList: AnnouncementFilterDateList, filter: {
                startDate: lastMonth,
                endDate: new Date()
            },
            selectItem: AnnouncementFilterDateList[3].name
        }, () => {
            this.props.onChange(this.state.filter)
        })


    }


    public changeAnnouncementFilter = (options: IDropdownOption<any>) => {
        const {filter} = this.state;
        this.setState({
            selectItem: options.name
        })
        const toDay = new Date();
        const toDayNew = new Date();
        switch (options.value) {
            case 1: {
                filter.startDate = toDay;
                filter.endDate = toDay;
                break;
            }
            case 2: {
                const yesterday = new Date(toDay.setDate(toDay.getDate() - 1));

                filter.startDate = yesterday;
                filter.endDate = toDayNew;
                break;
            }
            case 3: {
                const lastWeek = new Date(toDay.getFullYear(), toDay.getMonth(), toDay.getDate() - 7);
                filter.startDate = lastWeek;
                filter.endDate = toDayNew;
                break;
            }
            case 4: {
                const lastMonth = new Date(toDay.setMonth(toDay.getMonth() - 1));
                filter.startDate = lastMonth;
                filter.endDate = toDayNew;
                break;
            }
            case 5: {
                this.openDatePicker()
                break;
            }
        }
        if (options.value !== this.state.selectItem) {
            this.setState({
                activeItem: options.value
            })
        } else {
            this.setState({
                activeItem: null
            })
        }
        this.onChange();

        this.closeSelect()
    }

    private onChangeDate = (data: any, index: string) => {
        const {filter} = this.state;
        if (index === 'dateFrom') {
            filter.startDate = data
        } else {
            filter.endDate = data
        }
        this.setState({filter})
    }

    private openDatePicker = () => {
        this.setState({
            isOpenPicker: true
        })
    }

    private closeDatePicker = () => {
        this.setState({
            isOpenPicker: false
        })
    }

    private save = () => {
        const {filter} = this.state;
        if (filter.endDate && filter.startDate) {
            this.setState({
                selectItem: (moment(filter.startDate).format('DD MM YYYY').valueOf() + ' - ' + moment(filter.endDate).format('DD MM YYYY').valueOf()).toString()
            })
        }
        this.onChange();
        this.closeDatePicker()
    }

    private openSelect = () => {
        const {filter} = this.state;
        if (this.state.activeItem !== 5) {
            filter.startDate = null;
            filter.endDate = null;

        }
        this.setState({filter})
        this.setState({
            isOpenSelectTimer: true
        })
    };

    private closeSelect = () => {
        this.setState({
            isOpenSelectTimer: false
        })
    };

    private onChange = () => {
        this.props.onChange(this.state.filter)
    }

    public render() {
        const {filter, isOpenSelectTimer, selectItem} = this.state
        return (
          <div className='P-date-picker-select-day'>
              <div className="P-date-filter">
                  <label>
                      <ClickOutside onClickOutside={this.closeSelect}>
                          <div className="P-select-timer-block">
                              <div className="P-select-timer-header" onClick={this.openSelect}>
                                  {selectItem ? <p>{selectItem}</p> :
                                    <p className="P-select-placeholder">Select time</p>}
                                  <i className={isOpenSelectTimer ? 'icon-arrow_up' : 'icon-arrow_down'}/>
                              </div>

                              {isOpenSelectTimer ? <div className="P-select-timer-body">
                                  <ul>
                                      {AnnouncementFilterDateList.map((item, index) => {
                                          return <li key={index}
                                                     onClick={() => this.changeAnnouncementFilter(item)}
                                                     className={`${this.state.activeItem === item.value ? 'P-active' : ''}`}>{item.name}</li>
                                      })}
                                  </ul>
                              </div> : null}

                          </div>
                      </ClickOutside>
                  </label>
              </div>

              {this.state.isOpenPicker ?
                <ClickOutside onClickOutside={this.closeDatePicker}>

                    <div className="P-date-picker-filter">
                        <div className="P-date-picker-filter-block G-flex-align-start ">
                            <div className="P-date-picker-filter-box">
                                <p>Date from</p>
                                <DatePicker
                                  placeholderText="Choose date"
                                  onChange={(data) => this.onChangeDate(data, 'dateFrom')}
                                  dateFormat="dd  MMMM  yyyy"
                                  inline={true}
                                  selected={filter.startDate}
                                  maxDate={filter.endDate}
                                />
                            </div>
                            <div className="P-date-picker-filter-box">
                                <p>Date to</p>
                                <DatePicker
                                  placeholderText="Choose date"
                                  onChange={(data) => this.onChangeDate(data, 'dateTo')}
                                  dateFormat="dd  MMMM  yyyy"
                                  inline={true}
                                  minDate={filter.startDate}
                                  selected={filter.endDate}
                                />
                            </div>
                        </div>
                        <div className="P-save-btn G-btn">
                            <button onClick={this.save}> Save</button>
                        </div>
                    </div>
                </ClickOutside> : null}
          </div>
        );
    }
}

export default DatePickerSelectDay;
