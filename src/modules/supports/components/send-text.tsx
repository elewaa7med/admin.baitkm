import * as React from 'react';
import 'react-image-lightbox/style.css';

interface IProps {
    textList: string;
};


class SendText extends React.Component<IProps> {

    public render() {
        const { textList } = this.props;

        return (
            <div className="B-sent-user-text">
            <p>{textList}</p>
        </div>
        )
    }
}

export default SendText;