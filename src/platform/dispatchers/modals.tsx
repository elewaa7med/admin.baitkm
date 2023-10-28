import { ConfirmModalCallback, ConfirmModalConfirmCallback } from '../constants/types';

class Modals {

  private static confirmModalFollowers: ConfirmModalCallback[] = [];

  public static toggleConfirmModal = (callback?: ConfirmModalConfirmCallback) => {
    Modals.confirmModalFollowers.map(item => item(callback));
  }

  public static onConfirmModalChange = (callback: ConfirmModalCallback) => {
    Modals.confirmModalFollowers.push(callback);
    callback();
  }
}

export default Modals;