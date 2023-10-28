import * as React from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import Modal from "../../../components/modal";

interface IProps {
    sliderImg: string;
    thumbNail?: string | null;
};

interface IState {
    isOpen: boolean,
}

class SliderDetailsAnnouncement extends React.Component<IProps> {

    public state: IState = {
        isOpen: false,
    }

    public render() {
        const {sliderImg} = this.props;

        // const images: any = [
        //     { src: sliderImg, title: 'title', content: 'content' },

        // ];
        return (
            <>
                {
                    this.props.thumbNail ?
                        <>
                            {this.state.isOpen && (<Modal onClose={() => this.setState({isOpen: false})}>
                            <div className='B-slider-box'>
                                <video typeof="video/mp4" autoPlay={true} src={sliderImg} controls={true} loop={true}/>
                            </div>
                        </Modal>)}
                            <div className="B-slider-components" onClick={() => this.setState({isOpen: true})}>
                                <div className='B-slider-box for-play-video'
                                     style={{backgroundImage: `url("${this.props.thumbNail}")`}}>
                                    <span className="play-video"/>
                                </div>
                            </div>
                        </>
                        : <div className='B-slider-components' onClick={() => this.setState({isOpen: true})}>
                            {this.state.isOpen && (
                                <Lightbox
                                    mainSrc={sliderImg}
                                    onCloseRequest={() => this.setState({isOpen: false})}
                                />
                            )}
                            <div className='B-slider-box' style={{backgroundImage: `url("${sliderImg}")`}}/>
                        </div>
                }</>
        )
    }
}

export default SliderDetailsAnnouncement;
