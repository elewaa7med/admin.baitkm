import * as React from 'react';

import ROUTES from "../../platform/constants/routes";
import {byBreadcrumbs, byPrivateRoute} from "../../platform/decorators/routes";
import SettingController, {IGetCoverImg, IGetSettings} from 'src/platform/api/setting';
import PageLoader from 'src/components/page-loader';
// import { Editor, EditorTools } from '@progress/kendo-react-editor';
// import SettingController from 'src/platform/api/setting';
import alertify from 'alertifyjs';
import EmailController, {IGetEmailList} from "../../platform/api/email";
import EditIcon from '../../assets/images/pencil.png'
import AddNewEmail from "../../components/add-email-modal";


interface IState {
  data: IGetSettings[] | null,
  dataCoverImg: IGetCoverImg[] | null,
  ValuePrivacyPolicy: string,

  ValueTermsAndConditions: string,
  PrivacyPolicy: string,
  TermsAndConditions: string,
  selectedFile: any;
  logo: any,
  logoSrc: any,
  approveAnnouncementDefaultDay: string,
  approveAnnouncementDefaultDayKay: string,
  errorDay: boolean,

  isActivePrivacyPolicy: number,
  termsAndConditionsEnglish: string,
  privacyPolicyEnglish: string,
  termsAndConditionsArabian: string,
  privacyPolicyArabian: string
  isActiveTermsAndConditions: number,
  idArabianPP: number,
  idEnglishPP: number,
  idArabianTQ: number,
  idEnglishTQ: number,
  idDayCount: number,
  emailList:IGetEmailList[]|null;
  isOpenModalEmail:boolean;
  emailEdit:IGetEmailList;
  isEdit:boolean;

};
// const { Bold, Italic, Underline,
//     AlignLeft, AlignRight, AlignCenter,
//     Indent, Outdent,
//     OrderedList, UnorderedList,
//     Undo, Redo, Link, Unlink } = EditorTools;


@byBreadcrumbs(([{label: 'Settings'}]))
@byPrivateRoute(ROUTES.SETTINGS)
class Setting extends React.Component<{}, {}> {

  private uploadImageRef = React.createRef<HTMLInputElement>();
  public state: IState = {
    data: null,
    dataCoverImg: null,
    ValuePrivacyPolicy: '',
    ValueTermsAndConditions: '',
    approveAnnouncementDefaultDay: '',
    approveAnnouncementDefaultDayKay: 'approveAnnouncementDefaultDay',
    PrivacyPolicy: 'privacypolicy',
    TermsAndConditions: 'termsandconditions',
    selectedFile: null,
    logo: '',
    logoSrc: '',
    errorDay: false,
    //---------------------------
    isActivePrivacyPolicy: 1,
    isActiveTermsAndConditions: 1,
    termsAndConditionsEnglish: '',
    privacyPolicyEnglish: '',
    termsAndConditionsArabian: '',
    privacyPolicyArabian: '',
    idArabianPP: 0,
    idEnglishPP: 0,
    idArabianTQ: 0,
    idEnglishTQ: 0,
    idDayCount: 0,
    emailList:null,
    isOpenModalEmail:false,
    emailEdit:{
      email:'',
      id:0
    },
    isEdit:false,
  }


  private ApprovedData = async (body: IGetSettings[]) => {

    const result = await SettingController.ApproveSettings(body);
    this.setState({
      data: result.data,
    });
    if (result.success) {
      alertify.success('Settings are changed')
    }
  }


  private ClickToApprovedDataPrivacyPolicy = () => {
    const body: any = [];
    const ArabianPrivacyPolicy = {
      id: this.state.idArabianPP,
      key: 'privacypolicyArabian',
      value: this.state.privacyPolicyArabian,
    }
    const EnglishPrivacyPolicy = {
      id: this.state.idEnglishPP,
      key: 'privacypolicyEnglish',
      value: this.state.privacyPolicyEnglish,
    }
    body.push(ArabianPrivacyPolicy)
    body.push(EnglishPrivacyPolicy)
    this.ApprovedData(body)
  };
  private ClickToApprovedDataTermsAndConditions = () => {
    const body: any = [];
    const ArabianTermsAndConditions = {
      id: this.state.idArabianTQ,
      key: 'termsandconditionsArabian',
      value: this.state.termsAndConditionsArabian,
    }
    const EnglishTermsAndConditions = {
      id: this.state.idEnglishTQ,
      key: 'termsandconditionsEnglish',
      value: this.state.termsAndConditionsEnglish,
    }
    body.push(ArabianTermsAndConditions)
    body.push(EnglishTermsAndConditions)
    this.ApprovedData(body)
  };
  private isValidPhone = (value?: string | null): boolean => {
    if (!value && value !== '') return false;
    const regex = new RegExp('^[0-9]*$');
    return regex.test(value);
  };

