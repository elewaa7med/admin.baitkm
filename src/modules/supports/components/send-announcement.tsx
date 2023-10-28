import * as React from 'react';
import 'react-image-lightbox/style.css';
import { Link } from 'react-router-dom';
import ROUTES from "../../../platform/constants/routes";
import {IUserApproved} from "../../../platform/api/announcement";
import {
    AnnouncementEstateTypeEnum, AnnouncementRentType,
    AnnouncementTypeEnum
} from "../../../platform/constants/interfaces";

interface IProps {
    dataAnnouncement?: IUserApproved;
}
class SendAnnouncement extends React.Component<IProps> {

    public render() {
        const {dataAnnouncement} = this.props;
        return (
            dataAnnouncement &&
            <Link to={ ROUTES.ANNOUNCEMENT_DETAILS_APPROVED.replace(':id', dataAnnouncement.id.toString())}>
                <div className="B-sent-announcement">
                    <div className="B-sent-announcement-img" style={{ backgroundImage: 'url(' + dataAnnouncement.photo.photo || dataAnnouncement.photo.photoBlur  + ')' }} />
                    <div className="B-sent-announcement-info">
                        <p> {AnnouncementEstateTypeEnum[dataAnnouncement.announcementEstateType]} for {AnnouncementTypeEnum[dataAnnouncement.announcementType]}</p>
                        <h2> {dataAnnouncement.price} <span>SAR{dataAnnouncement.announcementType === AnnouncementTypeEnum.Rent ? `/${(AnnouncementRentType)[dataAnnouncement.announcementRentType]}` : ''}</span></h2>
                        {dataAnnouncement.address? <h3 > <span className="icon-location" /> {dataAnnouncement.address}</h3> : null}

                    </div>
                </div>
            </Link>
        )
    }
}

export default SendAnnouncement;
