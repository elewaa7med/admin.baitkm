import Connection    from '../services/connection';
import { IResponse } from '../constants/interfaces';

const controller = 'sessions';

class SessionsController {

  public static CreateSession = async (): Promise<IResponse<string>> => {
    const result: IResponse<string> = await Connection.GET({
      action: 'create-session',
      controller,
    });

    return result;
  };

  public static GetToken = async (): Promise<IResponse<string>> => {
    const result: IResponse<string> = await Connection.GET({
      action: 'get-token',
      controller,
    });

    return result;
  };
};

export default SessionsController;