  private ClickToApprovedDay = () => {
    if (this.isValidPhone(this.state.approveAnnouncementDefaultDay)) {
      const body = {
        id: this.state.idDayCount,
        key: 'approveAnnouncementDefaultDay',
        value: this.state.approveAnnouncementDefaultDay,
      }
      this.ApprovedData([body])
      this.setState({errorDay: false})

    } else {
      this.setState({errorDay: true})
      alertify.error('incorrect day value')

    }

  };
  private change = (e: any) => {

    if (e.target.name === 'ValuePrivacyPolicy') {
      if (this.state.isActivePrivacyPolicy === 1) {
        this.setState({privacyPolicyEnglish: e.target.value, ValuePrivacyPolicy: e.target.value})
      } else {
        this.setState({privacyPolicyArabian: e.target.value, ValuePrivacyPolicy: e.target.value})
      }
    }
    if (e.target.name === 'ValueTermsAndConditions') {
      if (this.state.isActiveTermsAndConditions === 1) {
        this.setState({termsAndConditionsEnglish: e.target.value, ValueTermsAndConditions: e.target.value})
      } else {
        this.setState({termsAndConditionsArabian: e.target.value, ValueTermsAndConditions: e.target.value})
      }
    }

    if(e.target.name ==='approveAnnouncementDefaultDay'){
      this.setState({
        approveAnnouncementDefaultDay:e.target.value
      })
    }
  };

  private fetchData = async () => {
    const result = await SettingController.GetSettings();
    if (result.data) {
      result.data.map((item) => {
        if (item.key === 'termsandconditionsEnglish') {
          this.setState({
            termsAndConditionsEnglish: item.value,
            idEnglishTQ: item.id,
          }, () => {
            this.setState({ValueTermsAndConditions: this.state.termsAndConditionsEnglish})
          })
        }
        if (item.key === 'privacypolicyEnglish') {
          this.setState({
            privacyPolicyEnglish: item.value,
            idEnglishPP: item.id,
          }, () => {
            this.setState({ValuePrivacyPolicy: this.state.privacyPolicyEnglish})
          })
        }
        if (item.key === 'termsandconditionsArabian') {
          this.setState({
            termsAndConditionsArabian: item.value,
            idArabianTQ: item.id
          })
        }
        if (item.key === 'privacypolicyArabian') {
          this.setState({
            privacyPolicyArabian: item.value,
            idArabianPP: item.id
          })
        }
        if (item.key === 'approveAnnouncementDefaultDay') {
          this.setState({
            approveAnnouncementDefaultDay: item.value,
            idDayCount:item.id,
          })
        }
        this.setState({
          data: result.data,
        })
      })
    }
  };

  private fetchDatacoverImg = async () => {
    const result = await SettingController.GetCoverImgList();
    this.setState({
      dataCoverImg: result.data,
    });
  };

  public componentDidMount() {
    this.fetchData();
    this.fetchDatacoverImg();
    this.GetEmailLists().then()
  }

  public deleteImgCover = async (e: any) => {
    const thisId = e.target.getAttribute('data-key')
    await SettingController.RemoveCoverImg(thisId);
    this.fetchDatacoverImg();
  };
  public MakeImgCover = async (e: any) => {
    const thisId = e.target.getAttribute('data-key')
    await SettingController.MakeCoverImg(thisId);
    this.fetchDatacoverImg();
  };

  private uploadImage = async () => {
    const data = new FormData();
    const blob = this.state.logo.blob;
    data.append('file', blob);
    await SettingController.UploadCoverImg(data);
    this.fetchDatacoverImg();
    if(this.uploadImageRef.current){
      this.uploadImageRef.current.value=''
    }
  };

