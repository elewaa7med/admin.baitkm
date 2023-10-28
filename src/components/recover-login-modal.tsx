import * as React from 'react';
import Modal from './modal';
import LoaderContent from './loader-content';
import {PhoneCodeController} from "../platform/api/phone-code";
import UserController from "../platform/api/user";
import Select from "react-select";


interface IProps {
    onClose(): void;
    userId: number;
};

export interface IPhoneList {
    value: string;
    label: string
}
interface IState {
    loading: boolean;
    errorverificationEmail: boolean;
    errorverificationPhone: boolean;
    phoneList: IPhoneList[] | null;
    phoneCurrent: IPhoneList | null;
    changekeyProps: boolean,
    verificationTermPhone: string;
    verificationTermEmail: string;

}

export const isValidEmail = (value?: string | null): boolean => {
    if (!value && value !== '') return false;
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(value);
};

export const isValidPhone = (value?: string | null): boolean => {
    if (!value && value !== '') return false;

    const regex = new RegExp('^[0-9]*$');
    return regex.test(value);
};

class RecoverModal extends React.Component<IProps, IState> {
    public x = '';
    public state: IState = {
        loading: false,
        errorverificationEmail: false,
        errorverificationPhone: false,
        phoneList: null,
        phoneCurrent: null,
        changekeyProps: false,
        verificationTermPhone: '',
        verificationTermEmail: '',

    }


    public componentDidMount() {
        this.getPhoneCode();
    }

    private change = (e: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({
            loading: false
        });
        if (e.currentTarget.name === 'verificationTermPhone') {
            this.state.verificationTermPhone = e.currentTarget.value;
            this.setState({verificationTermPhone: this.state.verificationTermPhone});
        }
        if (e.currentTarget.name === 'verificationTermEmail') {
            this.state.verificationTermEmail = e.currentTarget.value;
            this.setState({verificationTermEmail: this.state.verificationTermEmail});
        }
    };

    private getPhoneCode = async () => {
        const result = await PhoneCodeController.GetPhoneCodeList();
        if (result.success) {
            const phoneList = result.data.map(item => {
                return {
                    value: item.code,
                    label: item.code + ' ' + item.country,
                }
            });

            this.setState({
                phoneList,
                phoneCurrent: null,
            })
        }
    };
    public changeItem = (option: any) => {
        const array = option.label.split(' ');
        this.setState({
            phoneCurrent: {
                value: option.value,
                label: array[0]
            },
        })
    };

    public changeKeyProps = () => {
        this.setState({
            changekeyProps: !this.state.changekeyProps
        })
    };
    private submit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        this.setState({loading: true}, async () => {
            if (this.state.changekeyProps) {

                this.x = this.state.verificationTermPhone;
                if (this.x && this.state.phoneCurrent) {

                    if (isValidPhone(this.x) && this.x.length > 6 && this.x[0] !== '0') {
                        const result = await UserController.ResetPassword({verificationTerm:this.x, phoneCode:this.state.phoneCurrent ? this.state.phoneCurrent.value : ''}, this.props.userId);
                        if (result.success) {
                            const alertify = await import('alertifyjs');
                            alertify.success('The account was successfully was reset', 2)
                            window.location.reload();
                        }
                        this.setState({
                            errorverificationPhone: false,
                            loading: false,
                        })
                    } else {
                        this.setState({
                            errorverificationPhone: true,
                            loading: false,
                        });
                        const alertify = await import('alertifyjs');
                        alertify.error('Phone Number is incorrect', 2)
                    }
                } else {
                    this.setState({
                        errorverificationPhone: true,
                        loading: false,
                    });
                    const alertify = await import('alertifyjs');
                    alertify.error('Fill in Phone Number field', 2)
                }

            } else {
                this.x = this.state.verificationTermEmail;
                if (this.x) {
                    if (isValidEmail(this.x)) {
                        const result = await UserController.ResetPassword({verificationTerm:this.x, phoneCode:null}, this.props.userId);
                        if (result.success) {
                            const alertify = await import('alertifyjs');
                            alertify.success('The account was successfully was reset', 2)
                            window.location.reload();
                        }
                    } else {
                        this.setState({
                            errorverificationEmail: true,
                            loading: false,
                        });
                        const alertify = await import('alertifyjs');
                        alertify.error('Email is incorrect', 2)
                    }
                } else {
                    this.setState({
                        errorverificationEmail: true,
                        loading: false,
                    });
                    const alertify = await import('alertifyjs');
                    alertify.error('Fill in Email field', 2)
                }

            }
        });
    };


    public render() {

        const {onClose} = this.props;

        return (

            <Modal className="B-restore-modal" onClose={onClose}>
                <div className="B-restore-block I-personal-data-pd">
                    <div className="I-G-fields-form">
                        <p className='G-mb-6'>Choose the method to reset the user's account</p>
                        <div className='G-send-key-menu G-flex-align-center'>
                            <div className='G-send-radio'>
                                <label>
                                    <input name='send-Key' defaultChecked={true} onChange={this.changeKeyProps}
                                           type="radio"/>
                                    <span/>
                                    <p>Via email</p>
                                </label>
                            </div>
                            <div className='G-send-radio'>
                                <label>
                                    <input name='send-Key' onChange={this.changeKeyProps} type="radio"/>
                                    <span/>
                                    <p>Via phone number</p>
                                </label>
                            </div>
                        </div>

                        <div className='send-key-block'>
                            {this.state.changekeyProps ? <div className='send-key-from-phone G-flex-align-center'>
                                {this.state.phoneList  ?
                                    <div
                                        className={`I-personal-inputs ${this.state.errorverificationPhone ? 'error-input' : ''} ${this.state.phoneCurrent ? 'change-color' : ''}`}>
                                        <Select<IPhoneList>
                                            value={this.state.phoneCurrent}
                                            placeholder='Code'
                                            onChange={this.changeItem}
                                            options={this.state.phoneList}
                                            className='change-select'
                                            isSearchable={false}
                                        />
                                    </div> : null}
                                <div
                                    className={`G-singup-input I-personal-inputs ${this.state.errorverificationPhone ? 'error-input' : ''}`}>
                                    <label>
                                        <input

                                            name="verificationTermPhone"
                                            type="text"
                                            value={this.state.verificationTermPhone}
                                            placeholder="Enter phone number "
                                            onChange={this.change}/>
                                    </label>
                                </div>
                            </div> : <div className='send-key-feom-email'>
                                <div
                                    className={`G-singup-input I-personal-inputs ${this.state.errorverificationEmail ? 'error-input' : ''}`}>
                                    <label>
                                        <input
                                            name="verificationTermEmail"
                                            type="text"
                                            value={this.state.verificationTermEmail}
                                            placeholder="Enter Email"
                                            onChange={this.change}/>
                                    </label>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>

                <div className="B-classic-card-control-buttons btn">
                    <p
                        className="B-classic-card-cancel-button"
                        onClick={onClose}
                    >Cancel</p>
                    <LoaderContent
                        loading={this.state.loading}
                        className="B-classic-card-modify-button"
                        onClick={this.submit}
                    >Confirm</LoaderContent>
                </div>
            </Modal>
        );
    }
}

export default RecoverModal;
