import * as React       from 'react';
import { createPortal } from 'react-dom';

import ClickOutside from './click-outside';

interface IProps {
  children: React.ReactNode;
  className?: string;
  onClose?(): void;
  withoutPortal?: boolean;
};

interface IState {
  closed: boolean;
};

class Modal extends React.PureComponent<IProps, IState> {

  public static defaultProps = {
    children: null,
    className: '',
  }

  public state: IState = {
    closed: false,
  }

  public render() {
    const { children, className, onClose, withoutPortal } = this.props;

    return withoutPortal ? (
      <div className={`B-modal-wrapper${className ? ` ${className}` : ''}`}>
        <ClickOutside onClickOutside={onClose}>
          <div className="B-modal-content">{children}</div>
        </ClickOutside>
      </div>
    ) : createPortal(
      <div className={`B-modal-wrapper${className ? ` ${className}` : ''}`}>
        <ClickOutside onClickOutside={onClose}>
          <div className="B-modal-content">{children}</div>
        </ClickOutside>
      </div>, document.getElementById('modals') as Element,
    );
  }
}

export default Modal;