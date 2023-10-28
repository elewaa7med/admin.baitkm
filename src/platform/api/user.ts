import {IPaging, IPagingRes, IResponse, IUserDetails} from '../constants/interfaces';
import Connection from '../services/connection';

const controller = 'User';
// Response Model

export interface IUsersListRequestModel {
    pageNumber: number;
    itemQuantity: number;
};

export enum UserStatusTypeEnum {
    Active,
    Inactive,
    Deleted
}

export enum UserStatusTypeViewEnum {
    'Active' = UserStatusTypeEnum.Active,
    'Inactive' = UserStatusTypeEnum.Inactive,
    'Deleted' = UserStatusTypeEnum.Deleted,
}

export enum ColorUserStatus {

    '#000000' = UserStatusTypeEnum.Active,
    'rgb(223, 156, 0)' = UserStatusTypeEnum.Inactive,
    '#CE002A' = UserStatusTypeEnum.Deleted,
}

export interface IGetAdminUserListResModel {
    id: number,
    fullName: string,
    phone: number,
    email: string,
    dateOfBirth: Date,
    city: string | null,
    cityId: number,
    userStatusType: UserStatusTypeEnum,
    announcementCount: number,
    profilePhoto: IGetAdminUserProfilePhoto,
    isBlocked:boolean,
    phoneCode:string,
    location:string,
    ipLocation:string,
}


export interface IFilterUserList extends IPaging {
    announcementCount: number| string,
    fullName: string,
    phone: string,
    email: string,
    city: string,
    userStatusType: UserStatusTypeEnum | null,
    dateFrom: string,
}



export interface IGetAdminUserProfilePhoto {
    photo: string,
    photoBlur: string
}

class UserController {

    public static GetAdminUserList = async (data: { page: number, count: number }): Promise<IPagingRes<IGetAdminUserListResModel[]>> => {
        const result = await Connection.POST<object>({
            body: data,
            action: `GetAdminUserList`,
            controller,

        });

        return result;
    }

    public static GetUser = async (id: string): Promise<IResponse<IUserDetails>> => {
        const result = await Connection.GET({
            action: `GetUserById/${id}`,
            controller,
        });
        return result;
    }
    public static BlockUser = async ( form:{userId: number,day:number }): Promise<IResponse<boolean>> => {
        const result = await Connection.POST<object>({
            body:form,
            action: `Block/${form.userId}?day=${form.day}`,
            controller,
        });
        return result;
    }
    public static UnBlockUser = async (userId: number): Promise<IResponse<boolean>> => {
        const result = await Connection.POST<object>({
            body:{},
            action: `UnBlock/${userId}`,
            controller,
        });
        return result;
    }
    public static DeleteUser = async (userId: number): Promise<IResponse<boolean>> => {
        const result = await Connection.DELETE<object>({
            body:{},
            action: `Delete/${userId}`,
            controller,
        });
        return result;
    }
    public static FilterUsers = async (form:IFilterUserList): Promise<IPagingRes<IGetAdminUserListResModel[]>> => {
        const result = await Connection.POST<object>({
            body:form,
            action: `UserFilter`,
            controller,
        });
        return result;
    }
    public static ResetPassword = async ( data:{verificationTerm:string, phoneCode:string|null}, id:number): Promise<IResponse<boolean>> => {
        const result = await Connection.PUT<object>({
            body:data,
            action: `ResetPassword/${id}`,
            controller,
        });
        return result;
    }


};

export default UserController;
