import * as React from 'react';


interface IState {
    el: any;
};

class InfinityScroll extends React.Component<any, any> {

    public state: IState = {
        el: ''
    }
    public componentDidMount = () => {

        window.addEventListener('scroll', this.scroll);
    }
    public componentWillUnmount() {
        window.removeEventListener('scroll', this.scroll);
    }
    public scroll = () => {
        debugger
        if (this.props.el && !this.props.disabled) {
            if (this.props.el.getBoundingClientRect().top - (window.innerHeight + 100) < 0) {
                this.props.update();
            }
        }
    }
    public render() {
        return (
            <div ref={ref => this.state.el = ref} />
        );
    }
}
export default InfinityScroll;
