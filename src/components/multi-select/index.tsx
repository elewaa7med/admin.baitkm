import * as React from 'react';

import ClickOutside from '../click-outside';
import { IDropdownOption } from '../../platform/constants/interfaces';
import HelperPureComponent from '../../platform/classes/helper-pure-component';
interface IState<Value> {
  isOpen: boolean;
  value: Value[];
};

export type DropdownNameFunctionType = () => string | number | React.ReactNode | HTMLElement;
interface IProps<Value> {
  placeholderOpacity?: boolean;
  changable?: boolean;
  placeholder?: React.ReactChild | string;
  onNewClick?(e: React.MouseEvent<HTMLLIElement>): void;
  className?: string;
  emptyText?: string;
  onChange?(value: Value[]): void;
  withNew?: boolean;
  defaultValue?: Value[];
  value?: Value[] | null;
  options: Array<IDropdownOption<Value>>;
  clear?: boolean;
};

class MultiSelect<Value extends string | number | null | {}> extends HelperPureComponent<IProps<Value>, IState<Value>> {

  public state: IState<Value> = {
    isOpen: false,
    value: [],
  }

  public static defaultProps = {
    placeholder: 'Select...',
    className: '',
    onChange: null,
    onNewClick: null,
    withNew: false,
    changable: true,
    value: null,
    options: [],
  }

  public componentDidMount() {
    const { value, defaultValue } = this.props;
    value || defaultValue && this.safeSetState({ value: value || defaultValue });
  }

  private toggleState = (isOpen: boolean) => this.safeSetState({ isOpen });

  private toggleItem = (item: IDropdownOption<Value>) => {
    const { changable, onChange } = this.props;

    if (changable) {
      const value = this.getCurrentValue();
      const index = value.indexOf(item.value);
      if (index === -1) value.push(item.value);
      else value.splice(index, 1);

      this.safeSetState({ value, isOpen: false });
      onChange && onChange(value);  
    }
  }

  private clearValue = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    const { onChange } = this.props;
    this.safeSetState({ value: [], isOpen: false });
    onChange && onChange([]);
  }

  private Options = () => {
    const { options, withNew, onNewClick, emptyText } = this.props;
    const value = this.getCurrentValue();

    return <ul className="I-select-body">
      {options.length ? options.map((item, index) => <li
        key={typeof item.value === 'number' ? item.value : index}
        onClick={() => this.toggleItem(item)}
        className={value.includes(item.value) ? 'I-chosen' : ''}
      >{typeof item.name === 'function' ? (item.name as DropdownNameFunctionType)() : item.name}</li>) : <li className="I-select-empty-label">{emptyText || 'No lists'}</li>}
      {withNew && <li className="I-select-new-label" onClick={onNewClick && onNewClick}>+new</li>}
    </ul>
  }

  private getCurrentValue = () => {
    const { value } = this.props;
    return value ? [...value] : this.state.value;
  }

  public render() {
    const {
      placeholderOpacity,
      changable,
      placeholder,
      className,
      clear,
    } = this.props;
    const { isOpen } = this.state;
    const value = this.getCurrentValue();

    return (
      <ClickOutside className={className} onClickOutside={() => this.toggleState(false)}>
        <div className="I-multi-select">
          <div className={`I-select-header  ${isOpen ? ' I-select-open' : ''}`} onClick={() => this.toggleState(!isOpen)}>
            <span className={`G-fs-18 ${!value && placeholderOpacity ? 'I-select-placeholder' : ''}`}>{value && value.length && changable ? `${value.length} option(s)` : <p className='placeholder-select'>{placeholder}</p>}</span>
            {clear && value && value.length>0 && <i className="clear-text" onClick={this.clearValue} />}

              {value.length===0 ? <i className={isOpen ? 'icon-arrow_down' : 'icon-arrow_down'} /> : null}
          </div>
          {isOpen && <this.Options />}
        </div>
      </ClickOutside>
    );
  }
}

export default MultiSelect;
