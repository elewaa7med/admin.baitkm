import * as React from 'react';
// import alertify from 'alertifyjs';
import Modal from './modal';
import LoaderContent from './loader-content';
import SettingController from "../platform/api/setting";
import AnnouncementController from "../platform/api/announcement";
import alertify from "alertifyjs";
import ROUTES from "../platform/constants/routes";
// import ROUTES from "../platform/constants/routes";

// import { Link } from 'react-router-dom';


interface IProps {
    onClose(): void;
    DescriptionTitleEng:string
    DescriptionTextEng:string
    DescriptionTitleAr:string
    DescriptionAr:string
    id:number

}

interface IState {
    submited: boolean;
    submitLoading: boolean;
    reasonArr: [];
    day: string;
    defaultDay:string;
    DescriptionType:string;
    isDefault:boolean;
    errorDay:boolean;
    isApprove:boolean;
    loading:boolean;
}

class ApproveModal extends React.Component<IProps, IState> {
    public state: IState = {
        submited: false,
        submitLoading: false,
        reasonArr: [],
        day: '0',
        defaultDay: '',
        DescriptionType:'',
        isDefault:true,
        errorDay:false,
        isApprove:false,
        loading:false
    };
    public componentDidMount() {
        this.fetchData();
    }


    private change = (e: any) => this.setState({
        day: e.target.value,
    });
    private  isValidPhone = (value?: string | null): boolean => {
        if (!value && value !== '') return false;
        const regex = new RegExp('^[0-9]*$');
        return regex.test(value);
    }
    private submit = async () => {
        if(!this.state.isApprove){
            this.state.isApprove = true
            if(this.isValidPhone(this.state.defaultDay) && this.isValidPhone(this.state.day)){
                await AnnouncementController.ApproveAnnouncement({
                    title: this.props.DescriptionTitleEng,
                    description: this.props.DescriptionTextEng,
                    titleArabian: this.props.DescriptionTitleAr,
                    descriptionArabian: this.props.DescriptionAr,
                    day:Number(this.state.day),
                    defaultDay:Number(this.state.defaultDay),
                }, Number(this.props.id));
                this.setState({errorDay:false})
                window.routerHistory.push(ROUTES.ANNOUNCEMENTS_PENDING);

            }else{
                this.setState({errorDay:true})
                alertify.error('incorrect day value')
            }
            // this.setState({isApprove:true})
        }


    };
    private fetchData = async () => {
        this.setState({loading:true}, async ()=>{
            const result = await SettingController.GetSettings();
            if(result.success){
                if(result.data){
                    result.data.map((item)=>{
                        if(item.key==='approveAnnouncementDefaultDay'){
                            this.setState({
                                defaultDay: item.value,
                                day:item.value,
                                loading:false
                            })
                        }
                    })
                }


            }
        })

    };
    private  changeApprove = (e: any)=>{
        if(e.target.value==='Custom'){
            this.setState({isDefault:false})
        }else{
            this.setState({isDefault:true, day:this.state.defaultDay})
        }
    };



    public render() {

        const {onClose} = this.props;
        const {submitLoading, loading} = this.state;

        return (
            !loading?
            <Modal className="B-approved-modal" onClose={onClose}>
                <div className="B-rejection-container">
                    <div className="B-rejection-title">
                        <h3>Set announcement active day count</h3>
                    </div>
                    <div className='B-approve-block-modal'>
                        <div className="B-rejected-checkblock">
                            <div className={`B-reject-checkbox `}>
                                <label>
                                    <input type="radio"
                                           name='approve'
                                           checked={this.state.isDefault}
                                           value='Default'
                                           onChange={this.changeApprove}
                                          />
                                    <span/>
                                    <p>Default</p>
                                </label>
                            </div>
                        </div>
                        <div className="B-rejected-checkblock">
                            <div className="B-reject-checkbox">
                                <label>
                                    <input type="radio"
                                           name='approve'
                                           value='Custom'
                                           onChange={this.changeApprove}
                                    />
                                    <span/>
                                    <p>Custom</p>
                                </label>
                            </div>
                        </div>
                    </div>


                    <div className={`B-reject-text `}>
                        <label>
                            <input className={`${this.state.errorDay? 'B-error' :''}`}
                                disabled={this.state.isDefault}
                                onChange={this.change}
                                value={this.state.day}
                                   autoComplete='off'

                                   placeholder='Write comment...'/>
                        </label>
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
                    >Confirm</LoaderContent>
                </div>
            </Modal> : null
        );
    }
}

export default ApproveModal;