  public uploadFiles = (files: Blob[] | any): void => {
    Object.keys(files).map(file => {
      if (file) {
        const READER = new FileReader();
        READER.readAsDataURL(files[file]);
        READER.onload = () => {
          const obj = {
            blob: files[file],
            id: null,
            path: READER.result,
          };
          this.setState({logo: obj})
          this.uploadImage()
        };
      }
    });
  };


  public changePrivacyPolicy = (activeLanguage: number) => {
    this.setState({isActivePrivacyPolicy: activeLanguage}, () => {
      this.setState({
        ValuePrivacyPolicy: activeLanguage === 1 ? this.state.privacyPolicyEnglish : this.state.privacyPolicyArabian
      })
    })
  }

  public changeTermsAndConditions = (activeLanguage: number) => {
    this.setState({isActiveTermsAndConditions: activeLanguage}, () => {
      this.setState({
        ValueTermsAndConditions: activeLanguage === 1 ? this.state.termsAndConditionsEnglish : this.state.termsAndConditionsArabian
      })
    })
  }


  private GetEmailLists = async ()=>{
    const result = await EmailController.GetEmailList()
    if(result.success){
      this.setState({emailList:result.data})
    }

  }

  private  openEmailModal = (email?:IGetEmailList)=>{
    this.setState({isOpenModalEmail:true, emailEdit:email})
    if(email){
      this.setState({isEdit:true})
    }else{
      this.setState({isEdit:false})

    }

  }
  private  closeEmailModal = ()=>{
    this.setState({isOpenModalEmail:false})
  }

  private deleteEmail = async (emailId:number)=>{

    const result = await EmailController.DeleteEmail(emailId)
    if(result.success){
      this.GetEmailLists()
      alertify.success('Email was deleted')
    }
  }




