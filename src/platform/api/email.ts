import Connection from '../services/connection';
import { IResponse} from '../constants/interfaces';

const controller = 'Email';

export interface IAddEmail {
    email: string
};

export interface IEmailEdit {
    id: number,
    email: string
};

export interface IGetEmailList {
    id: number,
    email: string
};


class EmailController {

    public static GetEmailList = async (): Promise<IResponse<IGetEmailList[]>> => {
        const result: IResponse<IGetEmailList[]> = await Connection.GET({
            action: 'List',
            controller,
        });




        return result;
    };

    public static AddEmail = async (body:IAddEmail): Promise<IResponse<any>> => {
        const result: IResponse<any> = await Connection.POST({
            body,
            action: 'Add',
            controller,
        });

        return result;
    };

    public static DeleteEmail = async (id:number): Promise<IResponse<any>> => {
        const result: IResponse<any> = await Connection.DELETE({
            body: {},
            action: `Delete?id=${id}`,
            controller,
        });

        return result;

    };

    public static EditEmail = async (body:IEmailEdit): Promise<IResponse<any>> => {
        const result: IResponse<any> = await Connection.PUT({
            body,
            action: `Edit`,
            controller,
        });

        return result;

    };

};

export default EmailController;
