import * as React from 'react';

import Modal from './modal';
import Modals from '../platform/dispatchers/modals';
import { ConfirmModalConfirmCallback } from '../platform/constants/types';

interface IProps {
  callback: ConfirmModalConfirmCallback,
  withoutPortal?: boolean;
};

const closeModal = () => {
  Modals.toggleConfirmModal();
  return true;
}

const ConfirmModal = (props: IProps) => (
  <Modal className=" B-confirm-modal" onClose={() => closeModal() && props.callback(false)} withoutPortal={props.withoutPortal}>
    <h3 className="B-classic-card-title">Are you sure?</h3>
    {/* <div className="B-classic-card-control-buttons">
      <button
        type="button"
        className="B-classic-card-control-buttons"
        onClick={() => closeModal() && props.callback(false)}
      >Cancel</button>
      <button
        className="B-classic-card-modify-button"
        onClick={() => closeModal() && props.callback(true)}
      >Confirm</button>
    </div> */}

    <div className="B-classic-card-control-buttons btn">
      <p
        className="B-classic-card-cancel-button"
        onClick={() => closeModal() && props.callback(false)}
      >Cancel</p>
      <button

        className="B-classic-card-modify-button"
        onClick={() => closeModal() && props.callback(true)}
      >Confirm</button>
    </div>
  </Modal>
);

export default ConfirmModal;