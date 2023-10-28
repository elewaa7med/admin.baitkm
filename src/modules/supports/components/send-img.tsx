import * as React from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
interface IProps {
    sliderImg: string;
};
interface IState {
    isOpen: boolean,
}

class SentImg extends React.Component<IProps> {

    public state: IState = {
        isOpen: false,

    }
    public render() {
        const { sliderImg } = this.props;

        return (
            <div className="B-sent-user-img" onClick={() => this.setState({ isOpen: true })}>
            {this.state.isOpen && (
                <Lightbox
                    mainSrc={sliderImg}
                    onCloseRequest={() => this.setState({ isOpen: false })}
                />
            )}
            <div className="B-sent-user-img-style" style={{ backgroundImage: "url("+sliderImg+")" }} />
        </div> 
        )
    }
}

export default SentImg;