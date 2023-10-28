import * as React from 'react';
import alertify from 'alertifyjs';

import Modal from './modal';
import LoaderContent from './loader-content';
import DatePicker from "react-datepicker";
import Select from './select';
import {getPageInitialFilter} from 'src/platform/services/shared-storage';
import {SortNotifActionDropdown, SortNotifUserDropdown} from 'src/platform/constants/dropdowns';
import
  NotificationController,
{
  PushNotificationActionType,
  PushNotificationUserType
} from 'src/platform/api/notification';
import {
  AnnouncementStatusEnum,
  IAddSaveFilterRequestModel,
  IDropdownOption,
  IPagingRes
} from 'src/platform/constants/interfaces';
import *  as moment from 'moment';
import ClickOutside from "./click-outside";
import AnnouncementController, {IUserApproved} from "../platform/api/announcement";
import NoBroductPicture from "../assets/images/product_default.png";

interface IProps {
  onClose(): void;
  updateList():void;
}

interface IFilter {
  orderActionType: PushNotificationActionType | null;
  orderUserType: PushNotificationUserType | null;
};

export interface IFormForPushNotification {
  title: string,
  arabianTitle: string,
  description: string,
  arabianDescription: string,
  sendingDate: string,
  pushNotificationUserType: PushNotificationUserType | null,
  pushNotificationActionType: PushNotificationActionType | null,
  announcementId?: number
}

interface IState {
  activeLanguage: number;
  submitLoading: boolean;
  startDate: any;
  startTime: any;
  endTime: any;
  startDateSent: any;
  startTimeSent: any;
  endTimeSent: any;

  isOpenHour: boolean,
  form: IFormForPushNotification;
  count: number,
  clearHour: boolean,
  isOpenMinute: boolean,
  clearMinute: boolean,
  announcementFilter: IAddSaveFilterRequestModel,
  announcementData: IPagingRes<IUserApproved> | null,
  isOpenAnnouncementList: boolean,
  loading: boolean,
  isScroll: boolean,
  isOpenImage: boolean,
  announcementImage: string,
  errorList: {
    title: boolean,
    description: boolean,
    arabianTitle: boolean,
    arabianDescription: boolean,
    sendingDate: boolean,
    pushNotificationUserType: boolean,
    pushNotificationActionType: boolean,
    dateHours: boolean,
    dateMinute: boolean
  }

};

class NotificationModal extends React.Component<IProps, IState> {
  private filter = getPageInitialFilter<IFilter>('users_filter', {
    orderActionType: null,
    orderUserType: null,
  });

  private page = 1;
  private count = 20;
  private announcementListCount = 0;

  private announcementListBlock = React.createRef<HTMLDivElement>();

  public state: IState = {
    activeLanguage: 1,
    submitLoading: false,
    startDate: null,
    startTime: null,
    endTime: null,
    startDateSent: null,
    startTimeSent: null,
    endTimeSent: null,
    form: {
      title: '',
      arabianTitle: '',
      description: '',
      arabianDescription: '',
      sendingDate: '',
      pushNotificationUserType: null,
      pushNotificationActionType: null,
    },
    count: 0,
    isOpenHour: false,
    clearHour: false,
    isOpenMinute: false,
    clearMinute: false,
    announcementFilter: {
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
      city: '',

    },
    announcementData: null,
    isOpenAnnouncementList: false,
    loading: false,
    isScroll: false,
    isOpenImage: false,
    announcementImage: '',
    errorList: {
      title: false,
      description: false,
      arabianTitle: false,
      arabianDescription: false,
      sendingDate: false,
      pushNotificationUserType: false,
      pushNotificationActionType: false,
      dateHours: false,
      dateMinute: false
    }
  }


  private change = (e: any) => {
    const {form} = this.state;
    form[e.currentTarget.name] = e.currentTarget.value;
    this.setState({form, submitLoading: false});
  }



  private TO_ISO_FORMAT(date: any) {
    const offset = (new Date(date)).getTimezoneOffset() * 60000;
    const localISOTimes = (new Date(new Date(date).getTime() - offset)).toISOString().slice(0, -1);
    return localISOTimes;
  }


