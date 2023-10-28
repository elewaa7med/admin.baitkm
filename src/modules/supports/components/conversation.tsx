import * as React from 'react';
import {Link} from 'react-router-dom';
import * as moment from 'moment';

import ROUTES from "src/platform/constants/routes";
import Socket from 'src/components/websocket';
import {IMessageType} from 'src/platform/api/conversation';
import SendText from './send-text';
import SentImg from './send-img';
import SendAnnouncement from './send-announcement';
import SentFile from './send-file';

import AddPhotoImg from 'src/assets/images/photo.png'
import AddFileImg from 'src/assets/images/attachment.png'
import SentMessageImg from 'src/assets/images/right-arrow.png'
import NoProfilePicture from "src/assets/images/no_profile_picture.png";
import MessageController, {ICurrentSupport, ICurrentSupportList} from 'src/platform/api/message';

import 'react-image-lightbox/style.css';
import HelperComponent from 'src/platform/classes/helper-component';
import Settings from 'src/platform/services/settings';
import {IPhotoProduct} from "../../../platform/constants/interfaces";
import pdfIcon from "../../../assets/images/pdf-icon.png";
import replyIcon from "../../../assets/images/reply.png";

interface IProps {
  activeConversationId: number;
  disableSocket: boolean;
  updateItem: () => void;
};

interface IState {
  activeData: ICurrentSupport | null;
  message: string;
  loading: boolean;
  userPhoto:IPhotoProduct|null;
  userName:string;
  userAnnouncementCount:number;
  userId:number|null;
  replyData: ICurrentSupportList | null,
  isOpenReply: boolean,
  isReplayMode: boolean,
}


class Conversation extends HelperComponent<IProps, IState> {
  private messagesBox = React.createRef<HTMLDivElement>();
  private myInp = React.createRef<HTMLInputElement>();
  private page = 1;
  private messagePageCount = 1;
  private currentDate: Date;

  public state: IState = {
    activeData: null,
    loading: false,
    message: '',
    userPhoto:null,
    userName:'',
    userAnnouncementCount:0,
    userId:null,
    replyData:  null,
    isOpenReply: false,
    isReplayMode: false,
  }