  public render() {
    const {data, dataCoverImg, ValuePrivacyPolicy, ValueTermsAndConditions, isActivePrivacyPolicy, isActiveTermsAndConditions, emailList} = this.state;
    return data && dataCoverImg ? (
      <div className='settings-container'>
        <div className='B-announcement-header'>
          <div className='B-announcement-main'>
            <div className="B-announcement-title">
              <h3>Settings</h3>
            </div>
          </div>
        </div>
        <div className='settings-components'>
          <div className='setting-input-box B-announcement-filter-block'>
            <div className='setting-input-title'>
              <h3>Active announcement period </h3>
            </div>
            <div className='padding-inputs-filter'>
              <div className={`B-announcement-input-block  ${this.state.errorDay ? 'B-error' : ''}`}>
                <label>
                  <input type="text"
                         value={this.state.approveAnnouncementDefaultDay}
                         name='approveAnnouncementDefaultDay'
                         onChange={this.change}
                         autoComplete='off'
                         placeholder='Day'/>
                </label>
              </div>
            </div>
            <div className='setting-button-send btn'>
              <button onClick={this.ClickToApprovedDay}>Approve</button>
            </div>
          </div>
        </div>
        <div className="settings-components">
          <div className="setting-input-box">
            <div className='setting-input-title ' >
              <h3>Notifications for Announcement Creation</h3>
              <div className="P-add-email-btn btn" onClick={()=>{this.openEmailModal()}}>
                <button>Add email</button>
              </div>
            </div>

            <div className="P-emails-list-block">
              {emailList && emailList.length? emailList.map((item, index)=>{
                    return <div className="email-list-box" key={index}>
                      <div className="P-email-list-text">
                        <p>{item.email}</p>
                        <span onClick={()=>this.openEmailModal(item)} className="P-edit-email-icon" style={{backgroundImage: `url(${EditIcon})`}}/>
                        <span onClick={async ()=>{this.deleteEmail(item.id)}} className="P-delete-email-icon"/>
                      </div>
                    </div>
              }): <p>Email list is empty</p>}
            </div>
          </div>
        </div>
        <div className='settings-components'>
          <div className='setting-input-box'>
            <div className='setting-input-title'>
              <h3>Privacy Policy </h3>
            </div>
            <div className='setting-input-textarea'>
              {/* <Editor
                                tools={[
                                    [Bold, Italic, Underline],
                                    [Undo, Redo],
                                    [Link, Unlink],
                                    [AlignLeft, AlignCenter, AlignRight],
                                    [OrderedList, UnorderedList, Indent, Outdent]
                                ]} */}
              {/* contentStyle={{ height: 320 }}
                            defaultContent={data.privacy.value}
                            /> */}
              <div className='B-description-change-lang'>
                <ul>
                  <li className={
                    `${isActivePrivacyPolicy === 1 ? "active-description-language" : ""}`}
                      onClick={() => {
                        this.changePrivacyPolicy(1)
                      }}>Eng
                  </li>
                  <li className={
                    `${isActivePrivacyPolicy === 2 ? "active-description-language" : ''}`}
                      onClick={() => {
                        this.changePrivacyPolicy(2)
                      }}>Ar
                  </li>
                </ul>
              </div>
              <label>
                                <textarea
                                  onChange={this.change}
                                  name='ValuePrivacyPolicy'
                                  value={ValuePrivacyPolicy}
                                  placeholder='Write body'/>
              </label>
            </div>
            <div className='setting-button-send btn'>
              <button onClick={this.ClickToApprovedDataPrivacyPolicy}>Approve</button>
            </div>
          </div>
          <div className='setting-input-box'>
            <div className='setting-input-title'>
              <h3>Terms and Conditions </h3>
            </div>
            <div className='setting-input-textarea'>
              <div className='B-description-change-lang'>
                <ul>
                  <li className={
                    `${isActiveTermsAndConditions === 1 ? "active-description-language" : ""}`}
                      onClick={() => {
                        this.changeTermsAndConditions(1)
                      }}>Eng
                  </li>
                  <li className={
                    `${isActiveTermsAndConditions === 2 ? "active-description-language" : ''}`}
                      onClick={() => {
                        this.changeTermsAndConditions(2)
                      }}>Ar
                  </li>
                </ul>
              </div>
              <label>
                                <textarea
                                  onChange={this.change}
                                  name='ValueTermsAndConditions'
                                  value={ValueTermsAndConditions}
                                  placeholder='Write body'/>
              </label>
            </div>
            <div className='setting-button-send btn'>
              <button onClick={this.ClickToApprovedDataTermsAndConditions}>Approve</button>
            </div>
          </div>
          <div className="setting-input-box">
            <div className='setting-input-title'>
              <h3>Home page cover image </h3>
            </div>
            <div className="B-add-image-cover-block">
              {dataCoverImg.map((item, index) => (
                item.isBase ?
                  <div key={index} className="B-image-cover">
                    <div className="B-covered-img"
                         style={{backgroundImage: `url("${item.photo.photo || item.photo.photoBlur}")`}}/>
                  </div>
                  : ''
              ))}
            </div>
            <div className="B-added-img-components">
              <div className="B-added-img-tittle">
                <h3>Previous cover images</h3>
              </div>
              <div className="B-add-img-block">
                <div className="B-padding-added">
                  <label>
                    <div className="B-add-img-box B-add-img-inuput">
                      <form>
                        <input
                          onChange={(e) => this.uploadFiles(e.target.files)}
                          name='file'
                          type="file"
                          accept="image/*"
                          id='file'
                          ref={this.uploadImageRef}
                        />

                        <span>+</span>
                      </form>
                    </div>
                  </label>
                </div>
                {dataCoverImg.map((item, index) => (
                  <div key={index} className="B-padding-added">
                    <div className="B-add-img-box">
                      <div className="B-added-img"
                           style={{backgroundImage: `url("${item.photo.photo || item.photo.photoBlur}")`}}/>
                      <div className="add-or-remove-img">
                        <p className="add-img-cover" data-key={item.id} onClick={this.MakeImgCover}>Make cover</p>
                        <p className="remove-img-cover" data-key={item.id} onClick={this.deleteImgCover}> Remove
                          cover</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {this.state.isOpenModalEmail && <AddNewEmail isEdit={this.state.isEdit} email={ this.state.emailEdit} fetchData={this.GetEmailLists} onClose={this.closeEmailModal}  />}
        </div>
      </div>
    ) : <PageLoader/>;
  }
}

export default Setting;
