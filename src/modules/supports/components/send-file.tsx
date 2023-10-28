import * as React from 'react';
import 'react-image-lightbox/style.css';
import PdfIcon from "../../../assets/images/pdf-icon.png";

interface IProps {
    fileName: string;
    fileUrl: string;
};


class SentFile extends React.Component<IProps> {

    public render() {
        const { fileName, fileUrl } = this.props;
        return (
            <a href={fileUrl} download={fileName}>
            <div className="B-sent-user-text file-block">
                <div className="file-style" style={{ backgroundImage: 'url(' + PdfIcon + ')' }} />
                <p>{fileName}</p>
            </div>
        </a>
        )
    }
}

export default SentFile;
