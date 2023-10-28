import * as React from 'react';
import alertify from 'alertifyjs';
import Modal from './modal';
import LoaderContent from './loader-content';
import AnnouncementController, {
  AnnouncementRejectStatus,
  IAnnouncementRejectionType
} from 'src/platform/api/announcement';
import ROUTES from "../platform/constants/routes";

// import { Link } from 'react-router-dom';


interface IProps {
  onClose(): void;

  approved: boolean;
  inreview: boolean;
  dataId: number;
};

interface IState {
  submited: boolean;
  submitLoading: boolean;
  reasonArr: [];
  description: string;
  descriptionType: number | null;
  disabledText: boolean;
  EnglishActive: boolean,
  ArabActive: boolean,
  DescriptionTextEng: string,
  DescriptionAr: string,
  rejectionType: IAnnouncementRejectionType[] | null,
  rejectionId: number | null,

};


class RejectionModal extends React.Component<IProps, IState> {

  public state: IState = {
    submited: false,
    submitLoading: false,
    reasonArr: [],
    description: '',
    disabledText: true,
    descriptionType: null,
    EnglishActive: true,
    ArabActive: false,
    DescriptionTextEng: '',
    DescriptionAr: '',
    rejectionType: null,
    rejectionId: null,
  }

  private change = (e: any) => {
    this.setState({
      submitLoading: false
    })
    if (this.state.EnglishActive) {
      if (e.target.name === 'DescriptionText') {
        this.setState({
          description: e.target.value,
          DescriptionTextEng: e.target.value,
        })
      }

    } else {
      if (e.target.name === 'DescriptionText') {
        this.setState({
          description: e.target.value,
          DescriptionAr: e.target.value,
        })
      }
    }

  }

  public componentDidMount() {
    this.GetAnnouncementRejectsType()
  }

  private GetAnnouncementRejectsType = async () => {
    const result = await AnnouncementController.GetAnnouncementRejectsType();
    if (result.success) {
      this.setState({
        rejectionType: result.data
      })
    }
  }


  private EnglishActiveChange = () => {
    if (!this.state.EnglishActive) {
      this.setState({
        ArabActive: !this.state.ArabActive,
        EnglishActive: !this.state.EnglishActive,
      });
    }
    this.setState({
      description: this.state.DescriptionTextEng || "",
    });

  }
  private ArabActiveChange = () => {
    if (!this.state.ArabActive) {
      this.setState({
        ArabActive: !this.state.ArabActive,
        EnglishActive: !this.state.EnglishActive,
      });
    }
    this.setState({
      description: this.state.DescriptionAr || "",
    });
  }


  private changeTypeReject = (e: any, rejectionId: number | null) => {
    this.setState({
      descriptionType: e.target.value,
      submitLoading: false,
      rejectionId
    })
    if (Number(e.target.value) === AnnouncementRejectStatus.OtherReason) {
      this.setState({
        disabledText: false
      })
    } else {
      this.setState({
        disabledText: true,
        description: '',
      })
    }

  }


  private submit = () => {
    this.setState({submitLoading: true}, async () => {
      if (this.state.descriptionType === null) {
        alertify.error('Please choose the reason for rejection')
        setTimeout(async () => {
          this.setState({
            submitLoading: false,
          });
        }, 500)
      } else {
        const descType = +this.state.descriptionType
        if (descType === AnnouncementRejectStatus.OtherReason) {
          if (this.state.DescriptionTextEng.trim() && this.state.DescriptionAr.trim()) {
            const result = await AnnouncementController.RejectAnnouncement({
              id: null,
              DescriptionEnglish: this.state.DescriptionTextEng,
              DescriptionArabian: this.state.DescriptionAr,
              notificationType: descType
            }, this.props.dataId);
            if (result.success) {
              this.props.onClose()
              if (!this.props.approved && this.props.inreview) {
                window.routerHistory.push(ROUTES.ANNOUNCEMENTS_IN_REVIEW);
              } else {
                if (this.props.approved) {
                  window.routerHistory.push(ROUTES.ANNOUNCEMENTS);
                } else {
                  window.routerHistory.push(ROUTES.ANNOUNCEMENTS_PENDING);
                }
              }
            }
            return true;
          } else {
            alertify.error('Please fill description in two languages')
            this.setState({
              submitLoading: false
            })
          }
          return true;
        } else {
          const result = await AnnouncementController.RejectAnnouncement({
            id: this.state.rejectionId,
            notificationType: descType
          }, this.props.dataId);
          this.setState({
            submitLoading: true,
          });
          if (result.success) {
            this.props.onClose()
            if (!this.props.approved && this.props.inreview) {
              window.routerHistory.push(ROUTES.ANNOUNCEMENTS_IN_REVIEW);
            } else {
              if (this.props.approved) {
                window.routerHistory.push(ROUTES.ANNOUNCEMENTS);
              } else {
                window.routerHistory.push(ROUTES.ANNOUNCEMENTS_PENDING);
              }
            }
          }
          return true;
        }
      }
      return true;

    });
  }


  public render() {

    const {onClose} = this.props;
    const {submitLoading, EnglishActive, ArabActive} = this.state;

    return (

      <Modal className="B-rejection-modal" onClose={onClose}>
        <div className="B-rejection-container">
          <div className="B-rejection-title">
            <h3>Rejection reason</h3>
            <p>Please choose the reason for rejection that users can understand clearly what information
              should be edited and why Baitkm can not approve it.</p>
          </div>
          <div className="B-rejected-checkblock">

            {this.state.rejectionType ? this.state.rejectionType.map((item, index) => {
              return <div className="B-reject-checkbox" key={index}>
                <label>
                  <input type="radio"
                         name='reject'
                         onChange={(e) => {
                           this.changeTypeReject(e, item.id)
                         }}
                         value={AnnouncementRejectStatus.Reject}
                  />
                  <span/>
                  <p>{item.description}</p>
                </label>
              </div>
            }) : <div className="lds-ellipsis">
              <div/>
              <div/>
              <div/>
              <div/>
            </div>}

            <div className="B-reject-checkbox">
              <label>
                <input type="radio"
                       name='reject'
                       onChange={(e) => {
                         this.changeTypeReject(e, null)
                       }}
                       value={AnnouncementRejectStatus.OtherReason}/>
                <span/>
                <p>Other (allow text box to input reasons)</p>
              </label>
            </div>
          </div>
          {!this.state.disabledText ?
            <>
              <div className='B-description-change-lang'>
                <ul>
                  <li className={
                    `${EnglishActive ? "active-description-language" : ""}`}
                      onClick={this.EnglishActiveChange}>Eng
                  </li>
                  <li className={
                    `${!ArabActive ? "" : 'active-description-language'}`}
                      onClick={this.ArabActiveChange}>Ar
                  </li>
                </ul>
              </div>
              <div className="B-reject-text">
                <label>
                            <textarea
                              disabled={this.state.disabledText}
                              onChange={this.change}
                              name='DescriptionText'
                              value={this.state.description}
                              placeholder='Write comment...'/>
                </label>
              </div>
            </> : null}

        </div>
        <div className="B-classic-card-control-buttons btn">
          <p
            className="B-classic-card-cancel-button"
            onClick={onClose}
          >Cancel</p>
          <LoaderContent
            loading={submitLoading}
            disabled={submitLoading}
            className="B-classic-card-modify-button"
            onClick={this.submit}
          >Confirm</LoaderContent>
        </div>
      </Modal>
    );
  }
}

export default RejectionModal;
