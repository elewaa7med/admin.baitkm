import * as React from 'react';
// import alertify from 'alertifyjs';
import Modal from './modal';
import LoaderContent from './loader-content';
import EmailController, {IAddEmail, IGetEmailList} from "../platform/api/email";
import alertify from "alertifyjs";
import {isValidEmail} from "./recover-login-modal";


interface IProps {
    onClose(): void;

    fetchData(): void;

    isEdit: boolean;
    email?: IGetEmailList
}

interface IState {
    submitLoading: boolean;
    form: IAddEmail;
    errorEmail: boolean
}

class AddNewEmail extends React.Component<IProps, IState> {
    public state: IState = {
        submitLoading: false,
        form: {
            email: ''
        },
        errorEmail: false
    };

    public componentDidMount() {

        if (this.props.isEdit) {
            if (this.props.email) {
                this.setState({
                    form: {
                        email: this.props.email.email
                    }
                })
            }
        }
    }

    private changeUserName = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const {form} = this.state;
        form.email = e.currentTarget.value;
        this.setState({form})
    };

    private submit = async () => {
        const {form} = this.state
        const {email}  = this.props;
        if (form.email.trim()) {
            this.setState({errorEmail: false})
            if (isValidEmail(form.email)) {

                if (this.props.isEdit) {
                    if (email) {
                        this.setState({submitLoading: true}, async () => {
                            const body = {
                                email: form.email,
                                id: email.id,
                            };
                            const result = await EmailController.EditEmail(body)
                            if (result.success) {
                                alertify.success('Email was changed')
                                this.props.onClose()
                                this.props.fetchData()
                            }
                        })
                    }


                } else {
                    this.setState({submitLoading: true}, async () => {
                        this.setState({errorEmail: false})
                        const ressult = await EmailController.AddEmail(form)
                        if (ressult.success) {
                            alertify.success('Email was added')
                            this.props.onClose()
                            this.props.fetchData()
                            this.setState({submitLoading: false})
                        }
                    })
                }


            } else {
                this.setState({errorEmail: true})
                alertify.error('Incorrect email')
            }
        } else {
            this.setState({errorEmail: true})
            alertify.error('Please fill the field')
        }

    }


    public render() {

        const {onClose} = this.props;
        const {submitLoading} = this.state;

        return (

            <Modal className="B-log-out-modal " onClose={onClose}>
                <div className="B-log-out-title">
                    <h3>Add new email</h3>
                </div>
                <div className='B-announcement-filter-block email-add-input-box'>
                    <div className='padding-inputs-filter  '>
                        <div className={`B-announcement-input-block ${this.state.errorEmail ? 'error-input' : ''}`}>
                            <label>
                                <input type="text"
                                       name='email'
                                       value={this.state.form.email}
                                       placeholder='New email'
                                       autoComplete='off'
                                       onChange={this.changeUserName}
                                />
                            </label>
                        </div>
                    </div>
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
                    >{this.props.isEdit ? 'Save' : 'Create'}</LoaderContent>
                </div>
            </Modal>
        );
    }
}

export default AddNewEmail;
