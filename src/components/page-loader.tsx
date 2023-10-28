import * as React from 'react';

let loadingTimeout: NodeJS.Timer | null = null;

interface IState {
  show: boolean,
};

class PageLoader extends React.PureComponent<{}, IState> {

  public state: IState = { show: false };

  public componentDidMount() { loadingTimeout = setTimeout(() => this.setState({ show: true }), 500); }
  public componentWillUnmount() { loadingTimeout && clearTimeout(loadingTimeout); }

  public render() {
    const { show } = this.state;

    return show ? (
      <div className="B-loader-wrapper">
        <div className="B-loader" />
      </div>
    ) : null;
  }
}

export default PageLoader;