import { IFormForPushNotification } from './../../components/notification-modal';
import Connection from '../services/connection';
import { IResponse, IPagingRes } from '../constants/interfaces';


const controller = 'PushNotification';



export interface IGetNotificationList {
  id: number,
  title: string,
  description: string,
  sendingDate: string,
  pushNotificationUserType: PushNotificationUserType,
  pushNotificationStatusType: PushNotificationStatusType,
  pushNotificationActionType: PushNotificationActionType,
}


export enum PushNotificationUserType {
  All,
  Guest,
  Registered
}

export enum PushNotificationUserTypeView {

  'All users' = PushNotificationUserType.All,
  'Guested users' = PushNotificationUserType.Guest,
  'Registered users' = PushNotificationUserType.Registered,
}

export enum PushNotificationStatusType {
  Scheduled,
  Sent
}

export enum PushNotificationStatusTypeView {
  "Scheduled" = PushNotificationStatusType.Scheduled,
  "Sent" = PushNotificationStatusType.Sent,

}


export enum PushNotificationActionType {
  Map,
  HomePage
}
export enum PushNotificationActionTypeView {
  'Open App' = PushNotificationActionType.Map,
  'Open home page' = PushNotificationActionType.HomePage,
}

export enum ColorNotification {
  '#000000' = PushNotificationStatusType.Sent,
  '#DF9C00' = PushNotificationStatusType.Scheduled
}

class NotificationController {
  public static GetNotificationList = async (data: { page: number, count: number }): Promise<IResponse<IPagingRes<IGetNotificationList>>> => {
    const result = await Connection.POST<object>({
      body: data,
      action: `GetList`,
      controller,
    });

    return result;
  }

  public static CreateNotification = async (data: IFormForPushNotification): Promise<IResponse<boolean>> => {
    const result = await Connection.POST<object>({
      body: data,
      action: `Create`,
      controller,
    });

    return result;
  }
};



export default NotificationController;
