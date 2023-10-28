import * as React from 'react';

interface IProps {
  children: React.ReactNode;
  className?: string;
  onClickOutside?(): void;
};

class ClickOutside extends React.PureComponent<IProps, {}> {

  private container = React.createRef<HTMLDivElement>();

  public componentDidMount() {
    document.addEventListener('click', this.handle, true);
  }

  public componentWillUnmount() {
    document.removeEventListener('click', this.handle, true);
  }

  private handle = (e: MouseEvent) => {
    const { onClickOutside } = this.props;
    if (this.container.current) {
      !this.container.current.contains(e.target as HTMLElement) && onClickOutside && onClickOutside();
    }
  };
  
  public render() {
    const { children, onClickOutside, ...props } = this.props;
    return <div {...props} ref={this.container}>{children}</div>;
  }
}

export default ClickOutside;
