import Connection                             from '../services/connection';
import { IResponse, ICategory }               from '../constants/interfaces';
import { CategoriesSortByEnum, SortTypeEnum } from '../constants/enums';

const controller = 'Category';

export interface ICategoryListRequestModel {
  searchWord: string;
  orderBy: CategoriesSortByEnum;
  orderType: SortTypeEnum;
};

export interface ICategoryUpdateRequestModel {
  id: number;
  name: string;
};

class CategoryController {

  public static GetList = async (): Promise<IResponse<ICategory[]>> => {
    const result: IResponse<ICategory[]> = await Connection.GET({
      action: 'GetCategories',
      controller,
    });

    return result;
  };

  public static Search = async (filter: ICategoryListRequestModel): Promise<IResponse<ICategory[]>> => {
    const result: IResponse<ICategory[]> = await Connection.POST<ICategoryListRequestModel>({
      body: filter,
      action: 'SearchCategory',
      controller,
    });

    return result;
  };

  public static Delete = async (id: number): Promise<IResponse<boolean>> => {
    const result: IResponse<boolean> = await Connection.DELETE<object>({
      body: {},
      action: `DeleteCategory/${id}`,
      controller,
    });

    return result;
  }

  public static Add = async (name: string): Promise<IResponse<boolean>> => {
    const result: IResponse<boolean> = await Connection.POST<object>({
      body: {},
      action: `AddCategory/${name}`,
      controller,
    });

    return result;
  }

  public static Update = async (name: string, id: number): Promise<IResponse<boolean>> => {
    const result: IResponse<boolean> = await Connection.PUT<ICategoryUpdateRequestModel>({
      body: { id, name },
      action: 'UpdateCategory',
      controller,
    });

    return result;
  }
};

export default CategoryController;