  private changeActionType = (choosed: IDropdownOption<PushNotificationActionType> | null) => {
    const {form} = this.state
    this.filter.orderActionType = choosed ? choosed.value : null;
    form.pushNotificationActionType = this.filter.orderActionType;
    this.setState({form, submitLoading: false})
  };
  private changeUserType = (choosed: IDropdownOption<PushNotificationUserType> | null) => {
    const {form} = this.state
    this.filter.orderUserType = choosed ? choosed.value : null;
    form.pushNotificationUserType = this.filter.orderUserType;
    this.setState({form, submitLoading: false})

  };
  private handleChangeDate = (date: any) => {

    if (date === null) {
      this.setState({
        startDate: null,
        endTime: '',
        startTime: '',
        clearHour: false,
        clearMinute: false,
        submitLoading: false,
      })

    }
    // const selectedDate = .format('YYYY MMM DD').valueOf();
    const selectDay = Number(moment(date).format('DD').valueOf());


    this.arrHour = [];
    this.arrMinute = [];
    if (selectDay === new Date().getDate()) {
      const hour = new Date().getHours();
      const minute = new Date().getMinutes();
      this.incrementHour(hour);
      this.incrementMinute(minute)
    } else {
      this.incrementHour(0)
      this.incrementMinute(0)
    }
    if (date) {
      this.setState({
        startDate: date,
        startDateSent: date.toLocaleString().split(',')[0],
        endTime: '',
        startTime: '',
        clearHour: false,
        clearMinute: false,
        submitLoading: false,

      });
    }
  };
  private openHour = () => {
    this.setState({isOpenHour: !this.state.isOpenHour})
  };
  private closeHour = () => {
    this.setState({isOpenHour: false})
  };
  private clearHour = () => {
    this.setState({startTime: '', startTimeSent: '', clearHour: false})
  };
  private selectHour = (e: any) => {
    this.setState({
      startTime: e.target.getAttribute('data-hour'),
      isOpenHour: false,
      clearHour: true,
      startTimeSent: e.target.getAttribute('data-hour'),
      submitLoading: false
    })
    this.incrementMinute(0)
  };
  private arrHour = new Array();
  // private currentHour:number = 0;
  // private selectedHout: number = 0

  private incrementHour = (HourNumber: number) => {
    for (let i = HourNumber; i < 24; i++) {
      if (i <= 9) {
        this.arrHour.push('0' + i.toString())
      } else {
        this.arrHour.push(i.toString())
      }
    }
  }


  private openMinute = () => {
    this.setState({isOpenMinute: !this.state.isOpenMinute})
  };
  private closeMinute = () => {
    this.setState({isOpenMinute: false})
  };
  private clearMinute = () => {
    this.setState({endTime: '', endTimeSent: '', clearMinute: false})
  };
  private selectMinute = (e: any) => {
    this.setState({
      endTime: e.target.getAttribute('data-hour'),
      isOpenMinute: false,
      clearMinute: true,
      endTimeSent: e.target.getAttribute('data-hour'),
      submitLoading: false
    })
  };
  private arrMinute = new Array();
  private incrementMinute = (MinuteNumber: number) => {
    setTimeout(()=>{
      const hour = new Date().getHours();
      const minute = new Date().getMinutes();

      this.arrMinute = []
      if(hour===+this.state.startTime){
        for (let i = minute; i < 60; i++) {
          if (i <= 9) {
            this.arrMinute.push('0' + i.toString())
          } else {
            this.arrMinute.push(i.toString())
          }
        }
      }else{
        for (let i = MinuteNumber; i < 60; i++) {
          if (i <= 9) {
            this.arrMinute.push('0' + i.toString())
          } else {
            this.arrMinute.push(i.toString())
          }
        }
      }

    },0)

  };

  private createPrice = (price: string) => {
    return Number(price).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  private getAnnouncementList = async () => {
    this.setState({loading: true}, async () => {
      const result = await AnnouncementController.FilterAnnouncement({
        page: this.page,
        count: this.count,
        announcementFilter: this.state.announcementFilter
      });
      if (result.data.data) {
        result.data.data.map((item: IUserApproved) => {
          item.price = this.createPrice(item.price.toString())
        })
      }
      if (result.success) {
        this.setState({
          announcementData: result.data,
          loading: false
        });
        this.announcementListCount = result.data.pageCount
      }
    })
    return this.state.announcementData
  }

  private changeTitle = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const {announcementFilter} = this.state;
    announcementFilter.search = e.currentTarget.value;
    this.page = 1;
    this.getAnnouncementList()
  };

