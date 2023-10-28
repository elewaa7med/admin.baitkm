import * as React from 'react';

interface IProps {
  int?: boolean;
  max?: number;
  name?: string;
  value?: number | string;
  pattern?: string;
  className?: string;
  placeholder?: string;
  onChange?(e: React.SyntheticEvent<HTMLElement>): void;
};

class NumberInput extends React.Component<IProps, {}> {

  public static defaultProps = {
    max: 1000000000000,
  }

  private onChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    if (!e.currentTarget.validity.valid) return false;
    if (this.props.max && this.props.onChange && +e.currentTarget.value <= this.props.max) {
      this.props.onChange(e);
    }
    
    return true;
  }

  public render() {
    const { int } = this.props;
    const props = {...this.props};
    props.value = props.value ? props.value.toString() : '';
    delete props.onChange;
    delete props.pattern;
    delete props.int;
    return <input
      pattern={int ? '([0-9]*)' : '([0-9]*)+([./]?|[./][0-9][0-9]?)'}
      onChange={this.onChange}
      {...props}
    />;
  }
}

export default NumberInput;