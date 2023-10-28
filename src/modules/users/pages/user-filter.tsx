import * as React from 'react';
import Select from 'react-select';


// import {
//     AnnouncementStatusEnum,
//     IAddSaveFilterRequestModel
// } from "../../../platform/constants/interfaces";
import {IFilterUserList, UserStatusTypeEnum} from "../../../platform/api/user";


interface IState {
    openRentType: boolean,
    startDate: any,
    endDate: any,
    isPendingPage: boolean,
}

interface IProps {
    form: IFilterUserList;

    onChange(form: IFilterUserList): void;

}


class UserFilter extends React.Component<IProps, IState> {

    private optionAnnouncementStatusType = [
        {value: 0, label: 'Active'},
        {value: 1, label: 'Inactive'},
        {value: 2, label: 'Deleted'},
    ];

    public state: IState = {
        openRentType: false,
        startDate: null,
        endDate: null,
        isPendingPage: false,
    };

    public async componentDidMount() {
        // window.routerHistory.listen(this.routerHandler);
    }

    private changeAnnouncementStatusType = (option: { value: number, label: string } | null) => {
        const {form, onChange} = this.props;
        if (option) {
            if (option.value === 0) {
                form.userStatusType = UserStatusTypeEnum.Active;
            }
            if (option.value === 1) {
                form.userStatusType = UserStatusTypeEnum.Inactive;
            }
            if (option.value === 2) {
                form.userStatusType = UserStatusTypeEnum.Deleted;
            }
        } else {
            form.userStatusType = null;
        }
        onChange(form);
    };


    private changeAnnouncementCount = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const {form, onChange} = this.props;
        form.announcementCount = e.currentTarget.value? +e.currentTarget.value : '';
        onChange(form);
    };
    private changeUserName = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const {form, onChange} = this.props;
        form.fullName = e.currentTarget.value;
        onChange(form);
    };
    private changePhone = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const {form, onChange} = this.props;
        form.phone = e.currentTarget.value;
        onChange(form);
    };
    private changeEmail = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const {form, onChange} = this.props;
        form.email = e.currentTarget.value;
        onChange(form);
    };
    private changeCity = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const {form, onChange} = this.props;
        form.city = e.currentTarget.value;
        onChange(form);
    };

    public render() {
        const {form} = this.props;
        return (
            <div className={`B-announcement-filter-block`}>
                <div className='padding-inputs-filter'>
                    <div className='B-announcement-input-block'>
                        <label>
                            <p>Announcement count</p>
                            <input type="text"
                                   name='announcementCount'
                                   placeholder='Type count'
                                   autoComplete='off'
                                   onChange={this.changeAnnouncementCount}
                                   value={form.announcementCount}
                            />
                        </label>
                    </div>
                </div>
                <div className='padding-inputs-filter'>
                    <div className='B-announcement-input-block'>
                        <label>
                            <p>User name</p>
                            <input type="text"
                                   name='fullName'
                                   placeholder='Type name'
                                   autoComplete='off'
                                    value={form.fullName}
                                   onChange={this.changeUserName}
                            />
                        </label>
                    </div>
                </div>
                <div className='padding-inputs-filter'>
                    <div className='B-announcement-input-block'>
                        <label>
                            <p>Phone</p>
                            <input type="text"
                                   name='phone'
                                   placeholder='Enter phone number'
                                   onChange={this.changePhone}
                                   autoComplete='off'
                                   value={form.phone}

                            />
                        </label>
                    </div>
                </div>
                <div className='padding-inputs-filter'>
                    <div className='B-announcement-input-block'>
                        <label>
                            <p>Email</p>
                            <input type="text"
                                   name='email'
                                   placeholder='Type email'
                                   onChange={this.changeEmail}
                                   autoComplete='off'
                                   value={form.email}

                            />
                        </label>
                    </div>
                </div>
                <div className='padding-inputs-filter'>
                    <div className='B-announcement-input-block'>
                        <label>
                            <p>City</p>
                            <input type="text"
                                   name='city'
                                   placeholder='Type city'
                                   onChange={this.changeCity}
                                   autoComplete='off'
                                   value={form.city}

                            />
                        </label>
                    </div>
                </div>
                <div className='padding-inputs-filter'>
                    <div className='B-announcement-input-block'>
                        <label>
                            <p>User Status Type</p>
                            <Select
                                className="basic-single"
                                placeholder="Select type"
                                placeholderOpacity={true}
                                options={this.optionAnnouncementStatusType}
                                isClearable={true}
                                isSearchable={false}
                                onChange={this.changeAnnouncementStatusType}
                            />
                        </label>
                    </div>
                </div>
            </div>
        )
    }
}

export default UserFilter;