  public UNSAFE_componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.activeConversationId !== this.props.activeConversationId) {
      this.page = 1;
      this.getList();
    }
  }

  private scrollToBottom = () => {
    if (this.messagesBox.current) {
      const element = this.messagesBox.current;
      element.scrollTop = element.scrollHeight;
    }
  }

  private onScrollMessage = async (e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (!this.state.loading && this.state.activeData && this.page < this.messagePageCount && e.currentTarget.scrollTop < 200) {
      this.page += 1;
      this.currentDate = new Date();
      await this.asyncSetState({ loading: true });
      this.getList();
    }
  };

  public uploadFiles = (files: Blob[] | any, typemessage: IMessageType): void => {
    if (typemessage === IMessageType.File || typemessage === IMessageType.Image) {
      Object.keys(files).map(file => {
        if (file) {
          const READER = new FileReader();
          READER.readAsDataURL(files[file]);
          READER.onload = async () => {
            const data = new FormData();
            data.append('file', files[file]);
            data.append('conversationId', this.props.activeConversationId.toString());
            data.append('SupportMessageBodyType', typemessage.toString());
            if(this.state.isReplayMode && this.state.replyData){
              data.append('ReplayMessageId', this.state.replyData.messageId.toString());
            }

            await MessageController.Send(data);
            this.page = 1;
            await this.getList();
            this.setState({isReplayMode:false, isOpenReply:false})
          };
        }
      });
    }
  };

  private changeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ message: e.target.value })
  };

  private sendTextMessage = async () => {



    if (this.state.message.trim()) {
      const data = new FormData();
      this.setState({ message: '' })
      data.append('conversationId', this.props.activeConversationId.toString())
      data.append('SupportMessageBodyType', IMessageType.Message.toString())
      if(this.state.isReplayMode && this.state.replyData){
        data.append('ReplayMessageId', this.state.replyData.messageId.toString());
      }
      data.append('MessageText', this.state.message)

      await MessageController.Send(data);
      this.page = 1;
      await this.getList();
      this.setState({isReplayMode:false, isOpenReply:false})
    }
  };

  private onEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13 && this.state.message) {
      this.sendTextMessage()
      this.setState({message:''})
    }
  };

  private handleData = (data: any) => {
    this.page = 1;
    this.getList();
  }

  private getList = async () => {
    await this.asyncSetState({ loading: true });

    const body = {
      page: this.page,
      count: 10,
      conversationId: this.props.activeConversationId,
      dateFrom: this.currentDate,
    };
    const res = await MessageController.GetCurrentUserSupport(body);

    if (body.conversationId !== this.props.activeConversationId) {
      return;
    }

    this.messagePageCount = res.data.pageCount;
    await this.asyncSetState({ loading: false });

    res.data.data.reverse();
    let height = 0;
    if (this.messagesBox.current) {
      const element = this.messagesBox.current;
      height = element.scrollHeight - element.scrollTop;
    }
    if (this.page > 1) {
      if (this.state.activeData) {
        res.data.data = [...res.data.data, ...this.state.activeData.data];
        await this.asyncSetState({ activeData: res.data });
        setTimeout(() => {
          if (this.messagesBox.current) {
            const element = this.messagesBox.current;
            element.scrollTop = element.scrollHeight - height;
          }
        });
      }
    } else {
      await this.asyncSetState({
          activeData: res.data,
          userPhoto:res.data.photo,
          userName:res.data.fullName,
          userAnnouncementCount:res.data.announcementCount,
          userId:res.data.userId,

      });
      this.scrollToBottom();
    }
    this.props.updateItem();
  };



  private TO_ISO_FORMAT(date: any) {
    const offset = (new Date(date)).getTimezoneOffset() * 60000;
    const localISOTimes = (new Date(new Date(date).getTime() - offset)).toISOString().slice(0, -1);
    return localISOTimes;
  }

  private getCurrentTimeZone = (time: string) => {
    if (time) {
      moment.locale('en')
      const timeMoment = moment(time).format('HH : mm : ss')

      const timeFrom = new Date(2020, 1, 1, Number(timeMoment.split(":")[0]), Number(timeMoment.split(":")[1]), Number(timeMoment.split(":")[2]))
      return moment(new Date(this.TO_ISO_FORMAT(timeFrom) + 'Z')).format('HH:mm').valueOf()
    } else {
      return null
    }
  }



  private openReplyMessage = (item: ICurrentSupportList) => {
    this.setState({replyData: item, isOpenReply: true, isReplayMode: true})
    if(this.myInp.current){
      this.myInp.current.focus()
    }
    setTimeout(()=>{
      this.scrollToBottom();
    },0)

  }

  private closeReplyMessage = () => {
    this.setState({isOpenReply: false})
  }

  private MessageContent = ({details}: { details: ICurrentSupportList }) => {
    switch (details.messageBodyType) {
      case IMessageType.Image:
        return <a
            target="_blank"
            href={details.messageText}
            className="I-image"
            style={{backgroundImage: `url("${details.messageText}")`}}
        />;
      case IMessageType.File:
        return <a
            target="_blank"
            href={details.fileUrl}
            className='I-support-file'
        ><span className="I-file-image"  style={{backgroundImage:`url(${pdfIcon})`}} /> <span className="I-file-text"> {details.messageText}</span></a>;
      case IMessageType.Announcement: return  <SendAnnouncement dataAnnouncement={details.announcement}/>
      default:
        return <>{details.messageText}</>;
    }

  }


  public render() {
    const { activeData } = this.state;

    return (
      <div className='B-support-right'>
        {activeData ? <div className="B-support-main">
          <div className="B-support-header">
            <div className="B-support-header-user">
              <div className="B-support-header-user-img"
                style={{ backgroundImage: `url("${this.state.userPhoto ? (this.state.userPhoto.photo || this.state.userPhoto.photoBlur) || NoProfilePicture : NoProfilePicture}")` }} />
              <div className="B-support-header-user-info">
                <div className="B-support-header-user-name">
                  <h3>{this.state.userName}</h3>
                  {this.state.userId
                    ?
                    <Link to={ROUTES.USER_DETAILS.replace(':id', this.state.userId.toString())}>user details</Link>
                    : null}
                </div>
                <div className="B-support-header-user-ann-count">
                  <span>{this.state.userAnnouncementCount}</span>
                  <p>announcements</p>
                </div>
              </div>
            </div>
          </div>
          <div className="B-support-chat-block">
            <div className="B-support-chat-box" ref={this.messagesBox}
              onScroll={this.onScrollMessage}>
              {this.state.loading ? <div className="lds-ellipsis">
                <div />
                <div />
                <div />
                <div />
              </div> : null}

              {activeData ? activeData.data.map((item, index) =>

                  item.replayMessage?
                      <React.Fragment key={index}>
                        <div key={index} className={`users-chat-box ${item.isSentFromMe? 'B-admin-message-list' :'B-user-message-list' }`}>
                          <div className="B-sent-time">
                            {/*<span>{moment(item.createdDate).format('HH : mm').valueOf()}</span>*/}
                            <span>{this.getCurrentTimeZone(item.createdDate)}</span>
                          </div>
                          {!item.isSentFromMe ?     <div className="B-user-sent-img"
                                                         style={{backgroundImage: `url("${item.photo ? (item.photo.photo || item.photo.photoBlur) || NoProfilePicture : NoProfilePicture}")`}}/>
                              : null}
                          {/*  FOR MESSAGE  TEXT */}
                          <div className={"P-user-support-message-types G-flex G-column B-sent-user-text"}>
                            <div className='P-replay-message-send'>
                              <h3> {item.replayMessage.fullName}</h3>
                              <div>  <this.MessageContent details={item.replayMessage}/></div>
                            </div>
                            <div className={`${item.messageBodyType===IMessageType.Image? 'image-reply-mode':''}`}>
                              <div> <this.MessageContent details={item}/></div>

                            </div>

                            {item.messageBodyType !== IMessageType.Announcement?<span className="G-reply-button" onClick={() => {
                              this.openReplyMessage(item)
                            }}>Reply</span> : null }


                          </div>
                        </div>
                      </React.Fragment>
                      :
                      <React.Fragment key={index}>
                        <div key={index} className={`users-chat-box ${item.isSentFromMe? 'B-admin-message-list' :'B-user-message-list' }`}>

                          <div className="B-sent-time">
                            {/*<span>{moment(item.createdDate).format('HH : mm').valueOf()}</span>*/}
                            <span>{this.getCurrentTimeZone(item.createdDate)}</span>
                          </div>
                          {!item.isSentFromMe ?     <div className="B-user-sent-img"
                                                         style={{backgroundImage: `url("${item.photo ? (item.photo.photo || item.photo.photoBlur) || NoProfilePicture : NoProfilePicture}")`}}/>
                              : null}
                          {/*  FOR MESSAGE  TEXT */}
                          <div className={"P-user-support-message-types"}>
                            {item.messageBodyType === IMessageType.Message ?
                                <SendText textList={item.messageText}/> : null}
                            {item.messageBodyType === IMessageType.Image ?
                                <SentImg sliderImg={item.messageText}/> : null}
                            {item.messageBodyType === IMessageType.Announcement ?
                                <SendAnnouncement dataAnnouncement={item.announcement}/> : null}
                            {item.messageBodyType === IMessageType.File ?
                                <SentFile fileUrl={item.fileUrl} fileName={item.messageText}/>
                                : null}

                            {item.messageBodyType !== IMessageType.Announcement?<span className="G-reply-button" onClick={() => {
                              this.openReplyMessage(item)
                            }}>Reply</span> : null }
                          </div>
                        </div>
                      </React.Fragment>
              ) : null}
            </div>
            <div className={`P-reply-support-block ${this.state.isOpenReply ? 'I-open-reply' : ''}`}>
              <div className={`P-reply-support-box G-flex G-flex-align-center `}>
                <span className="P-close-reply" onClick={this.closeReplyMessage}/>
                <span className="P-reply-icon" style={{backgroundImage: `url(${replyIcon})`}}/>
                {this.state.replyData ?
                    <div className={`P-reply-information ${this.state.replyData.messageBodyType===IMessageType.Image || this.state.replyData.messageBodyType===IMessageType.File ? 'reply-image G-flex G-flex-align-center G-flex-row-revers' : ''} `}>
                      {!Settings.token? <h3>{this.state.replyData.fullName}</h3> :
                          <h3>{this.state.replyData.fullName}</h3>}
                      <div className={`${this.state.replyData.messageBodyType===IMessageType.File? 'I-message-file-style':''}`}><this.MessageContent details={this.state.replyData}/></div>
                    </div> : null}

              </div>
            </div>
            <div className="B-support-chat-write">
              <div className="B-support-add-file">
                <div className="B-support-add-input">
                  <label>
                    <input
                      onChange={(e) => this.uploadFiles(e.target.files, IMessageType.Image)}
                      name='file'
                      type="file"
                      accept="image/*"
                    />
                    <span className="B-support-input-img"
                      style={{ backgroundImage: 'url(' + AddPhotoImg + ')' }} />
                  </label>
                </div>
                <div className="B-support-add-input">
                  <label>
                    <input
                      onChange={(e) => this.uploadFiles(e.target.files, IMessageType.File)}
                      name='file'
                      type="file"
                      accept=".pdf, .doc, .docx, .xls, .xlsx"
                    />

                    <span className="B-support-input-img"
                      style={{ backgroundImage: 'url(' + AddFileImg + ')' }} />
                  </label>
                </div>
              </div>
              <div className="B-support-write-text">
                <div className="B-support-input-write">
                  <label>
                    <input type="text" placeholder="Write message"
                      onChange={this.changeMessage}
                      onKeyDown={this.onEnter}
                           autoComplete='off'

                           value={this.state.message}
                           ref={this.myInp}
                    />
                  </label>
                  <div className="B-support-sent-btn" onClick={this.sendTextMessage}>
                    <button className="B-support-sent-img"
                      style={{ backgroundImage: 'url(' + SentMessageImg + ')' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> : null}

        {
          (this.props.activeConversationId && !this.props.disableSocket) ?
            <Socket hub="supportChatHub" data={{ conversationId: this.props.activeConversationId, deviceId: Settings.guestId }} onMessage={this.handleData} />
            : null
        }
      </div>
    )
  }
}

export default Conversation;
