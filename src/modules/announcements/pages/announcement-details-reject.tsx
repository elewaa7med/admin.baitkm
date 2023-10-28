import * as React from 'react';
import Slider from "react-slick";
import ROUTES from "../../../platform/constants/routes";
import { byPrivateRoute } from "../../../platform/decorators/routes";
import SliderDetailsAnnouncement from '../components/announcement-details-slider';
import { Link } from 'react-router-dom';
import LocationImg from '../../../assets/images/location_icon.png'
import {
    AnnouncementCommercialTypeEnum, AnnouncementCommercialTypeEnumArabic,
    AnnouncementLandTypeEnum, AnnouncementLandTypeEnumArabic,
    BuildingAgeEnum, ConstructionStatusEnum, FacadeTypeEnum, FurnishedStatusEnum,
    // AnnouncementRejectStatus,
    IAnnouncementRejectInfosEnum,
    IGetAnnouncementDetails, landCategoryEnum, OwnershipEnum, SaleTypeEnum
} from '../../../platform/api/announcement'
import AnnouncementController from '../../../platform/api/announcement';
import generic from '../../../platform/decorators/generic';
import { withRouter, RouteComponentProps } from "react-router";
import PageLoader from 'src/components/page-loader';
import NoProfilePicture from "../../../assets/images/no_profile_picture.png";
import alertify from 'alertifyjs';
import {


    AnnouncementTypeEnum,

    AnnouncementRentTypeViewShort,
    AnnouncementFeaturesTypeEnum,
    AnnouncementEstateTypeEnum,
    AnnouncementRentType,
    AnnouncementResidentialTypeEnum, AnnouncementResidentialTypeEnumArabian,

} from 'src/platform/constants/interfaces';
import * as moment from "moment";
import {
    AnnouncementCLandDropdown,
    AnnouncementCommercialDropdown,
    AnnouncementResidentialDropdown
} from "../../../platform/constants/dropdowns";
// import RejectionModal from 'src/components/rejection-modal';




interface IState {

    data: IGetAnnouncementDetails | null,
    desabled: boolean;
    DescriptionTitleEng: string,
    DescriptionTextEng: string,
    DescriptionTitleAr: string,
    DescriptionAr: string,
    DescriptionTitle: string,
    DescriptionText: string,
    openEdit: boolean;
    EnglishActive: boolean,
    ArabActive: boolean,
    ErrorDescription: boolean,
    IsApproved: boolean,
    currentId: number,
    livesModalOpen: boolean,
    openFavourite: boolean,
    favouriteVal: string,
    priceString: string;
    rejectionArray: IAnnouncementRejectInfosEnum[] | null,
    isOpenRejection: boolean,
};


interface IRouteParams { id: string; };



@generic<IRouteParams>(withRouter)
@byPrivateRoute(ROUTES.ANNOUNCEMENT_DETAILS_FEATURED)
@byPrivateRoute(ROUTES.ANNOUNCEMENT_DETAILS_REJECTED)
@byPrivateRoute(ROUTES.ANNOUNCEMENT_DETAILS_EXPIRED)
@byPrivateRoute(ROUTES.ANNOUNCEMENT_DETAILS_DETAILS)

class AnnouncementDetailsReject extends React.Component<RouteComponentProps<IRouteParams>, {}> {

    public state: IState = {
        data: null,
        desabled: false,
        DescriptionTitleEng: '',
        DescriptionTextEng: '',
        DescriptionTitleAr: '',
        DescriptionAr: '',
        DescriptionTitle: '',
        DescriptionText: '',
        openEdit: false,
        EnglishActive: true,
        ArabActive: false,
        ErrorDescription: false,
        IsApproved: false,
        livesModalOpen: false,
        openFavourite: true,
        favouriteVal: '',
        priceString: '',
        rejectionArray: null,
        isOpenRejection: false,
        currentId: 0
    }

