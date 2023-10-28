import Connection                        from '../services/connection';
import { IResponse, IPaging, IUser }     from '../constants/interfaces';
import { SortTypeEnum, UsersSortByEnum } from '../constants/enums';

const controller = 'Admin';

export interface IUsersListRequestModel {
  searchWord: string;
  orderBy: UsersSortByEnum | null;
  orderType: SortTypeEnum | null;
  pageNumber: number;
  itemQuantity: number;
};

export interface IUsersListResponseModel extends IPaging {
  users: IUser[];
};

class AdminController {

  public static UsersList = async (body: IUsersListRequestModel): Promise<IResponse<IUsersListResponseModel>> => {
    const result: IResponse<IUsersListResponseModel> = await Connection.POST<IUsersListRequestModel>({
      body,
      action: `SearchUsers`,
      controller,
    });

    return result;
  }
};

export default AdminController;