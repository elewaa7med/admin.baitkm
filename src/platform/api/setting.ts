import Connection from '../services/connection';
import { IResponse, AnnouncementPhotoType, IGetProfilePhoto } from '../constants/interfaces';
const controller = 'Configuration';
// Response Model


export interface IGetSettings {
  id: number,
  key: string,
  value:string
}

export interface IGetCoverImg {
    id: number;
    isBase: boolean,
    photo: IGetProfilePhoto
    announcementPhotoType: AnnouncementPhotoType,
}






class SettingController {

    public static GetSettings = async (): Promise<IResponse<IGetSettings[]>> => {
        const result = await Connection.GET({
            action: `GetSettings`,
            controller,
        });

        return result;
    }


    public static ApproveSettings = async (data: IGetSettings[]): Promise<IResponse<boolean>> => {
        const result = await Connection.POST<object>({
            body: data,
            action: 'Edit',
            controller,
        });
        return result;
    }


    public static GetCoverImgList = async (): Promise<IResponse<IGetCoverImg[]>> => {
        const result = await Connection.GET({
            action: `GetHomePageCoverImageList`,
            controller,
        });

        return result;
    }

    public static UploadCoverImg = async (data: FormData): Promise<IResponse<boolean>> => {

        const result = await Connection.POST<object>({
            body: data,
            action: `UploadHomePageCoverImage`,
            noneJSONBody: true,
            controller,

        });

        return result;
    }


    public static RemoveCoverImg = async (id: number): Promise<IResponse<boolean>> => {
        const result = await Connection.DELETE<object>({
            body: {},
            action: `RemovePhoto/${id}`,
            controller,

        });

        return result;
    }
    public static MakeCoverImg = async (id: number): Promise<IResponse<boolean>> => {
        const result = await Connection.PUT<object>({
            body: {},
            action: `BasePhoto/${id}`,
            controller,

        });

        return result;
    }

};

export default SettingController;


