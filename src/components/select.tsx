import * as React from 'react';

// import ClickOutside from '../click-outside';
// import { IDropdownOption } from '../../platform/constants/interfaces';
// import Settings from '../../platform/services/settings';
// import { DropdownNameFunctionType } from '../../platform/constants/types';
// import HelperPureComponent from '../../platform/classes/helper-pure-component';


// import './style.scss';
import '../assets/styles/components/select.scss'
import {IDropdownOption} from "../platform/constants/interfaces";
import HelperPureComponent from "../platform/classes/helper-pure-component";
import {DropdownNameFunctionType} from "./multi-select";
import ClickOutside from "./click-outside";

interface IState<Value> {
  isOpen: boolean;
  value: IDropdownOption<Value> | null;
};

interface IProps<Value> {
  placeholderOpacity?: boolean;
  changable?: boolean;
  placeholder?: React.ReactChild | string;
  onNewClick?(e: React.MouseEvent<HTMLLIElement>): void;
  className?: string;
  emptyText?: string;
  onChange?(value: IDropdownOption<Value> | null): void;
  withNew?: boolean;
  defaultValue?: Value;
  useValue?: boolean;
  value?: Value | null;
  options: Array<IDropdownOption<Value>>;
  clear?: boolean;
  isAllList?:boolean;
  isAnimation?:boolean;
  isPhoneNumber?:boolean;
};

class Select<Value extends string | number | null | {}> extends HelperPureComponent<IProps<Value>, IState<Value>> {

  public state: IState<Value> = {
    isOpen: false,
    value: null,
  }

  public static defaultProps = {
    placeholder: 'Select...',
    className: '',
    onChange: null,
    onNewClick: null,
    withNew: false,
    changable: true,
    useValue: false,
    value: null,
    options: [],
  }

  public componentDidMount() {
    let value: IDropdownOption<string | number | null | {}> | null = null;
    this.props.options.map(item => {
      if (!value && item.value === this.props.defaultValue) {

        value = item;
      }
      return true;
    });
    if (value) this.safeSetState({ value });
  }

  private toggleState = (isOpen: boolean) => this.safeSetState({ isOpen });

  private chooseItem = (item: IDropdownOption<Value>) => {
    const { onChange } = this.props;
    this.safeSetState({ value: item , isOpen: false });
    onChange && onChange(item || null);
  }

  private clearValue = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    const { onChange } = this.props;
    this.safeSetState({ value: null, isOpen: false });
    onChange && onChange(null);
  }

  private Options = () => {
    const { options,  emptyText } = this.props;
    const option = this.getCurrentValue();
    const showingOptions = options.filter(item => option ? item.value !== option.value : item.value !== '//cr');
    if(this.props.isAllList){
      return <ul className="I-select-body">
        {options.length ? options.map((item, index) => <li
            key={typeof item.value === 'number' ? item.value : index}
            onClick={() => this.chooseItem(item)}
            className={`${option && option.value===item.value ? 'selected_option':''}`}

        >{typeof item.name === 'function' ? (item.name as DropdownNameFunctionType)() : item.name}</li>) : <li className="I-select-empty-label">{emptyText }</li>}
        {/*{withNew && <li className="I-select-new-label" onClick={onNewClick && onNewClick}>{Settings.translations.new}</li>}*/}
      </ul>
    }else{
      return <ul className="I-select-body">
        {showingOptions.length ? showingOptions.map((item, index) => <li
            key={typeof item.value === 'number' ? item.value : index}
            onClick={() => this.chooseItem(item)}

        >{typeof item.name === 'function' ? (item.name as DropdownNameFunctionType)() : item.name}</li>) : <li className="I-select-empty-label">{emptyText }</li>}
        {/*{withNew && <li className="I-select-new-label" onClick={onNewClick && onNewClick}>{Settings.translations.new}</li>}*/}
      </ul>
    }
  }

  private getCurrentValue = () => {
    const { useValue, options } = this.props;
    return useValue ? options.find(item => item.value === this.props.value) : this.state.value;
  }

  public render() {
    const {
      placeholderOpacity,

      placeholder,
      className,
      clear,
      isAnimation,
      isPhoneNumber
    } = this.props;
    const { isOpen } = this.state;
    const value = this.getCurrentValue();

    return (
        <ClickOutside className={className} onClickOutside={() => this.toggleState(false)}>
          <div className="I-select">

            <div className={`I-select-header  ${isOpen ? ' I-select-open' : ''}`} onClick={() => this.toggleState(!isOpen)}>
              <span className={`G-fs-18 ${!value && placeholderOpacity ? 'I-select-placeholder' : ''}`}>{value  ? isPhoneNumber? value.value:  value.name : placeholder}</span>
              {clear && value && <i className="icon-ic_close" onClick={this.clearValue} />}
              { !clear? <i className={isOpen ? 'icon-arrow_up' : 'icon-arrow_down'} />:null}
            </div>
            {isAnimation ?  <this.Options /> : isOpen && <this.Options /> }

          </div>
        </ClickOutside>
    );
  }
}

export default Select;