    private createPrice = (price: string) => {

        return Number(price).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    private fetchData = async (id: string) => {

        const result = await AnnouncementController.GetAnnouncementDetails(id);
        if (result.success) {
            const TitleEng = result.data.title ? result.data.title : ''
            const TextEng = result.data.description ? result.data.description : ''
            const Ar = result.data.descriptionArabian ? result.data.descriptionArabian : ''
            const TitleAr = result.data.titleArabian ? result.data.titleArabian : ''
            const Title = result.data.title ? result.data.title : ''
            const Text = result.data.description ? result.data.description : ''
            this.setState({
                priceString: this.createPrice(result.data.price.toString())
            })
            this.setState({
                data: result.data,
                DescriptionTitleEng: TitleEng,
                DescriptionTextEng: TextEng,
                DescriptionAr: Ar,
                DescriptionTitleAr: TitleAr,
                DescriptionTitle: Title,
                DescriptionText: Text,
                currentId : id
            });
            if (result.data.announcementRejectInfos.length > 2) {
                this.state.rejectionArray = [];
                this.state.rejectionArray.push(result.data.announcementRejectInfos[0]);
                this.state.rejectionArray.push(result.data.announcementRejectInfos[1]);

            }
            if (!this.state.DescriptionTitleEng &&
                !this.state.DescriptionTextEng &&
                !this.state.DescriptionTitleAr &&
                !this.state.DescriptionAr) {
                this.setState({
                    IsApproved: true,
                })
            } else {
                this.setState({
                    IsApproved: false,
                })
            }
        }
    }

    private toogleOpenRejection = () => {
        this.setState({
            isOpenRejection: !this.state.isOpenRejection
        })
    }
    private EnglishActiveChange = () => {
        if (!this.state.EnglishActive) {
            this.setState({
                ArabActive: !this.state.ArabActive,
                EnglishActive: !this.state.EnglishActive,
            });
        }
        if (!this.state.DescriptionTitleEng) {
            if (this.state.data) {
                if (this.state.data.announcementEstateType === AnnouncementEstateTypeEnum.Residential) {
                    this.setState({ DescriptionTitle: AnnouncementResidentialDropdown()[this.state.data.announcementResidentialType].name })
                }
                if (this.state.data.announcementEstateType === AnnouncementEstateTypeEnum.Commercial) {
                    this.setState({ DescriptionTitle: AnnouncementCommercialDropdown()[this.state.data.commercialType].name })
                }
                if (this.state.data.announcementEstateType === AnnouncementEstateTypeEnum.Land) {
                    this.setState({ DescriptionTitle: AnnouncementCLandDropdown()[this.state.data.landType].name })
                }
            }

        }
        this.setState({
            DescriptionText: this.state.DescriptionTextEng || "",
        });

    };
    private ArabActiveChange = () => {
        if (!this.state.ArabActive) {
            this.setState({
                ArabActive: !this.state.ArabActive,
                EnglishActive: !this.state.EnglishActive,
            });
        }
        if (!this.state.DescriptionTitleEng) {
            if (this.state.data) {
                if (this.state.data.announcementEstateType === AnnouncementEstateTypeEnum.Residential) {
                    this.setState({ DescriptionTitle: AnnouncementResidentialTypeEnumArabian[this.state.data.announcementResidentialType] })
                }
                if (this.state.data.announcementEstateType === AnnouncementEstateTypeEnum.Commercial) {
                    this.setState({ DescriptionTitle: AnnouncementCommercialTypeEnumArabic[this.state.data.commercialType] })
                }
                if (this.state.data.announcementEstateType === AnnouncementEstateTypeEnum.Land) {
                    this.setState({ DescriptionTitle: AnnouncementLandTypeEnumArabic[this.state.data.landType] })
                }
            }

        }
        this.setState({
            // DescriptionTitle: this.state.DescriptionTitleAr || "",
            DescriptionText: this.state.DescriptionAr || "",
        });
    }


    private RemoveFavourite = async () => {
        const crtId = Number(this.state.currentId);

        const result = await AnnouncementController.RemoveFavorite(crtId);
        if (result.success) {
            alertify.success('This announcement was successfully Removed From featured list');
            this.setState({
                openFavourite: true
            })
            const { id } = this.props.match.params;
            this.fetchData(id);
        }
    }

    private change = (e: any) => {
        if (this.state.EnglishActive) {
            if (e.target.name === 'DescriptionTitle') {
                this.setState({
                    DescriptionTitle: e.target.value,
                    DescriptionTitleEng: e.target.value,
                })
            }
            if (e.target.name === 'DescriptionText') {
                this.setState({
                    DescriptionText: e.target.value,
                    DescriptionTextEng: e.target.value,
                })
            }

        } else {
            if (e.target.name === 'DescriptionTitle') {
                this.setState({
                    DescriptionTitle: e.target.value,
                    DescriptionTitleAr: e.target.value
                })
            }
            if (e.target.name === 'DescriptionText') {
                this.setState({
                    DescriptionText: e.target.value,
                    DescriptionAr: e.target.value,
                })
            }
        }
    }




    public componentDidMount() {

        const { id } = this.props.match.params;
        this.fetchData(id);

    }






    // private closeLivesModal = () => this.setState({ livesModalOpen: false });


    private getEstateType = (type: AnnouncementEstateTypeEnum, productType: IGetAnnouncementDetails) => {
        let stringType: any = ''
        switch (type) {
            case AnnouncementEstateTypeEnum.Residential: {
                stringType = AnnouncementResidentialTypeEnum[productType.announcementRentType];
                break
            }
            case AnnouncementEstateTypeEnum.Land: {
                stringType = AnnouncementLandTypeEnum[productType.landType];
                break

            }
            case AnnouncementEstateTypeEnum.Commercial:
                stringType = AnnouncementCommercialTypeEnum[productType.commercialType]
                break
        }
        return stringType
    }



    public render() {

        const settingsSlider = {
            autoplay: false,
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
        };


        const { data,
            openEdit,
            DescriptionTitle: DescriptionTitle,
            DescriptionText: DescriptionText,
            EnglishActive,
            ArabActive,
            // livesModalOpen,
        } = this.state;
        return data ? (


            <div className='B-announcement-details-block'>
                <div className="B-details-back" onClick={() => window.routerHistory.goBack()}>
                    <i className='icon-cancel' />
                    <h3>Announcement detail</h3>
                </div>
                <div className='B-announcement-details-container'>
                    <div className={`B-announcement-details-slider ${data.photos.length + 1 > 4 ? '' : 'B-d-flex-slider'}`}>
                        {
                            data.photos.length + 1 > 4 ?
                                <Slider {...settingsSlider}>
                                    <SliderDetailsAnnouncement sliderImg={data.photo.photo} />

                                    {data.photos.map((item, index) => {
                                        return <SliderDetailsAnnouncement key={index} thumbNail={item.thumbNail ? item.thumbNail : null} sliderImg={item.photo || item.photoBlur} />
                                    })}
                                </Slider> :

                                <>
                                    <SliderDetailsAnnouncement sliderImg={data.photo.photo} />

                                    {data.photos.map((item, index) => {
                                        return <SliderDetailsAnnouncement key={index} sliderImg={item.photo || item.photoBlur} thumbNail={item.thumbNail ? item.thumbNail : null} />
                                    })}
                                </>

                        }

                    </div>
                    <div className='B-announcement-details-information'>
                        <div className='B-announcement-details-info-components'>
                            <div className='B-announcement-details-info-title'>
                                <h3>User</h3>
                            </div>
                            <div className='B-announcement-details-info-box'>
                                <div className='B-announcement-details-user'>
                                    <div className='B-announcement-details-user-img' style={{ backgroundImage: `url("${data.userProfilePhoto ? (data.userProfilePhoto.photo || data.userProfilePhoto.photoBlur) : NoProfilePicture}")` }} />
                                    <div className='B-announcement-details-about'>
                                        <h3>{data.userName || '-'}</h3>
                                        <div className='B-announcement-details-all-list'>
                                            <p><span>{data.userAnnouncementCount}</span> announcements</p>
                                            <Link to={ROUTES.USER_DETAILS.replace(':id', data.userId.toString())}>View all</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='B-announcement-details-info-components'>

                            <div className='B-announcement-details-info-title'>
                                <h3>Description</h3>
                            </div>
                            <div className='B-announcement-details-info-box' >
                                {
                                    <div className={`B-description-block  ${ArabActive ? 'arab-style' : ""} ${this.state.ErrorDescription ? 'Errordic' : ''}`}>


                                        <div className='B-description-change-lang'>
                                            <ul>
                                                <li className={
                                                    `${EnglishActive ? "active-description-language" : ""}`}
                                                    onClick={this.EnglishActiveChange}>Eng
                                                </li>
                                                <li className={
                                                    `${!ArabActive ? "" : 'active-description-language'}`}
                                                    onClick={this.ArabActiveChange} >Ar
                                                </li>
                                            </ul>
                                        </div>
                                        <div className={`B-description-title ${openEdit ? 'openEditClass' : ""}`}>
                                            <h3>{this.state.DescriptionTitle}</h3>
                                            <textarea
                                                name='DescriptionTitle'
                                                value={DescriptionTitle}
                                                onChange={this.change}
                                            />
                                            {data.isTop ? <span className='icon-dashboard ' onClick={this.RemoveFavourite} /> : <span className='icon-edit' />}

                                        </div>
                                        <div className={`B-description-text ${openEdit ? 'openEditClass' : ""} `}>
                                            <p>{this.state.DescriptionText}</p>

                                            <textarea
                                                name='DescriptionText'
                                                value={DescriptionText}
                                                onChange={this.change}
                                            />

                                        </div>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className='B-announcement-details-info-components'>
                            <div className='B-announcement-details-info-title'>
                                <h3>Location</h3>
                            </div>
                            <div className='B-announcement-details-info-box'>
                                <div className='B-location-text'>
                                    <span style={{ backgroundImage: 'url(' + LocationImg + ')' }} />
                                    <p>{data.address ? data.address + ', ' : null}{data.country ? data.country + ', ' : null} {data.city ? data.city + ', ' : null}</p>
                                </div>
                            </div>
                        </div>

                        {
                            data.price ?
                                <div className='B-announcement-details-info-components'>
                                    <div className='B-announcement-details-info-title'>
                                        <h3>Price</h3>
                                    </div>
                                    <div className='B-announcement-details-info-box'>
                                        <div className='B-announcement-price'>
                                            <span> {this.state.priceString} </span>
                                            {data.announcementType && data.announcementType === AnnouncementTypeEnum.Rent ?
                                                <p>{'SAR /' + AnnouncementRentTypeViewShort[data.announcementRentType]}</p> :
                                                <p>SAR</p>}
                                        </div>
                                    </div>
                                </div> : ''
                        }
                        <div className='B-announcement-details-info-components'>
                            <div className='B-announcement-details-info-title'>
                                <h3>Details</h3>
                            </div>
                            <div className='B-announcement-details-info-box'>
                                {data.id ?
                                    <div className='B-announcement-details-sub-block'>
                                        <div className='B-announcement-details-sub-box'>
                                            <p>Referral code:</p>
                                        </div>
                                        <div className='B-announcement-details-sub-box'>
                                            <p>{data.id}</p>
                                        </div>
                                    </div> : ''
                                }
                                {
                                    data.announcementType !== null ?
                                        <div className='B-announcement-details-sub-block'>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>Announcement type:</p>
                                            </div>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>{data.announcementType === AnnouncementTypeEnum.Rent ? AnnouncementRentType[data.announcementRentType] : AnnouncementTypeEnum[data.announcementType]}</p>
                                                {data.announcementType === AnnouncementTypeEnum.Rent && data.isOtherPeriod ?
                                                    <span className="B-mini-text">other options are available by request</span> : null}
                                            </div>
                                        </div> : ''
                                }
                                {
                                    data.saleType !== null ?
                                        <div className='B-announcement-details-sub-block'>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>Sale type:</p>
                                            </div>
                                            <div className='B-announcement-details-sub-box'>
                                                <p> {SaleTypeEnum[data.saleType]}</p>
                                            </div>
                                        </div> : ''
                                }
                                {
                                    data.buildingAge !== null ?
                                        <div className='B-announcement-details-sub-block'>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>Building age:</p>
                                            </div>
                                            <div className='B-announcement-details-sub-box'>
                                                <p> {BuildingAgeEnum[data.buildingAge]}</p>
                                            </div>
                                        </div> : ''
                                }
                                {
                                    data.constructionStatus !== null ?
                                        <div className='B-announcement-details-sub-block'>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>Construction status:</p>
                                            </div>
                                            <div className='B-announcement-details-sub-box'>
                                                <p> {ConstructionStatusEnum[data.constructionStatus]}</p>
                                            </div>
                                        </div> : ''
                                }
                                {
                                    data.ownerShip !== null ?
                                        <div className='B-announcement-details-sub-block'>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>Type of ownership:</p>
                                            </div>
                                            <div className='B-announcement-details-sub-box'>
                                                <p> {OwnershipEnum[data.ownerShip]}</p>
                                            </div>
                                        </div> : ''
                                }
                                {
                                    data.furnishingStatus !== null ?
                                        <div className='B-announcement-details-sub-block'>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>Furnished status:</p>
                                            </div>
                                            <div className='B-announcement-details-sub-box'>
                                                <p> {FurnishedStatusEnum[data.furnishingStatus]}</p>
                                            </div>
                                        </div> : ''
                                }
                                {
                                    data.floor !== 0 ?
                                        <div className='B-announcement-details-sub-block'>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>Floor:</p>
                                            </div>
                                            <div className='B-announcement-details-sub-box'>
                                                <p> {data.floor}</p>
                                            </div>
                                        </div> : ''
                                }

                                {/*---------------------------------------------*/}


                                {
                                    data.numberOfAppartment && data.numberOfAppartment !== 0 ?
                                        <div className='B-announcement-details-sub-block'>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>Number of apartments:</p>
                                            </div>
                                            <div className='B-announcement-details-sub-box'>
                                                <p> {data.numberOfAppartment}</p>
                                            </div>
                                        </div> : null
                                }
                                {
                                    data.numberOfShop && data.numberOfShop !== 0 ?
                                        <div className='B-announcement-details-sub-block'>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>Number of shops:</p>
                                            </div>
                                            <div className='B-announcement-details-sub-box'>
                                                <p> {data.numberOfShop}</p>
                                            </div>
                                        </div> : null
                                }
                                {
                                    data.numberOfUnits && data.numberOfUnits !== 0 ?
                                        <div className='B-announcement-details-sub-block'>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>Number of units:</p>
                                            </div>
                                            <div className='B-announcement-details-sub-box'>
                                                <p> {data.numberOfUnits}</p>
                                            </div>
                                        </div> : null
                                }
                                {
                                    data.numberOfVilla && data.numberOfVilla !== 0 ?
                                        <div className='B-announcement-details-sub-block'>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>Number of villas:</p>
                                            </div>
                                            <div className='B-announcement-details-sub-box'>
                                                <p> {data.numberOfVilla}</p>
                                            </div>
                                        </div> : null
                                }
                                {
                                    data.numberOfFloors && data.numberOfFloors !== 0 ?
                                        <div className='B-announcement-details-sub-block'>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>Number of floors:</p>
                                            </div>
                                            <div className='B-announcement-details-sub-box'>
                                                <p> {data.numberOfFloors}</p>
                                            </div>
                                        </div> : null
                                }
                                {
                                    data.numberOfWareHouse && data.numberOfWareHouse !== 0 ?
                                        <div className='B-announcement-details-sub-block'>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>Number of warehouse:</p>
                                            </div>
                                            <div className='B-announcement-details-sub-box'>
                                                <p> {data.numberOfWareHouse}</p>
                                            </div>
                                        </div> : null
                                }
                                {
                                    data.facadeType ?
                                        <div className='B-announcement-details-sub-block'>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>Facade type:</p>
                                            </div>
                                            <div className='B-announcement-details-sub-box'>
                                                <p> {FacadeTypeEnum[data.facadeType]}</p>
                                            </div>
                                        </div> : null
                                }
                                {
                                    data.landNumber && data.landNumber !== 0 ?
                                        <div className='B-announcement-details-sub-block'>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>Land number:</p>
                                            </div>
                                            <div className='B-announcement-details-sub-box'>
                                                <p> {data.landNumber}</p>
                                            </div>
                                        </div> : null
                                }
                                {
                                    data.planNumber && data.planNumber !== 0 ?
                                        <div className='B-announcement-details-sub-block'>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>Plan number:</p>
                                            </div>
                                            <div className='B-announcement-details-sub-box'>
                                                <p> {data.planNumber}</p>
                                            </div>
                                        </div> : null
                                }

                                {
                                    data.district && data.district !== 0 ?
                                        <div className='B-announcement-details-sub-block'>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>District number:</p>
                                            </div>
                                            <div className='B-announcement-details-sub-box'>
                                                <p> {data.district}</p>
                                            </div>
                                        </div> : null
                                }
                                {
                                    data.fireSystem ?
                                        <div className='B-announcement-details-sub-block'>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>Fire system:</p>
                                            </div>
                                            <div className='B-announcement-details-sub-box'>
                                                <p> Yes</p>
                                            </div>
                                        </div> : null
                                }
                                {
                                    data.officeSpace ?
                                        <div className='B-announcement-details-sub-block'>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>Office space:</p>
                                            </div>
                                            <div className='B-announcement-details-sub-box'>
                                                <p> Yes</p>
                                            </div>
                                        </div> : null
                                }
                                {
                                    data.laborResidence ?
                                        <div className='B-announcement-details-sub-block'>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>Labor residence:</p>
                                            </div>
                                            <div className='B-announcement-details-sub-box'>
                                                <p> Yes</p>
                                            </div>
                                        </div> : null
                                }

                                {
                                    data.landCategory || data.landCategory === 0 ?
                                        <div className='B-announcement-details-sub-block'>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>Land category:</p>
                                            </div>
                                            <div className='B-announcement-details-sub-box'>
                                                <p> {landCategoryEnum[data.landCategory]}</p>
                                            </div>
                                        </div> : null
                                }
                                {/*---------------------------------------------*/}
                                {
                                    data.sittingArea ?
                                        <div className='B-announcement-details-sub-block'>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>Sitting area:</p>
                                            </div>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>{data.sittingArea} m <sup>2</sup></p>
                                            </div>
                                        </div> : ''
                                }
                                {
                                    data.announcementEstateType !== null ?
                                        <div className='B-announcement-details-sub-block'>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>Property type:</p>
                                            </div>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>  {AnnouncementEstateTypeEnum[data.announcementEstateType] + ' , ' + this.getEstateType(data.announcementEstateType, data)}</p>

                                            </div>
                                        </div> : ''
                                }
                                {
                                    data.area ?
                                        <div className='B-announcement-details-sub-block'>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>Area:</p>
                                            </div>
                                            <div className='B-announcement-details-sub-box'>
                                                <p><span>{data.area}</span> m <sup>2</sup></p>
                                            </div>
                                        </div> : ''
                                }
                                {
                                    data.bedroomCount ?
                                        <div className='B-announcement-details-sub-block'>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>Bedrooms:</p>
                                            </div>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>{data.bedroomCount}</p>
                                            </div>
                                        </div> : ''
                                }
                                {
                                    data.bathroomCount ?
                                        <div className='B-announcement-details-sub-block'>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>Bathrooms:</p>
                                            </div>
                                            <div className='B-announcement-details-sub-box'>
                                                <p>{data.bathroomCount}</p>
                                            </div>
                                        </div> : ''
                                }

                            </div>
                        </div>
                        {
                            data.features.length !== 0 ?
                                <div className='B-announcement-details-info-components'>
                                    <div className='B-announcement-details-info-title'>
                                        <h3>Features</h3>
                                    </div>
                                    <div className='B-announcement-details-info-box'>
                                        <div className='B-announcement-details-features'>
                                            <ul>
                                                {data && data.features.map((item, index) => (
                                                    <li key={index}>{AnnouncementFeaturesTypeEnum[item]}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div> : null
                        }
                        {
                            data.documents.length !== 0 ?
                                <div className='B-announcement-details-info-components'>
                                    <div className='B-announcement-details-info-title'>
                                        <h3>Other documentations</h3>
                                    </div>
                                    <div className='B-announcement-details-info-box'>
                                        <div className='B-announcement-details-documentations'>
                                            {data.documents.map((item, index) => {
                                                return <div key={index} className='B-documentations-padding'>
                                                    <a href={item.document} download={item.document}>
                                                        <div className='B-documentations-img'
                                                            style={{
                                                                backgroundImage: 'url(' + item.documentImage + ')'
                                                            }} />
                                                    </a>
                                                </div>
                                            })}
                                        </div>
                                    </div>
                                </div> : null
                        }
                        {data.announcementRejectInfos.length ? <div className='B-announcement-details-info-components'>
                            <div className='B-announcement-details-info-title'>
                                <h3>History</h3>
                            </div>

                            <div className='B-announcement-details-info-box'>
                                <div className="reject-history-block">
                                    {!this.state.isOpenRejection ?
                                        <>
                                            {data.announcementRejectInfos.length > 2 && this.state.rejectionArray ? this.state.rejectionArray.map((item, index) => {
                                                return <div key={index} className='reject-history-component'>
                                                    <p className='reject-history-date'>{moment(item.announcementRejectDate).format('DD MMM YYYY').valueOf()}</p>
                                                    <p className='reject-history-description'>{item.announcementRejectReason}</p>
                                                </div>
                                            }) : <>
                                                {data.announcementRejectInfos.map((item, index) => {
                                                    return <div key={index} className='reject-history-component'>
                                                        <p className='reject-history-date'>{moment(item.announcementRejectDate).format('DD MMM YYYY').valueOf()}</p>
                                                        <p className='reject-history-description'>{item.announcementRejectReason}</p>

                                                    </div>
                                                })}
                                            </>}</> :
                                        <>
                                            {data.announcementRejectInfos.map((item, index) => {
                                                return <div key={index} className='reject-history-component'>
                                                    <p className='reject-history-date'>{moment(item.announcementRejectDate).format('DD MMM YYYY').valueOf()}</p>
                                                    <p className='reject-history-description'>{item.announcementRejectReason}</p>
                                                </div>
                                            })}
                                        </>
                                    }
                                </div>
                                {data.announcementRejectInfos.length > 2 ?
                                    <p className="reject-history-view" onClick={this.toogleOpenRejection}>{!this.state.isOpenRejection ? 'view all' : 'view less'} </p> : null}
                            </div>
                        </div> : null}


                    </div>
                </div>

                {/*{livesModalOpen && <RejectionModal dataId={data.id} onClose={this.closeLivesModal} />}*/}

            </div>
        ) : <PageLoader />;
    }
}

export default AnnouncementDetailsReject;
