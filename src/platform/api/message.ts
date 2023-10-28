import { IMessageType } from './conversation';
// import { IPhotoProduct } from './../constants/interfaces';
import Connection from '../services/connection';
import { IPagingRes, IResponse, IPhotoProduct, } from '../constants/interfaces';
import {IUserApproved} from "./announcement";
const controller = 'SupportMessage';
// Response Model



// Current Support
export interface ICurrentSupport extends IPagingRes<ICurrentSupportList> {
    userId: number;
    fullName: string;
    announcementCount: number;
    photo: IPhotoProduct;
}

export interface ICurrentSupportList {
    id: number;
    conversationId: number;
    createdDate: string;
    photo: IPhotoProduct;
    senderId: number;
    messageText: string;
    messageBodyType: IMessageType;
    announcement?: IUserApproved;
    isSentFromMe: boolean;
    fileUrl?: any;
    fileSize: number;
    replayMessage:ICurrentSupportList
    fullName:string;
    messageId:number
}


class MessageController {

    public static GetCurrentUserSupport = async (data: { page: number, count: number, conversationId: number, dateFrom?: any }): Promise<IResponse<ICurrentSupport>> => {
        const result = await Connection.POST<object>({
            body: data,
            action: `GetAdminList`,
            controller,
        });

        return result;
    }

    public static Send = async (data: FormData): Promise<IResponse<boolean>> => {
        const result = await Connection.POST<object>({
            body: data,
            action: `Send`,
            noneJSONBody: true,
            controller,
        });

        return result;
    }


};

export default MessageController;


