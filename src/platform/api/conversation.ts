import { IPhotoProduct } from './../constants/interfaces';
import Connection from '../services/connection';
import { IPagingRes, IResponse, } from '../constants/interfaces';
const controller = 'SupportConversation';
// Response Model

export interface IGetSupportList {
    id: number,
    participantId: number,
    fullName: string,
    photo: IPhotoProduct,
    unSeenCount: number,
    messageText: string,
    supportMessageBodyType: IMessageType
}

// Current Support



export enum IMessageType {
    Message,
    Image,
    File,
    Announcement
}

class ConversationController {

    public static GetList = async (data: { page: number, count: number, search?: string,  }): Promise<IResponse<IPagingRes<IGetSupportList>>> => {
        const result = await Connection.POST<object>({
            body: data,
            action: `GetList`,
            controller,
        });

        return result;
    }



};

export default ConversationController;
