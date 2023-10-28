import Connection from '../services/connection';
import { IResponse } from '../constants/interfaces';

const controller = 'Token';

export interface ILoginRequestModel {
  verificationTerm: string;
  password: string;
};


export interface ILoginResponseModel {
  accessToken: string;
};



class AccountController {

  public static Signin = async (form: ILoginRequestModel): Promise<IResponse<ILoginResponseModel>> => {
    const result = await Connection.POST<ILoginRequestModel>({
      body: form,
      action: 'Token',
      controller,

    });
    if (result.success) {
      window.localStorage.setItem('token', result.data.accessToken);
      window.location.reload();
    }

    return result;
  }
};

export default AccountController;