  private openAnnouncementList = () => {
    this.setState({isOpenAnnouncementList: true})
    this.getAnnouncementList();
    this.page = 1
  }

  private closeAnnouncementList = () => {
    this.setState({isOpenAnnouncementList: false})
  }

  private onScrollAnnouncementList = (e: React.SyntheticEvent) => {
    const {announcementData, loading} = this.state;
    if (e.currentTarget) {
      if (e.currentTarget.scrollTop > e.currentTarget.scrollHeight - 250 && !loading && announcementData && this.announcementListCount > 1) {
        this.page += 1;
        if (this.page <= this.announcementListCount) {
          this.getAnnouncementListOnScroll();
        }
      }
    }

  }

  private getAnnouncementListOnScroll = async () => {
    const result = await AnnouncementController.FilterAnnouncement({
      page: this.page,
      count: this.count,
      announcementFilter: this.state.announcementFilter
    });
    if (result.data.data) {
      result.data.data.map((item: IUserApproved) => {
        item.price = this.createPrice(item.price.toString())
      })
    }

    if (this.state.announcementData && result.data) {
      if (this.state.announcementData.data) result.data.data = [...this.state.announcementData.data, ...(result.data.data || [])];
      this.setState({
        announcementData: result.data,
        loading: false,
      });
    }
  }


  private selectAnnouncement = (item: IUserApproved) => {
    const {announcementFilter, form} = this.state
    this.setState({isOpenImage: true, announcementImage: item.photo.photo, submitLoading:false})
    announcementFilter.search = item.title;
    form.announcementId = item.id
    this.closeAnnouncementList()
  }

  private clearSelectAnnouncement = (e: React.SyntheticEvent<HTMLElement>) => {
    e.stopPropagation()
    const {announcementFilter, form} = this.state
    this.setState({isOpenImage: false, announcementImage: '', submitLoading: false})
    announcementFilter.search = '';
    form.announcementId = 0
    this.closeAnnouncementList()
  }

  private validation = () => {
    const {form, startDate, endTime, startTime} = this.state;

    let isValidation = true;
    const errorList = {
      title: false,
      description: false,
      arabianTitle: false,
      arabianDescription: false,
      sendingDate: false,
      pushNotificationUserType: false,
      pushNotificationActionType: false,
      dateHours: false,
      dateMinute: false
    };
    if (!startTime) {
      errorList.dateHours = true;
      isValidation = false;
    }
    if (!endTime) {
      errorList.dateMinute = true;
      isValidation = false;
    }
    if (!form.title.length) {
      errorList.title = true;
      isValidation = false;
    }
    if (!form.arabianTitle.length) {
      errorList.arabianTitle = true;
      isValidation = false;
    }
    if (!form.description.length) {
      errorList.description = true;
      isValidation = false;
    }
    if (!form.arabianDescription.length) {
      errorList.arabianDescription = true;
      isValidation = false;
    }
    if (!startDate) {
      errorList.sendingDate = true;
      isValidation = false;
    }
    if (form.pushNotificationActionType === null) {
      errorList.pushNotificationActionType = true;
      isValidation = false;
    }
    if (form.pushNotificationUserType === null) {
      errorList.pushNotificationUserType = true;
      isValidation = false;
    }
    if (!form.title.length || !form.arabianTitle.length || !form.description.length || !form.arabianDescription.length) {
      alertify.error('Please fill title description in two languages')
    }
    this.setState({errorList})
    return isValidation
  }

  private submit = async () => {
    this.setState({submitLoading: true}, async () => {
      const {form} = this.state
      if (this.validation()) {
        form.sendingDate = moment(this.TO_ISO_FORMAT(this.state.startDateSent + ' ' + this.state.startTimeSent + ':' + this.state.endTimeSent)).toISOString()
        if(form.announcementId){
          delete form.pushNotificationUserType
        }
        const result = await NotificationController.CreateNotification(form);
        if (result.success) {
          this.props.onClose();
          this.props.updateList();
        } else {
          this.setState({submitLoading: false})
        }
      }
    })


  }

  private changeLanguage = (active: number) => {
    this.setState({
      activeLanguage: active
    })

  }


