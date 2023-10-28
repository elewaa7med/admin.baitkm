import Connection from '../services/connection';
import { IResponse } from '../constants/interfaces';

const controller = 'PhoneCode';


export  interface IListPhone {
    country: string,
    code: string,
    id?:number,

}
export class PhoneCodeController {



    public static GetPhoneCodeList = (): Promise<IResponse<IListPhone[]>> => {
        const result = Connection.GET({
            action: 'GetList',
            controller,
        });

        return result;
    };

}
