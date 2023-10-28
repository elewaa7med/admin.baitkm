import * as React from 'react';
import LaddaButton from 'react-ladda';

interface IProps {
  className?: string;
  disabled: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  imageContent?: boolean;
  onClick?(e: React.SyntheticEvent<HTMLElement>): void;
};

interface IState {
  loading?: boolean;
}

class LoaderContent extends React.PureComponent<IProps, IState> {

  public static defaultProps = {
    className: '',
    disabled: false,
    children: null,
    imageContent: false,
  };

  public state: IState = {
    loading: false,
  }

  private loadingTimeout: NodeJS.Timer;

  public componentWillReceiveProps(nextProps: IProps) {

    this.setState({loading:nextProps.loading})
    // if (nextProps.loading !== this.state.loading && nextProps.loading) {
    //   this.loadingTimeout = setTimeout(() => this.setState({ loading: true }), 500);
    // } else if (nextProps.loading !== this.state.loading && this.state.loading) {
    //   clearTimeout(this.loadingTimeout);
    //   this.setState({ loading: false });
    // }
  }

  public componentWillUnmount() { clearTimeout(this.loadingTimeout); }

  public render() {
    const { children, className } = this.props;
    const filteredProps = { ...this.props };
    delete filteredProps.imageContent;
    delete filteredProps.className;
    delete filteredProps.loading;


    return <LaddaButton
    {...filteredProps}
      loading={this.state.loading}
      data-spinner-size={30}
      data-spinner-lines={40}
      // className={`${className}`}
      className={`${className} ${this.props.imageContent ? ' ladda-image' : ''}`}
      
    >{children}</LaddaButton>;
  };
};


export default LoaderContent;