  public render() {
    const {onClose} = this.props;
    const {submitLoading, form, errorList, activeLanguage} = this.state;

    return (

      <Modal className="B-notification-modal" onClose={onClose}>
        <div className="B-notification-block">
          <div className="B-notification-title">
            <h3>Create push notifications</h3>
          </div>
          <div className="B-notification-components">
            <div className="B-notification-box">
              <div className="B-notification-subtitle">
                <h3>Notification description</h3>
              </div>
              <ul className="P-change-language">
                <li onClick={() => this.changeLanguage(1)}
                    className={`${activeLanguage === 1 ? 'P-active' : ''}`}>English
                </li>
                <li onClick={() => this.changeLanguage(2)}
                    className={`${activeLanguage === 2 ? 'P-active' : ''}`}>Arabian
                </li>
              </ul>
              <div className="B-notification-input-cnt">
                {activeLanguage === 1 ? <div className={`B-notification-input ${errorList.title ? 'P-error' : ''}`}>
                  <label>
                    <input
                      name='title'
                      value={form.title}
                      type="text"
                      placeholder="Write title"
                      autoComplete='off'
                      onChange={this.change}/>
                  </label>
                </div> : <div className={`B-notification-input ${errorList.arabianTitle ? 'P-error' : ''}`}>
                  <label>
                    <input
                      name='arabianTitle'
                      value={form.arabianTitle}
                      type="text"
                      placeholder="Write title"
                      autoComplete='off'
                      onChange={this.change}/>
                  </label>
                </div>}


                {activeLanguage === 1 ?
                  <div className={`B-notification-input ${errorList.description ? 'P-error' : ''}`}>
                    <label>
                    <textarea
                      name='description'
                      value={form.description}
                      placeholder="Write comment..."
                      onChange={this.change}/>
                    </label>
                  </div> : <div className={`B-notification-input ${errorList.arabianDescription ? 'P-error' : ''}`}>
                    <label>
                    <textarea
                      name='arabianDescription'
                      value={form.arabianDescription}
                      placeholder="Write comment..."
                      onChange={this.change}/>
                    </label>
                  </div>}

              </div>
              <div className="B-notification-select">
                <div className={`B-notification-data ${errorList.sendingDate ? 'P-error' : ''}`}>
                  <DatePicker
                    isClearable={this.state.startDate}
                    placeholderText="Choose date"
                    selected={this.state.startDate}
                    onChange={this.handleChangeDate}
                    minDate={moment().toDate()}
                    dateFormat="dd  MMMM  yyyy"
                  />
                </div>

                <div className="B-notification-time G-flex-justify-between">
                  <div className={`B-data-notific-time ${errorList.dateHours ? 'P-error' : ''}`}>
                    <ClickOutside onClickOutside={this.closeHour}>
                      <div className='select-data-time-block'>
                        <div className='selected-time' onClick={this.openHour}>
                          {this.state.startTime ?
                            <span
                              className='selected-time-value'>{this.state.startTime}:00</span>
                            :
                            <span className='selected-time-placeholder'>HH</span>
                          }
                          {this.state.clearHour ? <span onClick={this.clearHour}
                                                        className='selected-time-clear'>x</span> : null}
                        </div>
                        {this.state.isOpenHour && this.arrHour.length !== 0 ?
                          <div className='select-data-option'>
                            <ul>
                              {this.arrHour.map((item, index) => {
                                return <li key={index} data-hour={item}
                                           onClick={this.selectHour}>{item}:00</li>

                              })}

                            </ul>
                          </div>
                          : null}
                      </div>
                    </ClickOutside>
                  </div>

                  <span> : </span>
                  <div className={`B-data-notific-time ${errorList.dateMinute ? 'P-error' : ''}`}>
                    <ClickOutside onClickOutside={this.closeMinute}>
                      <div className='select-data-time-block'>
                        <div className='selected-time' onClick={this.openMinute}>
                          {this.state.endTime ?
                            <span
                              className='selected-time-value'>{this.state.endTime}</span>
                            :
                            <span className='selected-time-placeholder'>MM</span>
                          }
                          {this.state.clearMinute ? <span onClick={this.clearMinute}
                                                          className='selected-time-clear'>x</span> : null}
                        </div>
                        {this.state.isOpenMinute && this.arrMinute.length !== 0 ?
                          <div className='select-data-option'>
                            <ul>
                              {this.arrMinute.map((item, index) => {
                                return <li key={index} data-hour={item}
                                           onClick={this.selectMinute}>{item}</li>

                              })}

                            </ul>
                          </div>
                          : null}
                      </div>
                    </ClickOutside>
                  </div>
                </div>

              </div>
            </div>
            <div className="B-notification-box">
              <div className="B-notifselected-block">
                <div className="B-selected-notif">
                  <div className="B-notification-subtitle">
                    <h3>Notification action</h3>
                  </div>
                  <div
                    className={`B-notification-input-cnt  ${errorList.pushNotificationActionType ? 'P-error' : ''}`}>
                    <Select<any>
                      placeholder="Select..."
                      placeholderOpacity={true}
                      options={SortNotifActionDropdown}
                      onChange={this.changeActionType}
                      clear={true}

                    />
                  </div>
                </div>

                <div className="B-selected-notif">
                  <div className="B-notification-subtitle">
                    <h3>Notification users</h3>
                  </div>
                  <div
                    className={`B-notification-input-cnt  ${errorList.pushNotificationUserType ? 'P-error' : ''}`}>
                    <Select<any>
                      placeholder="Select..."
                      placeholderOpacity={true}
                      options={SortNotifUserDropdown}
                      onChange={this.changeUserType}
                      clear={true}

                    />

                  </div>
                </div>


              </div>
            </div>
              <div className="B-notification-box">
                <div className="B-notifselected-block">
                  <div className="B-selected-notif G-notification-announcement">
                    <div className="B-notification-subtitle">
                      <h3>Select announcement</h3>
                    </div>
                    <div className="G-select-announcement-notification">
                      <div className='G-select-announcement-notification-header' onClick={this.openAnnouncementList}>
                        {this.state.isOpenImage ?
                            <span className="G-close-icon" onClick={this.clearSelectAnnouncement}/> : null}
                        {this.state.isOpenImage ? <div className="G-selected-announcement-notification-image"
                                                       style={{backgroundImage: `url("${this.state.announcementImage}")`}}/> : null}
                        <div className='G-selected-announcement-notification-input'>
                          <label>
                            <input name='search' value={this.state.announcementFilter.search} type="text"
                                   onChange={this.changeTitle}/>
                          </label>
                        </div>
                      </div>
                      {this.state.isOpenAnnouncementList ?
                          <ClickOutside onClickOutside={this.closeAnnouncementList}>
                            <div className='G-select-announcement-notification-body' ref={this.announcementListBlock}
                                 onScroll={this.onScrollAnnouncementList}>
                              {this.state.announcementData && this.state.announcementData.data ? <>
                                {this.state.announcementData.data.length ?
                                    <>
                                      {this.state.announcementData.data.map((item, index) => {
                                        return <div className='B-announcement-user'
                                                    onClick={() => this.selectAnnouncement(item)} key={index}>
                                          <div className='B-announcement-img'
                                               style={{backgroundImage: `url("${(item.photo.photo || item.photo.photoBlur) || NoBroductPicture}")`}}/>
                                          <div className='B-announcement-user-info'>
                                            <div className='B-announcement-user-title'>
                                              <p>{item.title}</p>
                                            </div>
                                            <div className='B-announcement-sub-title'>
                                              <p>{item.address}</p>
                                            </div>
                                            <div className='B-announcement-price'>
                                              <p>{item.price}</p>
                                              <span>SAR </span>
                                            </div>
                                          </div>
                                        </div>
                                      })}
                                      {this.state.loading ? <div className="lds-ellipsis">
                                        <div/>
                                        <div/>
                                        <div/>
                                        <div/>
                                      </div> : null}
                                    </>
                                    :
                                    <div><p className='G-notification-announcement-empty'>Announcement list is empt</p>
                                    </div>
                                }

                              </> : <div className="lds-ellipsis">
                                <div/>
                                <div/>
                                <div/>
                                <div/>
                              </div>}

                            </div>

                          </ClickOutside> : null}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>


          <div className="B-classic-card-control-buttons btn">
            <p
                className="B-classic-card-cancel-button"
                onClick={onClose}
            >Cancel</p>
            <LoaderContent
                loading={submitLoading}
                className="B-classic-card-modify-button"
                onClick={this.submit}
            >Save</LoaderContent>
          </div>
        </Modal>
    );
  }
}

export default NotificationModal;
