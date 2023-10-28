import * as React from 'react';
import alertify from 'alertifyjs';
import Modal from './modal';
import LoaderContent from './loader-content';
import UserController from "../platform/api/user";


interface IProps {
    onClose(): void;
    dataFetch(val:number):void;
    form:{
        userId:number;
        day:number
    }
}

interface IState {
    submited: boolean;
    submitLoading: boolean;
    day:string;
    errorDay:boolean;
}



class BlockModal extends React.Component<IProps, IState> {

    public state: IState = {
        submited: false,
        submitLoading: false,
        day:'',
        errorDay:false
    };

    private change = (e: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({ day: e.currentTarget.value, submitLoading:false });
    };

   private  isValidPhone = (value?: string | null): boolean => {
        if (!value && value !== '') return false;
         const regex = new RegExp('^[0-9]*$');
        return regex.test(value);
    };

        private submit = async () => {
            this.setState({submitLoading: true})
            if (this.state.day) {
                if (this.isValidPhone(this.state.day)) {
                    if (+this.state.day > 0) {
                        this.props.form.day = Number(this.state.day);
                        const result = await UserController.BlockUser(this.props.form);
                        if (result.success) {
                            if (this.props.form.userId) {
                                this.props.dataFetch(this.props.form.userId);
                            } else {
                                this.props.dataFetch(1);
                            }
                            this.props.onClose()
                        }
                    } else {
                        alertify.error('You must enter a number higher than 1 to block user', 2);
                        this.setState({errorDay: true, submitLoading: false})

                    }

                }else{
                    this.setState({errorDay: true, submitLoading: false})
                }

            } else {
                this.setState({errorDay: true, submitLoading: false})
                alertify.error('Enter the day for block', 2);
            }
        };


    public render() {

        const { onClose } = this.props;
        const { submitLoading } = this.state;

        return (
            <Modal className="B-block-user-modal" onClose={onClose}>
                <div className="B-block-user-container">
                    <div className="B-block-user-title">
                        <h3>Block  user</h3>
                        <p>Type blocked user days counts</p>
                    </div>
                </div>

                <div className={`B-block-user-input ${this.state.errorDay? 'B-error': ''}`}>
                    <label>
                        <input
                          type="text"
                          name='day'
                          placeholder='day'
                          onChange={this.change}
                          value={this.state.day}
                          autoComplete='off'

                        />
                    </label>
                </div>
                <div className="B-classic-card-control-buttons btn">
                    <p
                        className="B-classic-card-cancel-button"
                        onClick={onClose}
                    >Cancel</p>
                    <LoaderContent
                        loading={submitLoading}
                        className="B-classic-card-modify-button"
                        onClick={this.submit}
                    >Block</LoaderContent>
                </div>
            </Modal>
        );
    }
}

export default BlockModal;
