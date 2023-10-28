import Connection from '../services/connection';
import { IResponse } from '../constants/interfaces';

const controller = 'Geographic';

export interface IGetCity {
    id: number,
    name: string
}


class GeographicController {
    public static GetGeographicList = (search :string): Promise<IResponse<IGetCity[]>> => {
        const result = Connection.GET({
            action: `City/${search}`,
            controller,
        });
        return result;
    };

    public static GetCityList = (country: number): Promise<IResponse<IGetCity[]>> => {
        const result = Connection.GET({
            action: `Cities/${country}`,
            controller,
        });
        return result;
    };

    public static GetCountryList = (): Promise<IResponse<IGetCity[]>> => {
        const result = Connection.GET({
            action: `Countries`,
            controller,
        });
        return result;
    };
}

export default GeographicController;
