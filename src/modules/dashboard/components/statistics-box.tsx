import * as React from 'react';
import { Link } from 'react-router-dom';

interface IStatisticProp {
  statisticsVal: number,
  statisticsName: string,
  path: string,
}

class Statistic extends React.Component<IStatisticProp, {}> {
    public render() {
      const {statisticsVal, statisticsName, path} = this.props;
        return (

          <Link to={path} className='B-padding-statistics'>
            <div className='B-statistics-box'>
              <span>{statisticsVal || 0}</span>
              <p>{statisticsName}</p>
            </div>
          </Link>
        )
    }
}

export default Statistic;
