//? Service for connections with outside resources
//? Service for request

import Config from 'Config';
import alertify from 'alertifyjs';

import Modals from '../dispatchers/modals';
import { NoneJSONRequestBody } from '../constants/types';
import { IRequest, IRequestNoBody, IResponse } from '../constants/interfaces';

class Connection {

  //? To get query from object
  public static queryFromObject = (obj: object): string => {
    const str: string[] = [];
    for (const p in obj) {
      if (obj.hasOwnProperty(p) && (obj[p] !== null && obj[p] !== undefined && obj[p] !== '')) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    }

    return str.join("&");
  }

  //? To set header default configuration
  public static createHeaders = (isUpload: boolean): Headers => {
    const HEADERS = new Headers();
    HEADERS.append('Authorization', `Bearer ${window.localStorage.getItem('token')}`);
    !isUpload && HEADERS.append('Content-Type', 'application/json');
    return HEADERS;
  }



  //? To check the response
  public static responseRestructure = async (response: Response): Promise<any> => {
    if (response.status === 401 || response.status === 403) {
      window.localStorage.removeItem('token');
      window.location.reload();
    }

    return new Promise(resolve => {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        response.json().then((result: IResponse<any>) => {
          if (!result.success) {
            alertify.dismissAll();
            alertify.error(result.messages[0].value);
          }

          resolve(result);
        });
      } else response.text().then(resolve);
    });
  }


  //? POST request
  public static POST = async <Body extends object>(data: IRequest<Body>): Promise<any> => {
    const { controller, action, body, query, noneJSONBody } = data;
    const onlyQuery: boolean = (!action && query) as boolean;
    const HEADERS = Connection.createHeaders(noneJSONBody as boolean);

    if (noneJSONBody) {
      HEADERS.delete('Content-Type')
    }

    const response: Response = await fetch(`${Config.BASE_URL}api/${controller}${!onlyQuery ? '/' : ''}${action}${query ? `?${Connection.queryFromObject(query)}` : ''}`, {
      body: noneJSONBody ? body as NoneJSONRequestBody : JSON.stringify(body),
      method: 'POST',
      headers: HEADERS,
    });

    return Connection.responseRestructure(response);
  }

  //? PUT request
  public static PUT = async <Body extends object>(data: IRequest<Body>): Promise<any> => {
    const { controller, action, body, query, noneJSONBody } = data;
    const onlyQuery: boolean = (!action && query) as boolean;
    const HEADERS = Connection.createHeaders(noneJSONBody as boolean);
    const response: Response = await fetch(`${Config.BASE_URL}api/${controller}${!onlyQuery ? '/' : ''}${action}${query ? `?${Connection.queryFromObject(query)}` : ''}`, {
      body: noneJSONBody ? body as NoneJSONRequestBody : JSON.stringify(body),
      method: 'PUT',
      headers: HEADERS,
    });

    return Connection.responseRestructure(response);
  }

  //? DELETE request
  public static DELETE = async <Body extends object>(data: IRequest<Body>): Promise<any> => {
    const { controller, action, body, query, noneJSONBody } = data;

    return new Promise(resolve => {
      Modals.toggleConfirmModal(async isConfirmed => {
        if (isConfirmed) {
          const onlyQuery: boolean = (!action && query) as boolean;
          const HEADERS = Connection.createHeaders(false);
          const response: Response = await fetch(`${Config.BASE_URL}api/${controller}${!onlyQuery ? '/' : ''}${action}${query ? `?${Connection.queryFromObject(query)}` : ''}`, {
            body: noneJSONBody ? body as NoneJSONRequestBody : JSON.stringify(body),
            method: 'DELETE',
            headers: HEADERS,
          });

          resolve(Connection.responseRestructure(response));
        }
      });
    });

  }

  //? GET request
  public static GET = async (data: IRequestNoBody): Promise<any> => {
    const { controller, action, query } = data;
    const onlyQuery = !action && query;
    const HEADERS = Connection.createHeaders(false);
    const response: Response = await fetch(`${Config.BASE_URL}api/${controller}${!onlyQuery ? '/' : ''}${action}${query ? `?${Connection.queryFromObject(query)}` : ''}`, {
      method: 'GET',
      headers: HEADERS,
    });

    return Connection.responseRestructure(response);
  }
}

export default Connection;