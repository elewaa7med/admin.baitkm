import * as React from 'react';
// import alertify from 'alertifyjs';
import Modal from './modal';
import LoaderContent from './loader-content';
import Settings from "../platform/services/settings";
// import ROUTES from "../platform/constants/routes";
// import { Link } from 'react-router-dom';


interface IProps {
  onClose(): void;
}

interface IState {
  submited: boolean;
  submitLoading: boolean;

}

class LogOutModal extends React.Component<IProps, IState> {
  public state: IState = {
    submited: false,
    submitLoading: false,


  };



  private submit = async () => {
      Settings.logout()

  };


  public render() {

    const {onClose} = this.props;
    const {submitLoading} = this.state;

    return (

      <Modal className="B-log-out-modal" onClose={onClose}>
        <div className="B-log-out-title">
          <h3>Are you sure you want to log out?</h3>
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
          >Confirm</LoaderContent>
        </div>
      </Modal>
    );
  }
}

export default LogOutModal;
