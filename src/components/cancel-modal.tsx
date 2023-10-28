import * as React from 'react';
import Modal from './modal';


interface IProps {
    onClose(): void;
}



class CancelModal extends React.Component<IProps, {}> {


    public render() {
        const {onClose} = this.props;
        return (
            <Modal className="B-report-text-modal" onClose={onClose}>
                <div className="B-report-block-content cancel-text">
                    <div className="B-report-text">
                        <p>Are you sure you want to cancel?</p>
                    </div>
                    <div className="B-classic-card-control-buttons btn">
                        <p
                            className="B-classic-card-cancel-button"
                            onClick={onClose}
                        >Cancel</p>
                        <button onClick={() => window.routerHistory.goBack()}

                            className="B-classic-card-modify-button"
                        >Confirm</button>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default CancelModal;