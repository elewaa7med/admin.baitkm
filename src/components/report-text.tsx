import * as React from 'react';
import Modal from './modal';


interface IProps {
    onClose(): void;
    reportText:string
}



class ReportTextModal extends React.Component<IProps, {}> {


    public render() {
        const {onClose} = this.props;
        return (
            <Modal className="B-report-text-modal" onClose={onClose}>
                <div className="B-report-block-content">
                    <div className="B-report-title">
                        <h3>The reason of report</h3>
                    </div>
                    <div className="B-report-text">
                        <p>{this.props.reportText}</p>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default ReportTextModal;