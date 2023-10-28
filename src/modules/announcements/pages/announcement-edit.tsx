import * as React from 'react';
import ROUTES from "../../../platform/constants/routes";
import {byPrivateRoute} from "../../../platform/decorators/routes";
import generic from '../../../platform/decorators/generic';
import {RouteComponentProps, withRouter} from "react-router";
import CurrencyInput from 'react-currency-input-field';
import AnnouncementController, {
  AnnouncementCommercialTypeEnum,
  AnnouncementLandTypeEnum,
  BuildingAgeEnum,
  ConstructionStatusEnum,
  FacadeTypeEnum,
  FurnishedStatusEnum, landCategoryEnum,
  OwnershipEnum,
  // SaleTypeEnum
} from "../../../platform/api/announcement";
import Autocomplete from "react-google-autocomplete";
import {
  AnnouncementEstateTypeEnum,
  AnnouncementFeaturesTypeEnum,
  AnnouncementRentType,
  AnnouncementRentTypeViewShort,
  AnnouncementResidentialTypeEnum,
  AnnouncementTypeEnum,
  IAnnouncementDetailsModel,
  IAnnouncementModifyRequestModel,
  IAnnouncementUploadsData,
  IDropdownOption,
  IFeatureListFilter,
  IPhotoProduct,
  IResponse
} from "../../../platform/constants/interfaces";
import Slider from "react-slick";
import SliderDetailsAnnouncement from "../components/announcement-details-slider";
import PageLoader from "../../../components/page-loader";
import NoProfilePicture from "../../../assets/images/no_profile_picture.png";
import MultiSelect from "../../../components/multi-select";
import {
  AnnouncementBuildingAgeDropdown,
  AnnouncementCLandDropdown,
  AnnouncementCommercialDropdown,
  AnnouncementConstructionStatusDropdown,
  AnnouncementEstateTypeDropdown,
  AnnouncementFacadeDropdown,
  AnnouncementFeaturesDropdown,
  AnnouncementFurnishedStatusDropdown, AnnouncementLandCategoryDropdown,
  AnnouncementOwnershipDropdown,
  AnnouncementRentTypeDropdown,
  AnnouncementResidentialDropdown,
  // AnnouncementSaleTypeDropdown,
  AnnouncementTypeDropdown
} from "../../../platform/constants/dropdowns";
import pdfIcon from '../../../assets/images/pdf-icon.png'
import CancelModal from '../../../components/cancel-modal'
import RouteService from "../../../platform/services/routes";
import ApproveModal from "../../../components/approve-modal";
import alertify from 'alertifyjs';
import LoaderContent from "../../../components/loader-content";
import Select from "../../../components/select";
import NumberInput from "../../../components/number-input";

// import Select from "react-select";


interface IRouteParams {
  id: string;
}

export enum LanguageEnum {
  English,
  Arabian,
}

export const isValidPhone = (value?: string | null): boolean => {
  if (!value && value !== '') return false;
  const regex = new RegExp('^[0-9]*$');
  return regex.test(value);
};

export interface IGooglePlace {
  geometry: {
    location: {
      lat(): number;
      lng(): number;
    };
  };
}

interface IState {
  details: IAnnouncementDetailsModel | null
  form: IAnnouncementModifyRequestModel | null;
  uploadsData: IAnnouncementUploadsData;
  modifyId: number;
  chosenLanguage: LanguageEnum,
  isOpenCancelModal: boolean,
  isPending: boolean,
  isApproved: boolean,
  isOpenApprovedModal: boolean,
  featureList: any,
  errors: {
    title: boolean,
    description:boolean,
    area: boolean,
    location: boolean,
    price: boolean,
    floor: boolean,
    sittingArea: boolean,
  },
  loading: boolean;
  approveOne: boolean;
  isSelectedFireSystem: boolean,
  isSelectedOfficeSpace: boolean,
  isSelectedLaborResidence: boolean,
  submited:boolean
}

export const googlePlacesTypes = ['geocode', 'establishment'];

@generic<IRouteParams>(withRouter)
@byPrivateRoute(ROUTES.ANNOUNCEMENT_APPROVED_EDIT)
@byPrivateRoute(ROUTES.ANNOUNCEMENT_IN_REVIEW_EDIT)
@byPrivateRoute(ROUTES.ANNOUNCEMENT_PENDING_EDIT)
class AnnouncementEdit extends React.Component<RouteComponentProps<IRouteParams>, IState> {
  private fileForDocument = React.createRef<HTMLInputElement>();
  private fileForImages = React.createRef<HTMLInputElement>();
  private settingsSlider = {
    autoplay: false,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };
  public state: IState = {
    details: null,
    featureList: AnnouncementFeaturesDropdown(),
    form: null,
    uploadsData: {
      basePhoto: '',
      basePhotoFile: null,
      otherImages: [],
      otherImageFiles: [],
      otherDocuments: [],
      otherDocumentsFiles: [],
    },
    modifyId: 0,
    chosenLanguage: LanguageEnum.English,
    isOpenCancelModal: false,
    isPending: false,
    isApproved: false,
    isOpenApprovedModal: false,
    errors: {
      title: false,
      description:false,
      area: false,
      location: false,
      price: false,
      floor: false,
      sittingArea: false
    },
    loading: false,
    approveOne: false,
    isSelectedFireSystem: false,
    isSelectedOfficeSpace: false,
    isSelectedLaborResidence: false,
    submited:false
  };


  public componentDidMount() {
    const {id} = this.props.match.params;
    this.getDetailsAnnouncement(id)

    this.setState({
      isPending: RouteService.isRoute(ROUTES.ANNOUNCEMENT_PENDING_EDIT),
      isApproved: RouteService.isRoute(ROUTES.ANNOUNCEMENT_APPROVED_EDIT)
    });
    window.routerHistory.listen(this.routerHandler);
    const {form} = this.state
    if (form) {
      this.setState({
        isSelectedLaborResidence: form.laborResidence,
        isSelectedOfficeSpace: form.officeSpace,
        isSelectedFireSystem: form.fireSystem
      })
    }
  }


  private step3Validation = (form: IAnnouncementModifyRequestModel) => {


    if (form.announcementType === AnnouncementTypeEnum.Rent && form.announcementResidentialType === AnnouncementResidentialTypeEnum.Compound) {
      delete form.numberOfVilla
      delete form.numberOfAppartment
    }
    if (form.announcementType === AnnouncementTypeEnum.Rent && form.commercialType === AnnouncementCommercialTypeEnum.Showroom) {
      delete form.numberOfShop

    }
    if (form.announcementType === AnnouncementTypeEnum.Rent && form.commercialType === AnnouncementCommercialTypeEnum.WareHouse) {
      delete form.numberOfWareHouse

    }
    let isTowerValidation = true;
    let isValidationConstructionStatus = true;
    let isValidationNumberOfFloors = true;
    let isValidationFloor = true
    let isValidationAppartament = true;
    let isValidationVillas = true;
    let isValidationShop = true;
    let isValidationWhereHouse = true;
    let isValidationNumberOfUnits = true
    let isValidationDistrictNumber = true
    let isValidationLandCategory = true


    if(form.announcementEstateType===AnnouncementEstateTypeEnum.Land){
      isValidationDistrictNumber = !!form.district;

      isValidationLandCategory = !!form.landCategory || form.landCategory===0;

    }else{
      isValidationDistrictNumber =   true
      isValidationLandCategory = true

    }
    if(form.announcementEstateType===AnnouncementEstateTypeEnum.Residential && form.announcementResidentialType===AnnouncementResidentialTypeEnum.Tower){
      isTowerValidation = !!(form.numberOfFloors &&  form.numberOfFloors >= 8);
    }else{
      isTowerValidation = true
    }




    if(form.announcementEstateType===AnnouncementEstateTypeEnum.Residential || form.announcementEstateType===AnnouncementEstateTypeEnum.Commercial){
      isValidationConstructionStatus = !!(form.constructionStatus === 0 || form.constructionStatus);
    }else{
      isValidationConstructionStatus = true
    }



    if(form.announcementEstateType!==AnnouncementEstateTypeEnum.Land && form.announcementResidentialType!==AnnouncementResidentialTypeEnum.Apartments && form.announcementResidentialType !== AnnouncementResidentialTypeEnum.Studio){
      if (form.announcementType === AnnouncementTypeEnum.Rent) {
        if (form.numberOfFloors) {
          isValidationNumberOfFloors = true
        } else {
          isValidationNumberOfFloors = false
        }
      }
    }else{
      isValidationNumberOfFloors = true
    }


    if(form.announcementEstateType===AnnouncementEstateTypeEnum.Residential) {
      if ((form.announcementResidentialType === AnnouncementResidentialTypeEnum.Apartments ||
        form.announcementResidentialType === AnnouncementResidentialTypeEnum.Duplex ||
        form.announcementResidentialType === AnnouncementResidentialTypeEnum.Studio) && !form.floor) {
        isValidationFloor = false
      } else {
        isValidationFloor = true

      }
    }else if(form.announcementEstateType===AnnouncementEstateTypeEnum.Commercial){
      if((form.commercialType===AnnouncementCommercialTypeEnum.OfficeSpace || form.commercialType===AnnouncementCommercialTypeEnum.Shop || form.commercialType===AnnouncementCommercialTypeEnum.WareHouse) && !form.floor){
        isValidationFloor = false
      }else{
        isValidationFloor = true
      }
    }else{
      isValidationFloor = true
    }

    if((form.announcementResidentialType===AnnouncementResidentialTypeEnum.Building  || (form.announcementType===AnnouncementTypeEnum.Sale && form.announcementResidentialType===AnnouncementResidentialTypeEnum.Compound)) && !form.numberOfAppartment){
      isValidationAppartament = false
    }else{
      isValidationAppartament = true
    }

    if( form.announcementResidentialType===AnnouncementResidentialTypeEnum.Tower && !form.numberOfUnits){
      isValidationNumberOfUnits = false
    }else{
      isValidationNumberOfUnits = true
    }


    if(form.announcementResidentialType===AnnouncementResidentialTypeEnum.Compound && form.announcementType===AnnouncementTypeEnum.Sale && !form.numberOfVilla){
      isValidationVillas = false
    }else{
      isValidationVillas = true
    }

    if(form.commercialType===AnnouncementCommercialTypeEnum.Showroom && form.announcementType===AnnouncementTypeEnum.Sale && !form.numberOfShop){
      isValidationShop = false
    }else{
      isValidationShop = true
    }
    if(form.commercialType===AnnouncementCommercialTypeEnum.WareHouse && form.announcementType===AnnouncementTypeEnum.Sale && !form.numberOfWareHouse){
      isValidationWhereHouse = false
    }else{
      isValidationWhereHouse = true
    }





    return ((form.announcementResidentialType === 0 || form.announcementResidentialType) || (form.commercialType || form.commercialType === 0) || (form.landType || form.landType === 0)) && form.area > 0 && form.price > 0
      && isValidationConstructionStatus
      && isTowerValidation
      && isValidationNumberOfFloors
      && isValidationFloor
      && isValidationAppartament
      && isValidationVillas
      && isValidationShop
      && isValidationWhereHouse
      && isValidationNumberOfUnits
      && isValidationDistrictNumber
      && isValidationLandCategory



  }


  public validationDescription = () => {
    const {form} = this.state
    if (form) {
      if (form.description || form.descriptionArabian) {
        return !!(form.description && form.descriptionArabian);
      } else {
        return true
      }
    }
    return true
  }
  public validationTitle = () => {
    const {form} = this.state
    if (form) {
      if (form.title || form.titleArabian) {
        return !!(form.title && form.titleArabian);
      } else {
        return true
      }
    }
    return true
  }

  private checkForSubmit = () => {
    const {form} = this.state;
    let isValid = true;
    let submitedInputs = false

    const errors = {
      title: false,
      description: false,
      area: false,
      location: false,
      price: false,
      floor: false,
      sittingArea: false
    };
    if (form) {


      if (!this.validationDescription()) {
        isValid = false;
        errors.description = true;
      }


      if (!this.validationTitle()) {
        isValid = false;
        errors.title = true;
      }

      // if (!isValidPhone(form.sittingArea)) || !form.sittingArea.toString().trim() || form.sittingArea === 0) {
      //   isValid = false;
      //   errors.sittingArea = true;
      // }
      if(this.step3Validation(form)){
        submitedInputs = true
        this.setState({submited:submitedInputs})
      }
      if (!form.address.trim()) {
        isValid = false;
        errors.location = true;
      }
    }


    this.setState({errors})
    return isValid && submitedInputs;

    // return false
  };


  private clearPropsForm = () => {
    const {form} = this.state
    if(form){
      form.bedroomCount = 0;
      form.bathroomCount = 0;
      // form.sittingCount = 0;
      form.features = [];
      delete form.constructionStatus;
      delete form.ownerShip;
      delete form.buildingAge;
      delete form.furnishingStatus;
      delete form.facadeType;
      delete form.landNumber;
      delete form.planNumber;
      delete form.district;
      delete form.streetWidth;
      delete form.floor;
      delete form.numberOfAppartment;
      delete form.numberOfFloors;
      delete form.numberOfVilla;
      delete form.numberOfShop;
      delete form.fireSystem;
      delete form.numberOfWareHouse;
      delete form.officeSpace;
      delete form.laborResidence;
      delete form.numberOfUnits;
      delete  form.landCategory;
      this.setState({form})
    }


  }
  private routerHandler = (): any => {
    this.setState({
      isPending: RouteService.isRoute(ROUTES.ANNOUNCEMENT_PENDING_EDIT),
      isApproved: RouteService.isRoute(ROUTES.ANNOUNCEMENT_APPROVED_EDIT)

    })
  };


  private changeFeatures = (value: AnnouncementFeaturesTypeEnum[]) => {
    const {form} = this.state;
    if (form) {
      form.features = value;
      this.setState({form, loading: false});


    }

  };


  //  new  functionality  for edit Announcement


  private changeEstateType = (option: IDropdownOption<AnnouncementEstateTypeEnum>) => {
    const {form} = this.state;

    this.clearPropsForm()
    if (form) {

      if (option.value === AnnouncementEstateTypeEnum.Residential) {
        delete form.commercialType
        delete form.landType
      }
      if (option.value === AnnouncementEstateTypeEnum.Commercial) {
        delete form.announcementResidentialType
        delete form.landType
      }

      if (option.value === AnnouncementEstateTypeEnum.Land) {
        delete form.commercialType
        delete form.announcementResidentialType
      }
      if (option) {
        form.announcementEstateType = option.value;

      }

      this.setState({form,loading: false})
    }

  }

  private changeAnnouncementType = (option: IDropdownOption<AnnouncementTypeEnum>) => {
    const {form} = this.state;
    if (form) {
      if (option) form.announcementType = option.value;
      else delete form.announcementType;
      this.setState({form,loading: false})

      delete form.announcementRentType
      delete form.saleType
      this.clearPropsForm()
      delete form.announcementEstateType
    }

  };

  private changeLandCategory = (option: IDropdownOption<landCategoryEnum>) => {
    const {form} = this.state;
    if(form){
      if (option) form.landCategory = option.value;
      this.setState({form,loading: false})
    }


  };

  private changeAnnouncementRentType = (option: IDropdownOption<AnnouncementRentType>) => {
    const {form} = this.state;
    if (form) {
      if (option) form.announcementRentType = option.value;
      else delete form.announcementRentType;
      this.setState({form,loading: false})

    }


  }
  // private changeSaleType = (option: IDropdownOption<SaleTypeEnum>) => {
  //   const {form} = this.state;
  //   if (form) {
  //     if (option) form.saleType = option.value;
  //     else delete form.saleType;
  //     this.setState({form,loading: false})
  //   }

  // }

  private changeResidentialType = (selected: IDropdownOption<AnnouncementResidentialTypeEnum>) => {
    const {form} = this.state;
    if (form) {
      form.announcementResidentialType = selected.value;
      this.createNewAnnouncementFeatureList(form.announcementEstateType, form.announcementResidentialType)


      this.setState({form,loading: false})

    }


  }


  private changeCommercialType = (option: IDropdownOption<AnnouncementCommercialTypeEnum>) => {
    const {form} = this.state;
    if (form) {
      if (option) form.commercialType = option.value;
      // if (option.value === AnnouncementCommercialTypeEnum.Showroom) form.features = []
      this.createNewAnnouncementFeatureList(form.announcementEstateType, form.commercialType)
      this.setState({form,loading: false})
    }
  };
  private changeLandType = (option: IDropdownOption<AnnouncementLandTypeEnum>) => {
    const {form} = this.state;
    if (form) {
      if (option) form.landType = option.value;
      this.setState({form,loading: false})
    }

  };


  private changeBuildingAge = (option: IDropdownOption<BuildingAgeEnum>) => {
    const {form} = this.state;
    if (form) {
      if (option) form.buildingAge = option.value;
      this.setState({form,loading: false})
    }
  }

  private changeConstructionStatus = (option: IDropdownOption<ConstructionStatusEnum>) => {
    const {form} = this.state;
    if (form) {
      if (option) form.constructionStatus = option.value;
      this.setState({form,loading: false})
    }
  }

  private changeOwnership = (option: IDropdownOption<OwnershipEnum>) => {
    const {form} = this.state;
    if (form) {
      if (option) form.ownerShip = option.value;
      this.setState({form,loading: false})
    }

  }

  private changeFurnishedStatus = (option: IDropdownOption<FurnishedStatusEnum>) => {
    const {form} = this.state;
    if (form) {
      if (option) form.furnishingStatus = option.value;
      this.setState({form,loading: false})
    }
  }


  private changeFacadeType = (option: IDropdownOption<FacadeTypeEnum>) => {
    const {form} = this.state;
    if (form) {
      if (option) form.facadeType = option.value;
      this.setState({form,loading: false})

    }

  }

  private changeFireSystem = () => {
    const {form} = this.state;
    if (form) {
      form.fireSystem = !this.state.isSelectedFireSystem
      this.setState({isSelectedFireSystem: !this.state.isSelectedFireSystem})
      this.setState({form,loading: false})


    }

  };
  private changeOfficeSpace = () => {
    const {form} = this.state;
    if (form) {
      form.officeSpace = !this.state.isSelectedOfficeSpace
      this.setState({isSelectedOfficeSpace: !this.state.isSelectedOfficeSpace})
      this.setState({form,loading: false})


    }


  };
  private changeLaborResidence = () => {
    const {form} = this.state;
    if (form) {
      form.laborResidence = !this.state.isSelectedLaborResidence
      this.setState({isSelectedLaborResidence: !this.state.isSelectedLaborResidence})
      this.setState({form,loading: false})


    }


  };

  private createNewAnnouncementFeatureList(estateTypeSelect: any, residentialOrCommercialTypeSelect: any) {
    const newFeatureList: any = []
    let flag = true;
    if ((estateTypeSelect || estateTypeSelect === 0) && (residentialOrCommercialTypeSelect || residentialOrCommercialTypeSelect === 0)) {

      const featureListForFilter: IFeatureListFilter[] = [
        {
          label: AnnouncementFeaturesDropdown()[AnnouncementFeaturesTypeEnum.Parking].name,
          value: AnnouncementFeaturesTypeEnum.Parking,
          estateType: {
            residentialType: [
              AnnouncementResidentialTypeEnum.Building,
              AnnouncementResidentialTypeEnum.Villa,
              AnnouncementResidentialTypeEnum.Chalet,
              AnnouncementResidentialTypeEnum.Tower,
              AnnouncementResidentialTypeEnum.Compound,
              AnnouncementResidentialTypeEnum.FarmHouse
            ],
            commercialType: [
              AnnouncementCommercialTypeEnum.OfficeSpace,
              AnnouncementCommercialTypeEnum.Shop,
              AnnouncementCommercialTypeEnum.Showroom,
              AnnouncementCommercialTypeEnum.WareHouse,

            ]
          }
        },
        {
          label: AnnouncementFeaturesDropdown()[AnnouncementFeaturesTypeEnum.SharedGym].name,
          value: AnnouncementFeaturesTypeEnum.SharedGym,
          estateType: {
            residentialType: [
              AnnouncementResidentialTypeEnum.Building,
              AnnouncementResidentialTypeEnum.Villa,
              AnnouncementResidentialTypeEnum.Chalet,
              AnnouncementResidentialTypeEnum.Tower,
              AnnouncementResidentialTypeEnum.Compound
            ]

          }
        },
        {
          label: AnnouncementFeaturesDropdown()[AnnouncementFeaturesTypeEnum.Garden].name,
          value: AnnouncementFeaturesTypeEnum.Garden,
          estateType: {
            residentialType: [
              AnnouncementResidentialTypeEnum.Building,
              AnnouncementResidentialTypeEnum.Villa,
              AnnouncementResidentialTypeEnum.Chalet,
              AnnouncementResidentialTypeEnum.Tower,
              AnnouncementResidentialTypeEnum.Compound,
              AnnouncementResidentialTypeEnum.FarmHouse

            ]

          }
        },
        {
          label: AnnouncementFeaturesDropdown()[AnnouncementFeaturesTypeEnum.PrivateSwimmingPool].name,
          value: AnnouncementFeaturesTypeEnum.PrivateSwimmingPool,
          estateType: {
            residentialType: [
              AnnouncementResidentialTypeEnum.Building,
              AnnouncementResidentialTypeEnum.Villa,
              AnnouncementResidentialTypeEnum.Chalet,
              AnnouncementResidentialTypeEnum.Tower,
              AnnouncementResidentialTypeEnum.Compound,
              AnnouncementResidentialTypeEnum.FarmHouse

            ]

          }
        },
        {
          label: AnnouncementFeaturesDropdown()[AnnouncementFeaturesTypeEnum.PlayGround].name,
          value: AnnouncementFeaturesTypeEnum.PlayGround,
          estateType: {
            residentialType: [
              AnnouncementResidentialTypeEnum.Building,
              AnnouncementResidentialTypeEnum.Villa,
              AnnouncementResidentialTypeEnum.Chalet,
              AnnouncementResidentialTypeEnum.Tower,
              AnnouncementResidentialTypeEnum.Compound,
              AnnouncementResidentialTypeEnum.FarmHouse

            ]

          }
        },
        {
          label: AnnouncementFeaturesDropdown()[AnnouncementFeaturesTypeEnum.PetsAllowed].name,
          value: AnnouncementFeaturesTypeEnum.PetsAllowed,
          estateType: {
            residentialType: [
              AnnouncementResidentialTypeEnum.Building,
              AnnouncementResidentialTypeEnum.Villa,
              AnnouncementResidentialTypeEnum.Chalet,
              AnnouncementResidentialTypeEnum.Tower,
              AnnouncementResidentialTypeEnum.Compound
            ]

          }
        },
        {
          label: AnnouncementFeaturesDropdown()[AnnouncementFeaturesTypeEnum.Kitchen].name,
          value: AnnouncementFeaturesTypeEnum.Kitchen,
          estateType: {
            residentialType: [
              AnnouncementResidentialTypeEnum.Building,
              AnnouncementResidentialTypeEnum.Villa,
              AnnouncementResidentialTypeEnum.Chalet,
              AnnouncementResidentialTypeEnum.Tower,
              AnnouncementResidentialTypeEnum.Compound,
              AnnouncementResidentialTypeEnum.FarmHouse

            ],
            commercialType: [
              AnnouncementCommercialTypeEnum.OfficeSpace,
              AnnouncementCommercialTypeEnum.Shop
            ]

          }
        },
        {
          label: AnnouncementFeaturesDropdown()[AnnouncementFeaturesTypeEnum.SharedSwimmingPool].name,
          value: AnnouncementFeaturesTypeEnum.SharedSwimmingPool,
          estateType: {
            residentialType: [
              AnnouncementResidentialTypeEnum.Building,
              AnnouncementResidentialTypeEnum.Villa,
              AnnouncementResidentialTypeEnum.Chalet,
              AnnouncementResidentialTypeEnum.Tower,
              AnnouncementResidentialTypeEnum.Compound
            ]

          }
        },
        {
          label: AnnouncementFeaturesDropdown()[AnnouncementFeaturesTypeEnum.Security].name,
          value: AnnouncementFeaturesTypeEnum.Security,
          estateType: {
            residentialType: [
              AnnouncementResidentialTypeEnum.Building,
              AnnouncementResidentialTypeEnum.Villa,
              AnnouncementResidentialTypeEnum.Chalet,
              AnnouncementResidentialTypeEnum.Tower,
              AnnouncementResidentialTypeEnum.Compound,
              AnnouncementResidentialTypeEnum.FarmHouse

            ],
            commercialType: [
              AnnouncementCommercialTypeEnum.OfficeSpace,
              AnnouncementCommercialTypeEnum.Shop,
              AnnouncementCommercialTypeEnum.Showroom,
              AnnouncementCommercialTypeEnum.WareHouse,
            ]

          }
        },
        {
          label: AnnouncementFeaturesDropdown()[AnnouncementFeaturesTypeEnum.Balcony].name,
          value: AnnouncementFeaturesTypeEnum.Balcony,
          estateType: {
            residentialType: [
              AnnouncementResidentialTypeEnum.Building,
              AnnouncementResidentialTypeEnum.Villa,
              AnnouncementResidentialTypeEnum.Chalet,
              AnnouncementResidentialTypeEnum.Tower,
              AnnouncementResidentialTypeEnum.Compound,
              AnnouncementResidentialTypeEnum.FarmHouse

            ]

          }
        },
        {
          label: AnnouncementFeaturesDropdown()[AnnouncementFeaturesTypeEnum.PrivateGym].name,
          value: AnnouncementFeaturesTypeEnum.PrivateGym,
          estateType: {
            residentialType: [
              AnnouncementResidentialTypeEnum.Building,
              AnnouncementResidentialTypeEnum.Villa,
              AnnouncementResidentialTypeEnum.Chalet,
              AnnouncementResidentialTypeEnum.Tower,
              AnnouncementResidentialTypeEnum.Compound,
              AnnouncementResidentialTypeEnum.FarmHouse


            ]

          }
        },
        {
          label: AnnouncementFeaturesDropdown()[AnnouncementFeaturesTypeEnum.Elevator].name,
          value: AnnouncementFeaturesTypeEnum.Elevator,
          estateType: {
            residentialType: [
              AnnouncementResidentialTypeEnum.Building,
              AnnouncementResidentialTypeEnum.Villa,
              AnnouncementResidentialTypeEnum.Chalet,
              AnnouncementResidentialTypeEnum.Tower,
              AnnouncementResidentialTypeEnum.Compound,
              AnnouncementResidentialTypeEnum.FarmHouse

            ],
            commercialType: [
              AnnouncementCommercialTypeEnum.OfficeSpace,
              AnnouncementCommercialTypeEnum.Shop
            ]

          }
        },
        {
          label: AnnouncementFeaturesDropdown()[AnnouncementFeaturesTypeEnum.AirConditioning].name,
          value: AnnouncementFeaturesTypeEnum.AirConditioning,
          estateType: {
            residentialType: [
              AnnouncementResidentialTypeEnum.Building,
              AnnouncementResidentialTypeEnum.Villa,
              AnnouncementResidentialTypeEnum.Chalet,
              AnnouncementResidentialTypeEnum.Tower,
              AnnouncementResidentialTypeEnum.Compound,
              AnnouncementResidentialTypeEnum.FarmHouse

            ],
            commercialType: [
              AnnouncementCommercialTypeEnum.OfficeSpace,
              AnnouncementCommercialTypeEnum.Shop,
              AnnouncementCommercialTypeEnum.Showroom,
              AnnouncementCommercialTypeEnum.WareHouse,
            ]

          }
        },
        {
          label: AnnouncementFeaturesDropdown()[AnnouncementFeaturesTypeEnum.CentralAirConditioning].name,
          value: AnnouncementFeaturesTypeEnum.CentralAirConditioning,
          estateType: {
            residentialType: [
              AnnouncementResidentialTypeEnum.Building,
              AnnouncementResidentialTypeEnum.Villa,
              AnnouncementResidentialTypeEnum.Chalet,
              AnnouncementResidentialTypeEnum.Tower,
              AnnouncementResidentialTypeEnum.Compound,
              AnnouncementResidentialTypeEnum.FarmHouse

            ],
            commercialType: [
              AnnouncementCommercialTypeEnum.OfficeSpace,
              AnnouncementCommercialTypeEnum.Shop,
              AnnouncementCommercialTypeEnum.Showroom,
              AnnouncementCommercialTypeEnum.WareHouse,
            ]

          }
        },
        {
          label: AnnouncementFeaturesDropdown()[AnnouncementFeaturesTypeEnum.LaundryRoom].name,
          value: AnnouncementFeaturesTypeEnum.LaundryRoom,
          estateType: {
            residentialType: [
              AnnouncementResidentialTypeEnum.Building,
              AnnouncementResidentialTypeEnum.Villa,
              AnnouncementResidentialTypeEnum.Chalet,
              AnnouncementResidentialTypeEnum.Tower,
              AnnouncementResidentialTypeEnum.Compound,
              AnnouncementResidentialTypeEnum.FarmHouse


            ]

          }
        },
        {
          label: AnnouncementFeaturesDropdown()[AnnouncementFeaturesTypeEnum.DriverRoom].name,
          value: AnnouncementFeaturesTypeEnum.DriverRoom,
          estateType: {
            residentialType: [
              AnnouncementResidentialTypeEnum.Villa,
              AnnouncementResidentialTypeEnum.Chalet,
              AnnouncementResidentialTypeEnum.Tower,
              AnnouncementResidentialTypeEnum.Compound,
              AnnouncementResidentialTypeEnum.FarmHouse


            ]

          }
        },
        {
          label: AnnouncementFeaturesDropdown()[AnnouncementFeaturesTypeEnum.DiningRoom].name,
          value: AnnouncementFeaturesTypeEnum.DiningRoom,
          estateType: {
            residentialType: [
              AnnouncementResidentialTypeEnum.Villa,
              AnnouncementResidentialTypeEnum.Chalet,
              AnnouncementResidentialTypeEnum.Tower,
              AnnouncementResidentialTypeEnum.Compound,
              AnnouncementResidentialTypeEnum.FarmHouse


            ]

          }
        },
        {
          label: AnnouncementFeaturesDropdown()[AnnouncementFeaturesTypeEnum.MaidRoom].name,
          value: AnnouncementFeaturesTypeEnum.MaidRoom,
          estateType: {
            residentialType: [
              AnnouncementResidentialTypeEnum.Villa,
              AnnouncementResidentialTypeEnum.Chalet,
              AnnouncementResidentialTypeEnum.Tower,
              AnnouncementResidentialTypeEnum.Compound,
              AnnouncementResidentialTypeEnum.FarmHouse


            ]

          }
        },
        {
          label: AnnouncementFeaturesDropdown()[AnnouncementFeaturesTypeEnum.CoffeeShops].name,
          value: AnnouncementFeaturesTypeEnum.CoffeeShops,
          estateType: {
            residentialType: [
              AnnouncementResidentialTypeEnum.Tower,
              AnnouncementResidentialTypeEnum.Compound

            ]
          }
        },
        {
          label: AnnouncementFeaturesDropdown()[AnnouncementFeaturesTypeEnum.Extension].name,
          value: AnnouncementFeaturesTypeEnum.Extension,
          estateType: {
            residentialType: [
              AnnouncementResidentialTypeEnum.Villa
            ],
            commercialType: [
              AnnouncementCommercialTypeEnum.Showroom,
              AnnouncementCommercialTypeEnum.WareHouse,
            ]

          }
        },
        {
          label: AnnouncementFeaturesDropdown()[AnnouncementFeaturesTypeEnum.HeatingSystem].name,
          value: AnnouncementFeaturesTypeEnum.HeatingSystem,
          estateType: {
            residentialType: [
              AnnouncementResidentialTypeEnum.Building,
              AnnouncementResidentialTypeEnum.Villa,
              AnnouncementResidentialTypeEnum.Chalet,
              AnnouncementResidentialTypeEnum.Tower,
              AnnouncementResidentialTypeEnum.Compound,
              AnnouncementResidentialTypeEnum.FarmHouse

            ]

          }
        },
        {
          label: AnnouncementFeaturesDropdown()[AnnouncementFeaturesTypeEnum.LivingRoom].name,
          value: AnnouncementFeaturesTypeEnum.LivingRoom,
          estateType: {
            residentialType: [
              AnnouncementResidentialTypeEnum.Villa,
              AnnouncementResidentialTypeEnum.Chalet,
              AnnouncementResidentialTypeEnum.Tower,
              AnnouncementResidentialTypeEnum.Compound,
              AnnouncementResidentialTypeEnum.FarmHouse


            ]

          }
        },
        {
          label: AnnouncementFeaturesDropdown()[AnnouncementFeaturesTypeEnum.BusShuttle].name,
          value: AnnouncementFeaturesTypeEnum.BusShuttle,
          estateType: {
            residentialType: [
              AnnouncementResidentialTypeEnum.Tower,
              AnnouncementResidentialTypeEnum.Compound

            ]
          }
        },
        {
          label: AnnouncementFeaturesDropdown()[AnnouncementFeaturesTypeEnum.KinderGarden].name,
          value: AnnouncementFeaturesTypeEnum.KinderGarden,
          estateType: {
            residentialType: [
              AnnouncementResidentialTypeEnum.Tower,
              AnnouncementResidentialTypeEnum.Compound

            ]
          }
        },
        {
          label: AnnouncementFeaturesDropdown()[AnnouncementFeaturesTypeEnum.SuperMarket].name,
          value: AnnouncementFeaturesTypeEnum.SuperMarket,
          estateType: {
            residentialType: [
              AnnouncementResidentialTypeEnum.Tower,
              AnnouncementResidentialTypeEnum.Compound

            ]
          }
        },


      ]
      featureListForFilter.map(item => {
        if (estateTypeSelect === AnnouncementEstateTypeEnum.Residential) {
          if (item.estateType.residentialType && item.estateType.residentialType.includes(residentialOrCommercialTypeSelect)) {
            newFeatureList.push({name: item.label, value: item.value})
            flag = false
          }
        }
        if (estateTypeSelect === AnnouncementEstateTypeEnum.Commercial) {
          if (item.estateType.commercialType && item.estateType.commercialType.includes(residentialOrCommercialTypeSelect)) {
            newFeatureList.push({name: item.label, value: item.value})
            flag = false
          }
        }
      })
      if (flag) {
        this.setState({
          featureList: AnnouncementFeaturesDropdown()
        })
      } else {
        this.setState({
          featureList: newFeatureList
        })
      }

    }
  }


  private getDetailsAnnouncement = async (id: string) => {
    const result = await AnnouncementController.GetAnnouncementDetailsForEdit(id);

    result.data && this.setState({details: result.data});
    this.state.modifyId = result.data.id;
    const {details} = this.state;
    if (details) {
      this.setState({
        form: {
          announcementType: details.announcementType,
          announcementEstateType: details.announcementEstateType,
          announcementRentType: details.announcementRentType,
          announcementResidentialType: details.announcementResidentialType,
          features: details.features,
          address: details.address,
          commercialType: details.commercialType,
          landType: details.landType,
          lat: details.lat,
          lng: details.lng,
          bedroomCount: details.bedroomCount,
          bathroomCount: details.bathroomCount,
          title: details.title,
          description: details.description,
          titleArabian: details.titleArabian,
          descriptionArabian: details.descriptionArabian,
          isOtherPeriod: details.isOtherPeriod,
          price: Number(details.price),
          area: details.area,
          buildingAge: details.buildingAge,
          constructionStatus: details.constructionStatus,
          ownerShip: details.ownerShip,
          furnishingStatus: details.furnishingStatus,
          floor: details.floor,
          sittingArea: details.sittingArea,
          saleType: details.saleType,
          currencyId: 14,
          numberOfAppartment: details.numberOfAppartment,
          numberOfFloors: details.numberOfFloors,
          numberOfVilla: details.numberOfVilla,
          numberOfShop: details.numberOfShop,
          numberOfUnits: details.numberOfUnits,
          district: details.district,

          fireSystem: details.fireSystem,
          numberOfWareHouse: details.numberOfWareHouse,
          officeSpace: details.officeSpace,
          laborResidence: details.laborResidence,
          facadeType: details.facadeType,
          landNumber: details.landNumber,
          planNumber: details.planNumber,
          streetWidth: details.streetWidth,
          landCategory:details.landCategory


        },
        uploadsData: {
          basePhoto: details.photo.photo,
          basePhotoFile: null,
          otherImages: details.photos.map(item => item.photo),
          otherImageFiles: [],
          otherDocuments: [],
          otherDocumentsFiles: details.documents
        }
      });
      this.setState({form: this.state.form, uploadsData: this.state.uploadsData})

    }
  };

  private deleteOtherImage = (index: number) => {
    if (this.fileForImages.current) {
      this.fileForImages.current.value = '';
    }

    const {uploadsData} = this.state;
    uploadsData.otherImages.length > 0 ? uploadsData.otherImages.splice(index, 1) : null;
    uploadsData.otherImageFiles.length > 0 ? uploadsData.otherImageFiles.splice(index, 1) : null;
    this.setState({uploadsData});
  };

  private uploadOtherImages = async (e: React.SyntheticEvent<HTMLInputElement>) => {
    const {files} = e.currentTarget;
    const {uploadsData} = this.state;
    if (files && files.length) {
      // const { data, onChange } = this.props;

      Array.from(files).forEach(item => {
        const path = URL.createObjectURL(item);
        uploadsData.otherImages.unshift(path);
        uploadsData.otherImageFiles.unshift(item);
      });
      this.setState({uploadsData});
    }
  };

  private uploadOtherDocuments = async (e: React.SyntheticEvent<HTMLInputElement>) => {
    const {files} = e.currentTarget;

    if (files && files.length) {
      const {uploadsData} = this.state;
      uploadsData.otherDocuments.push(...Array.from(files));
      this.setState({uploadsData});

    }
  };

  private deleteOtherDocument = (index: number) => {
    if (this.fileForDocument.current) {
      this.fileForDocument.current.value = '';
    }
    const {uploadsData} = this.state;
    uploadsData.otherDocuments.splice(index, 1);
    uploadsData.otherDocumentsFiles.splice(index, 1)
    this.setState({uploadsData});
  };

  private changeLanguage = (chosenLanguage: LanguageEnum) => this.setState({chosenLanguage});

  private toggleOtherPeriod = () => {
    const {form} = this.state;
    if (form) {
      form.isOtherPeriod = !form.isOtherPeriod;
      this.setState({form})
    }
  };
  private changeCurrencyNumberField = (value:string , name : string ) => {
    const {form} = this.state;
    if (form) {
      if (value) form[name] = +value;
      this.setState({form});
    }

  };

  private changeTitle = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const {form} = this.state;
    const {chosenLanguage} = this.state;
    if (form) {
      if (chosenLanguage === LanguageEnum.English) form.title = e.currentTarget.value;
      else form.titleArabian = e.currentTarget.value;
      this.setState({form});
      this.state.errors.title = false;
    }
  };

  // private changePrice = (e: React.SyntheticEvent<HTMLInputElement>) => {
  //   const {form} = this.state;
  //   if (form) {
  //     form.price = Number(e.currentTarget.value);
  //     this.setState({form});
  //   }
  // };
  //


  private changeNumberField = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const {form} = this.state;
    if (form) {
      if (+e.currentTarget.value || +e.currentTarget.value === 0) form[e.currentTarget.name] = +e.currentTarget.value;
      this.setState({form});
    }

  }

  private changeDescription = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const {form} = this.state;
    const {chosenLanguage} = this.state;
    if (form) {
      if (chosenLanguage === LanguageEnum.English) form.description = e.currentTarget.value;
      else form.descriptionArabian = e.currentTarget.value;
      this.setState({form});
      this.state.errors.description = false;


    }
  }

  private changeAddress = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const {form} = this.state;
    if (form) {
      form.address = e.currentTarget.value;
      this.setState({form});
      this.state.errors.location = false;

    }
  };

  private placeSelect = () => {
    const element = document.getElementById('location-input');
    const {form} = this.state;
    if (form) {
      if (element) {
        const {value} = element as HTMLInputElement;
        form.address = value;
        this.setState({form});
        this.state.errors.location = false;

      }
    }
  };

  private coverUpload = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const {files} = e.currentTarget;
    const {uploadsData} = this.state;

    if (files && files.length) {
      uploadsData.basePhoto = URL.createObjectURL(files[0]);
      uploadsData.basePhotoFile = files[0];
      this.setState({uploadsData});
    }
  };

  private toggleCancelModal = () => {
    this.setState({
      isOpenCancelModal: !this.state.isOpenCancelModal
    })
  };

  private toggleApprovedModal = async () => {
    this.setState({loading: true}, async () => {
      if (this.checkForSubmit()) {

        const {id} = this.props.match.params;
        if (id && this.state.form) {
          this.modifyId = +id;
          const ressultForm = await AnnouncementController.MyAnnouncementEdit(Number(id), this.state.form)
          const ressultFile = this.checkUplaods()
          if (ressultForm.success && ressultFile) {
            this.setState({
              isOpenApprovedModal: !this.state.isOpenApprovedModal
            })
          } else {
            this.setState({loading: false})

          }
        }
      } else {
        alertify.error('Please fill out all required fields', 2)
        this.setState({loading: false})
        window.dispatchEvent(new Event('scrollTop'));

      }
    })

  }

  private saveEditAnnouncement = async (e: React.SyntheticEvent<HTMLInputElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const {id} = this.props.match.params;
    console.log(this.props.match.params);
    this.setState({loading: true}, async () => {


      if (this.checkForSubmit()) {


        if (id && this.state.form) {
          this.modifyId = +id;
          console.log(this.props.match.params);

          const ressultForm = await AnnouncementController.MyAnnouncementEdit(Number(id), this.state.form)
    console.log(ressultForm);

          const ressultFile = this.checkUplaods()
          if (ressultForm.success && ressultFile) {
            if (this.state.form) {
              window.routerHistory.push(ROUTES.ANNOUNCEMENTS)
              // await AnnouncementController.ApproveAnnouncement({
              //   title: this.state.form.title || '',
              //   description: this.state.form.description || '',
              //   titleArabian: this.state.form.titleArabian || '',
              //   descriptionArabian: this.state.form.descriptionArabian || '',
              //   day: 0,
              //   defaultDay: 0,
              // }, Number(id));
            }
          }

        }
      } else {

        alertify.error('Please fill out all required fields', 2)
        this.setState({loading: false})
        window.dispatchEvent(new Event('scrollTop'));
      }
    })

  }

  // private approveInReview = async () => {
  //   if (!this.state.approveOne) {
  //
  //     const {id} = this.props.match.params;
  //     this.setState({loading: true}, async () => {
  //       if (this.checkForSubmit()) {
  //         if (id && this.state.form) {
  //           this.modifyId = +id;
  //           const ressultForm = await AnnouncementController.MyAnnouncementEdit(Number(id), this.state.form)
  //           const ressultFile = this.checkUplaods()
  //           if (ressultForm.success && ressultFile) {
  //             if (this.state.form) {
  //               await AnnouncementController.ApproveAnnouncement({
  //                 title: this.state.form.title || '',
  //                 description: this.state.form.description || '',
  //                 titleArabian: this.state.form.titleArabian || '',
  //                 descriptionArabian: this.state.form.descriptionArabian || '',
  //                 day: 0,
  //                 defaultDay: 0,
  //               }, Number(id));
  //               window.routerHistory.push(ROUTES.ANNOUNCEMENTS_IN_REVIEW)
  //             }
  //           }
  //         }
  //
  //       } else {
  //         alertify.error('Please fill out all required fields', 2)
  //         this.setState({loading: false})
  //         window.dispatchEvent(new Event('scrollTop'));
  //
  //       }
  //     })
  //     this.setState({
  //       approveOne: true
  //     })
  //   }
  //
  //
  // };
  private modifyId: number;

  private checkUplaods = () => {
    const {uploadsData} = this.state;
    const {id} = this.props.match.params;
    if (id) {
      this.modifyId = +id;
    }
    this.setState({}, async () => {
      const promises: Array<Promise<IResponse<IPhotoProduct | boolean>>> = [];
      if (uploadsData.basePhotoFile) {
        const form = new FormData();
        form.append('File', uploadsData.basePhotoFile);
        const promise = AnnouncementController.UploadBasePhoto(this.modifyId, form);
        promises.push(promise);
      }

      if (uploadsData.otherImageFiles.length || uploadsData.otherImages.length) {
        const form = new FormData();
        form.append('announcementId', this.modifyId.toString());
        uploadsData.otherImageFiles.forEach(item => form.append('Photos', item));
        uploadsData.otherImages.forEach(item => form.append('PhotoPaths', item));

        const promise = AnnouncementController.UploadOtherPhotos(form);
        promises.push(promise);
      }
      if (uploadsData.otherDocuments.length || uploadsData.otherDocumentsFiles) {
        const form = new FormData();
        form.append('announcementId', this.modifyId.toString());
        uploadsData.otherDocuments.forEach(item => form.append('Photos', item));
        uploadsData.otherDocumentsFiles.forEach(item => form.append('PhotoPaths', item.document));
        const promise = AnnouncementController.UploadOtherDocuments(form);
        promises.push(promise);
      }
      const result = await Promise.all(promises);
      if (result[0].success) {
        // window.routerHistory.push(ROUTES.MY_ANNOUNCEMENTS)

      }
    });
    return true
  }


  //  validations for  show announcements property


  private validationForFeatureList = () => {
    const {form} = this.state;
    if (form) {
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Land) {
        return false
      }

      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Commercial && form.commercialType === AnnouncementCommercialTypeEnum.Showroom) {
        return false
      }
      return true
    }
    return true
  }

  private validationForSittingArea = () => {
    const {form} = this.state;
    if (form) {
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Residential && form.announcementResidentialType === AnnouncementResidentialTypeEnum.Building) {
        return false
      }
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Residential && form.announcementResidentialType === AnnouncementResidentialTypeEnum.Tower) {
        return false
      }
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Commercial) {
        return false
      }
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Residential && form.announcementType === AnnouncementTypeEnum.Sale && form.announcementResidentialType === AnnouncementResidentialTypeEnum.Compound) {
        return false
      }
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Land) {
        return false
      }
      return true
    }
    return true

  }

  private validationForFurnishedStatus = () => {
    const {form} = this.state;
    if (form) {
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Residential && form.announcementResidentialType === AnnouncementResidentialTypeEnum.Building) {
        return false
      }
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Commercial && form.commercialType === AnnouncementCommercialTypeEnum.Showroom) {
        return false
      }
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Commercial && form.commercialType === AnnouncementCommercialTypeEnum.WareHouse) {
        return false
      }
      return true
    }
    return true

  }

  private validationForBuildingAge = () => {
    const {form} = this.state;
    if (form) {
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Residential && form.announcementResidentialType === AnnouncementResidentialTypeEnum.FarmHouse) {
        return false
      }
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Commercial && form.commercialType === AnnouncementCommercialTypeEnum.WareHouse) {
        return false
      }
      return true
    }
    return true

  }


  private validationForAppartament = () => {
    const {form} = this.state;
    if (form) {
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Residential && form.announcementResidentialType === AnnouncementResidentialTypeEnum.Building) {
        return true
      }
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Residential && form.announcementResidentialType === AnnouncementResidentialTypeEnum.Compound && form.announcementType === AnnouncementTypeEnum.Sale) {
        return true
      }
    }

    return false
  }

  private validationForFloor = () => {
    const {form} = this.state;
    if (form) {

      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Residential && form.announcementResidentialType === AnnouncementResidentialTypeEnum.Building) {
        return false
      }
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Residential && form.announcementResidentialType === AnnouncementResidentialTypeEnum.Villa) {
        return false
      }
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Residential && form.announcementResidentialType === AnnouncementResidentialTypeEnum.Chalet) {
        return false
      }
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Residential && form.announcementResidentialType === AnnouncementResidentialTypeEnum.Tower) {
        return false
      }
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Residential && form.announcementResidentialType === AnnouncementResidentialTypeEnum.FarmHouse) {
        return false
      }
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Residential && form.announcementResidentialType === AnnouncementResidentialTypeEnum.Compound) {
        return false
      }

      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Commercial && form.commercialType === AnnouncementCommercialTypeEnum.Showroom) {
        return false
      }
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Land) {
        return false
      }
    }
    return true
  }

  private validationForNumberOfFloor = () => {
    const {form} = this.state;
    if (form) {
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Residential && form.announcementResidentialType === AnnouncementResidentialTypeEnum.Building) {
        return true
      }
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Residential && form.announcementResidentialType === AnnouncementResidentialTypeEnum.Villa) {
        return true
      }
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Residential && form.announcementResidentialType === AnnouncementResidentialTypeEnum.Chalet) {
        return true
      }
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Residential && form.announcementResidentialType === AnnouncementResidentialTypeEnum.Tower) {
        return true
      }
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Residential && form.announcementResidentialType === AnnouncementResidentialTypeEnum.FarmHouse) {
        return true
      }
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Residential && form.announcementType === AnnouncementTypeEnum.Rent &&
        form.announcementResidentialType === AnnouncementResidentialTypeEnum.Compound) {
        return true
      }
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Residential && form.announcementResidentialType === AnnouncementResidentialTypeEnum.Duplex) {
        return true
      }

      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Commercial && form.commercialType === AnnouncementCommercialTypeEnum.Showroom) {
        return true
      }
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Commercial && form.commercialType === AnnouncementCommercialTypeEnum.WareHouse) {
        return true
      }

    }

    return false
  }

  private validationBedAndBathroom = () => {
    const {form} = this.state;

    if (form) {
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Residential && form.announcementResidentialType === AnnouncementResidentialTypeEnum.Tower) {
        return false
      }
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Residential && form.announcementType === AnnouncementTypeEnum.Sale && form.announcementResidentialType === AnnouncementResidentialTypeEnum.Compound) {
        return false
      }
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Residential && form.announcementResidentialType === AnnouncementResidentialTypeEnum.Building) {
        return false
      }
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Land) {
        return false
      }
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Commercial) {
        return false
      }
    }

    return true
  }

  private validationForFireSystem = () => {
    const {form} = this.state;

    if (form) {
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Commercial && form.commercialType === AnnouncementCommercialTypeEnum.Showroom) {
        return true
      }
      if (form.announcementEstateType === AnnouncementEstateTypeEnum.Commercial && form.commercialType === AnnouncementCommercialTypeEnum.WareHouse) {
        return true
      }
    }
    return false
  }


  public render() {
    const {details, form, uploadsData, chosenLanguage, submited} = this.state
    return form && uploadsData ? (

      <div className='B-announcement-details-block'>
        <div className="B-announcement-main-title ">
          <div className="B-details-back" onClick={() => window.routerHistory.goBack()}>
            <i className='icon-cancel'/>
            <h3>Edit announcement</h3>
          </div>
        </div>
        <div className={`B-announcement-details-container`}>
          <div className="B-edit-title">
            <h3>Product images</h3>
          </div>

          <div
            className={`B-announcement-slider-component  ${uploadsData.otherImages.length > 3 ? "margin-bottom" : " "}`}>
            <div className='B-slider-add'>
              <div className='B-add-Img'>
                <label className={`I-G-uploader`}>
                  <input type="file" accept="image/*"
                         onChange={this.uploadOtherImages} multiple={true} ref={this.fileForImages}/>
                  <i className="B-plus"/>
                </label>
              </div>
            </div>
            <div
              className={`B-announcement-details-slider ${uploadsData.otherImages.length > 3 ? '' : 'B-d-flex-slider'}`}>
              {
                uploadsData.otherImages.length > 3
                  ? <Slider {...this.settingsSlider} >
                    {uploadsData.otherImages.map((item, index) => {
                      return <div key={index} className="B-sliders-edit">
                        <SliderDetailsAnnouncement sliderImg={item}/>
                        <span onClick={() => this.deleteOtherImage(index)}>&times;</span>
                      </div>
                    })}
                  </Slider> :
                  <>
                    {uploadsData.otherImages.map((item, index) => {
                      return <div key={index} className="B-sliders-edit">
                        <SliderDetailsAnnouncement sliderImg={item}/>
                        <span onClick={() => this.deleteOtherImage(index)}>&times;</span>
                      </div>
                    })}
                  </>
              }
            </div>
          </div>
          <div className="B-edit-title">
            <h3>Product base image</h3>
          </div>
          <div className="B-announcement-slider-component">
            <div className="P-base-photo">
              <label className={`I-G-uploader I-cover-uploader`}>
                <input type="file" accept="image/*" onChange={this.coverUpload}/>
                <i className="B-plus"/>
                {!uploadsData.basePhoto && <i className="icon-ic_circleplus"/>}
                {uploadsData.basePhoto && <div
                    className="I-G-uploaded"
                    style={{backgroundImage: `url("${uploadsData.basePhoto}")`}}
                />}
              </label>
            </div>
          </div>

          <div className='B-announcement-details-information B-announcement-details-information-edit'>
            <div className='B-announcement-details-info-components'>
              <div className='B-announcement-details-info-title'>
                <h3>User</h3>
              </div>
              <div className='B-announcement-details-info-box'>
                {details ?
                  <div className='B-announcement-details-user'>
                    <div className='B-announcement-details-user-img'
                         style={{backgroundImage: `url("${details.userProfilePhoto ? (details.userProfilePhoto.photo || details.userProfilePhoto.photoBlur) : NoProfilePicture}")`}}/>
                    <div className='B-announcement-details-about'>
                      <h3>{details.userName || '-'}</h3>
                      <div className='B-announcement-details-all-list'>
                        <p><span>{details.userAnnouncementCount}</span> announcements</p>
                      </div>
                    </div>
                  </div> : null}
              </div>
            </div>
            <div className='B-announcement-details-info-components'>
              <div className='B-announcement-details-info-title'>
                <h3>Description<span className="required-red">*</span></h3>

              </div>
              <div className='B-announcement-details-info-box'>
                <div className="I-languages">
          <span
            className={`I-language-option ${chosenLanguage === LanguageEnum.English ? 'I-active' : ''}`}
            onClick={() => this.changeLanguage(LanguageEnum.English)}
          >Eng</span>
                  <span
                    className={`I-language-option ${chosenLanguage === LanguageEnum.Arabian ? 'I-active' : ''}`}
                    onClick={() => this.changeLanguage(LanguageEnum.Arabian)}
                  >Ar</span>
                </div>
                <div className="G-input-group-edit">
                  <p>Title</p>
                  {!this.validationTitle()? <p className="L-error-title">Please fill In the option of title in two languages</p> : null }

                  <input
                    autoComplete='off'
                    value={chosenLanguage === LanguageEnum.English ? form.title : form.titleArabian}
                    onChange={this.changeTitle}
                    className={`G-input ${this.state.errors.title ? 'error-input' : ''}`}
                  />
                </div>
                <div className="G-input-group-edit">
                  <p>Description</p>
                  {!this.validationDescription()?    <p className="L-error-title">Please fill in the option of description in two languages</p> : null }

                  <textarea
                    autoComplete='off'
                    value={chosenLanguage === LanguageEnum.English ? form.description : form.descriptionArabian}
                    onChange={this.changeDescription}
                    className={`G-textarea ${this.state.errors.description ? 'error-input' : ''}`}
                  />
                </div>
              </div>
            </div>
            <div className='B-announcement-details-info-components'>
              <div className='B-announcement-details-info-title'>
                <h3>Location <span className="required-red">*</span></h3>
              </div>
              <div className='B-announcement-details-info-box'>
                <div className="G-input-group-edit">
                  <Autocomplete
                    autoComplete='off'
                    id="location-input"
                    onChange={this.changeAddress}
                    onPlaceSelected={this.placeSelect}
                    value={form.address}
                    types={googlePlacesTypes}
                    className={`G-input ${this.state.errors.location ? 'error-input' : ''}`}
                  />
                </div>
              </div>
            </div>
            <div className='B-announcement-details-info-components'>
              <div className='B-announcement-details-info-title'>
                <h3>Price<span className="required-red">*</span></h3>
              </div>
              <div className='B-announcement-details-info-box'>
                <div className="G-input-group-edit input-price">
                  <CurrencyInput
                    name="price"
                    placeholder="Price"
                    value={form.price}
                    className={`G-input I-none-full-input  ${!submited && !form.price? 'error-input' : ''}`}
                    onChange={this.changeCurrencyNumberField}
                  />
                  {/*<input*/}
                  {/*  type='text'*/}
                  {/*  autoComplete='off'*/}
                  {/*  value={form.price}*/}
                  {/*  onChange={this.changePrice}*/}
                  {/*  className={`G-input ${this.state.errors.price ? 'error-input' : ''}`}*/}
                  {/*/>*/}
                  <span
                    className="B-price-val">{form.announcementType === AnnouncementTypeEnum.Rent ? "SAR / " + AnnouncementRentTypeViewShort[form.announcementRentType] : "SAR"}</span>
                </div>
              </div>
            </div>
            {details ?
              <div className='B-announcement-details-info-components'>

                <div className='B-announcement-details-info-title'>
                  <h3>Details</h3>
                </div>
                <div className='B-announcement-details-info-box'>
                  {details.id ?
                    <div className='B-announcement-details-sub-block sub-width'>
                      <div className='B-announcement-details-sub-box'>
                        <p>Referral code:</p>
                      </div>
                      <div className='B-announcement-details-sub-box'>
                        <p>{details.id}</p>
                      </div>
                    </div> : ''
                  }


                  <div className='B-announcement-details-sub-block sub-width'>
                    <div className='B-announcement-details-sub-box'>
                      <p>Announcement type:</p>
                    </div>
                    <div className='B-announcement-details-sub-box'>
                      <div className='B-announcement-input-block B-announcement-filter-block'>
                        <label>
                          <Select<AnnouncementTypeEnum>
                            clear={true}
                            useValue={true}
                            value={form.announcementType}
                            options={AnnouncementTypeDropdown()}
                            placeholder="Announcement type"
                            onChange={this.changeAnnouncementType}
                            placeholderOpacity={true}
                            isAllList={true}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {form.announcementType === AnnouncementTypeEnum.Rent ?
                    <div className='B-announcement-details-sub-block sub-width'>
                      <div className='B-announcement-details-sub-box'>
                        <p>Announcement rent type:</p>
                      </div>
                      <div className='B-announcement-details-sub-box'>
                        <div className='B-announcement-input-block B-announcement-filter-block'>
                          <label>
                            <Select<AnnouncementRentType>
                              clear={true}
                              useValue={true}
                              value={form.announcementRentType}
                              options={AnnouncementRentTypeDropdown()}
                              placeholder="Select rental frequency"
                              onChange={this.changeAnnouncementRentType}
                              placeholderOpacity={true}
                              isAllList={true}
                            />
                          </label>
                        </div>
                        <div className="other-period">
                          <label className="G-flex-align-center G-mt-4">
                            <input type="checkbox"
                                   onChange={this.toggleOtherPeriod}
                                   checked={form.isOtherPeriod}/>
                            <span/>
                            <p className="G-fs-14 G-ml-1 G-w-100-P G-cursor prop-available">Other
                              options are available by request</p>
                          </label>
                        </div>
                      </div>
                    </div> : null}
                  {/* {form.announcementType === AnnouncementTypeEnum.Sale ?
                    <div className='B-announcement-details-sub-block sub-width'>
                      <div className='B-announcement-details-sub-box'>
                        <p>Sale type:</p>
                      </div>
                      <div className='B-announcement-details-sub-box'>
                        <div className='B-announcement-input-block B-announcement-filter-block'>
                          <label>
                            <Select<SaleTypeEnum>
                              clear={true}
                              useValue={true}
                              value={form.saleType}
                              options={AnnouncementSaleTypeDropdown()}
                              placeholder="Select sale type"
                              onChange={this.changeSaleType}
                              placeholderOpacity={true}
                              isAllList={true}
                            />
                          </label>
                        </div>

                      </div>
                    </div> : null} */}
                  <div className='B-announcement-details-sub-block sub-width'>
                    <div className='B-announcement-details-sub-box'>
                      <p>Property type:</p>
                    </div>
                    <div className='B-announcement-details-sub-box'>
                      <div className='B-announcement-input-block B-announcement-filter-block'>
                        <label>
                          <Select<AnnouncementEstateTypeEnum>
                            placeholder="Select type"
                            useValue={true}
                            value={form.announcementEstateType || form.announcementEstateType === 0 ? form.announcementEstateType : null}
                            options={AnnouncementEstateTypeDropdown()}
                            onChange={this.changeEstateType}
                            placeholderOpacity={true}
                            isAllList={true}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  {form.announcementEstateType === AnnouncementEstateTypeEnum.Residential ?
                    <div className='B-announcement-details-sub-block sub-width'>
                      <div className='B-announcement-details-sub-box'>
                        <p>Residential property:</p>
                      </div>
                      <div className='B-announcement-details-sub-box'>
                        <div className='B-announcement-input-block B-announcement-filter-block'>
                          <label>
                            <Select<AnnouncementResidentialTypeEnum>
                              placeholder="Select type"
                              useValue={true}
                              value={form.announcementResidentialType}
                              options={AnnouncementResidentialDropdown()}
                              onChange={this.changeResidentialType}
                              placeholderOpacity={true}
                              isAllList={true}
                              className={` ${!submited && !form.announcementResidentialType && form.announcementResidentialType !== 0 ? 'error-input' : ''}`}

                            />
                          </label>
                        </div>
                      </div>
                    </div> : null
                  }
                  {form.announcementEstateType === AnnouncementEstateTypeEnum.Commercial ?
                    <div className='B-announcement-details-sub-block sub-width'>
                      <div className='B-announcement-details-sub-box'>
                        <p>Commercial property:</p>
                      </div>
                      <div className='B-announcement-details-sub-box'>
                        <div className='B-announcement-input-block B-announcement-filter-block'>
                          <label>
                            <Select<AnnouncementCommercialTypeEnum>
                              placeholder="Select type"
                              useValue={true}
                              value={form.commercialType}
                              options={AnnouncementCommercialDropdown()}
                              onChange={this.changeCommercialType}
                              placeholderOpacity={true}
                              isAllList={true}
                              className={`G ${!submited && !form.commercialType && form.commercialType !== 0  ? 'error-input' : ''}`}


                            />
                          </label>
                        </div>
                      </div>
                    </div> : null
                  }
                  {form.announcementEstateType === AnnouncementEstateTypeEnum.Land ?
                    <div className='B-announcement-details-sub-block sub-width'>
                      <div className='B-announcement-details-sub-box'>

                        <p>Land property:</p>
                      </div>
                      <div className='B-announcement-details-sub-box'>
                        <div className='B-announcement-input-block B-announcement-filter-block'>
                          <label>
                            <Select<AnnouncementLandTypeEnum>
                              placeholder="Select type"
                              useValue={true}
                              value={form.landType}
                              options={AnnouncementCLandDropdown()}
                              onChange={this.changeLandType}
                              placeholderOpacity={true}
                              isAllList={true}
                              className={` ${!submited && !form.landType && form.landType !== 0   ? 'error-input' : ''}`}

                            />
                          </label>
                        </div>
                      </div>
                    </div> : null
                  }

                  {form.announcementEstateType !== AnnouncementEstateTypeEnum.Land ?
                    <>
                      {this.validationForBuildingAge()?
                        <div className='B-announcement-details-sub-block sub-width'>
                          <div className='B-announcement-details-sub-box'>
                            <p>Building age:</p>
                          </div>
                          <div className='B-announcement-details-sub-box'>
                            <div className='B-announcement-input-block B-announcement-filter-block'>
                              <label>
                                <Select<BuildingAgeEnum>
                                  // clear={true}
                                  useValue={true}
                                  value={form.buildingAge}
                                  options={AnnouncementBuildingAgeDropdown()}
                                  placeholder="Building age"
                                  onChange={this.changeBuildingAge}
                                  placeholderOpacity={true}
                                  isAllList={true}
                                />
                              </label>
                            </div>
                          </div>
                        </div>:null}




                      <div className='B-announcement-details-sub-block sub-width'>
                        <div className='B-announcement-details-sub-box'>
                          <p>Construction status:</p>
                        </div>
                        <div className='B-announcement-details-sub-box'>
                          <div className='B-announcement-input-block B-announcement-filter-block'>
                            <label>
                              <Select<ConstructionStatusEnum>
                                clear={true}
                                useValue={true}
                                value={form.constructionStatus}
                                options={AnnouncementConstructionStatusDropdown()}
                                placeholder="Construction status"
                                onChange={this.changeConstructionStatus}
                                placeholderOpacity={true}
                                isAllList={true}
                                className={`${!submited && !form.constructionStatus && form.constructionStatus !== 0 ? 'error-input' : ''}`}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className='B-announcement-details-sub-block sub-width'>
                        <div className='B-announcement-details-sub-box'>
                          <p>Type of ownership:</p>
                        </div>
                        <div className='B-announcement-details-sub-box'>
                          <div className='B-announcement-input-block B-announcement-filter-block'>
                            <label>
                              <Select<OwnershipEnum>
                                // clear={true}
                                useValue={true}
                                value={form.ownerShip}
                                options={AnnouncementOwnershipDropdown()}
                                placeholder="Type of ownership"
                                onChange={this.changeOwnership}
                                placeholderOpacity={true}
                                isAllList={true}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      {this.validationForFurnishedStatus()?
                        <div className='B-announcement-details-sub-block sub-width'>
                          <div className='B-announcement-details-sub-box'>
                            <p>Furnishing type:</p>
                          </div>
                          <div className='B-announcement-details-sub-box'>
                            <div className='B-announcement-input-block B-announcement-filter-block'>
                              <label>
                                <Select<FurnishedStatusEnum>
                                  clear={true}
                                  useValue={true}
                                  value={form.furnishingStatus}
                                  options={AnnouncementFurnishedStatusDropdown()}
                                  placeholder="Furnishing type"
                                  onChange={this.changeFurnishedStatus}
                                  placeholderOpacity={true}
                                  isAllList={true}

                                />
                              </label>
                            </div>
                          </div>
                        </div>: null}

                      {this.validationForAppartament()?
                        <div className='B-announcement-details-sub-block sub-width'>
                          <div className='B-announcement-details-sub-box'>
                            <p>Number of apartments: <span className="required-red">*</span></p>
                          </div>
                          <div className='B-announcement-details-sub-box'>
                            <div
                              className='B-announcement-input-block B-announcement-filter-block G-input-group-edit area-padding'>
                              <label>
                                <NumberInput
                                  name="numberOfAppartment"
                                  placeholder="Number of apartments"
                                  value={form.numberOfAppartment}
                                  className={`G-input I-none-full-input  ${!submited && !form.numberOfAppartment? 'error-input' : ''}`}
                                  onChange={this.changeNumberField}
                                />
                              </label>
                            </div>
                          </div>
                        </div>:null}

                      {form.announcementEstateType === AnnouncementEstateTypeEnum.Commercial && form.commercialType === AnnouncementCommercialTypeEnum.Showroom && form.announcementType === AnnouncementTypeEnum.Sale ?
                        <div className='B-announcement-details-sub-block sub-width'>
                          <div className='B-announcement-details-sub-box'>
                            <p>Number of shops: <span className="required-red">*</span></p>
                          </div>
                          <div className='B-announcement-details-sub-box'>
                            <div
                              className='B-announcement-input-block B-announcement-filter-block G-input-group-edit area-padding'>
                              <label>
                                <NumberInput
                                  name="numberOfShop"
                                  placeholder="Number of shops"
                                  value={form.numberOfShop}
                                  className={`G-input I-none-full-input  ${!submited && !form.numberOfShop? 'error-input' : ''}`}

                                  onChange={this.changeNumberField}
                                />
                              </label>
                            </div>
                          </div>
                        </div>: null}

                      {form.announcementEstateType === AnnouncementEstateTypeEnum.Residential && form.announcementResidentialType===AnnouncementResidentialTypeEnum.Tower ?
                        <div className='B-announcement-details-sub-block sub-width'>
                          <div className='B-announcement-details-sub-box'>
                            <p>Number of units: <span className="required-red">*</span></p>
                          </div>
                          <div className='B-announcement-details-sub-box'>
                            <div
                              className='B-announcement-input-block B-announcement-filter-block G-input-group-edit area-padding'>
                              <label>
                                <NumberInput
                                  name="numberOfUnits"
                                  placeholder="Number of units"
                                  value={form.numberOfUnits}
                                  className={`G-input I-none-full-input  ${!submited && !form.numberOfUnits? 'error-input' : ''}`}

                                  onChange={this.changeNumberField}
                                />
                              </label>
                            </div>
                          </div>
                        </div>: null}

                      {form.announcementEstateType === AnnouncementEstateTypeEnum.Residential && form.announcementResidentialType === AnnouncementResidentialTypeEnum.Compound && form.announcementType === AnnouncementTypeEnum.Sale ?
                        <div className='B-announcement-details-sub-block sub-width'>
                          <div className='B-announcement-details-sub-box'>
                            <p>Number of villas: <span className="required-red">*</span></p>
                          </div>
                          <div className='B-announcement-details-sub-box'>
                            <div
                              className='B-announcement-input-block B-announcement-filter-block G-input-group-edit area-padding'>
                              <label>
                                <NumberInput
                                  name="numberOfVilla"
                                  placeholder="Number of villas"
                                  value={form.numberOfVilla}
                                  className={`G-input I-none-full-input  ${!submited && !form.numberOfVilla ? 'error-input' : ''}`}

                                  onChange={this.changeNumberField}
                                />
                              </label>
                            </div>
                          </div>
                        </div>:null}

                      {this.validationForNumberOfFloor() ?
                        <div className='B-announcement-details-sub-block sub-width'>
                          <div className='B-announcement-details-sub-box'>
                            <p>Number of floors: <span className="required-red">*</span></p>
                          </div>
                          <div className='B-announcement-details-sub-box'>
                            <div
                              className='B-announcement-input-block B-announcement-filter-block G-input-group-edit area-padding'>

                              <label>
                                <NumberInput
                                  name="numberOfFloors"
                                  placeholder="Number of floors"
                                  value={form.numberOfFloors}
                                  className={`G-input I-none-full-input  ${!submited && (( form.announcementResidentialType !== AnnouncementResidentialTypeEnum.Tower && !form.numberOfFloors)
                                    || (form.announcementResidentialType === AnnouncementResidentialTypeEnum.Tower &&
                                      (!form.numberOfFloors || form.numberOfFloors<8))) ? 'error-input' : ''}`}

                                  onChange={this.changeNumberField}
                                />
                              </label>
                              {form.announcementResidentialType === AnnouncementResidentialTypeEnum.Tower ?    <h2 className='L-number-of-floors-8'>Floors should be 8+</h2>  : null }

                            </div>
                          </div>
                        </div>: null}

                      {form.announcementEstateType === AnnouncementEstateTypeEnum.Commercial && form.commercialType === AnnouncementCommercialTypeEnum.WareHouse && form.announcementType === AnnouncementTypeEnum.Sale ?
                        <div className='B-announcement-details-sub-block sub-width'>
                          <div className='B-announcement-details-sub-box'>
                            <p>Number of warehouse: <span className="required-red">*</span></p>
                          </div>
                          <div className='B-announcement-details-sub-box'>
                            <div
                              className='B-announcement-input-block B-announcement-filter-block G-input-group-edit area-padding'>
                              <label>
                                <NumberInput
                                  name="numberOfWareHouse"
                                  placeholder="Number of warehouse"
                                  value={form.numberOfWareHouse}
                                  className={`G-input I-none-full-input  ${!form.numberOfWareHouse ? 'error-input' : ''}`}

                                  onChange={this.changeNumberField}
                                />
                              </label>
                            </div>
                          </div>
                        </div>:null}
                    </>


                    : null}




                  {form.announcementEstateType !== AnnouncementEstateTypeEnum.Land ? null : <>
                    <div className='B-announcement-details-sub-block sub-width'>
                      <div className='B-announcement-details-sub-box'>
                        <p>Facade type:</p>
                      </div>
                      <div className='B-announcement-details-sub-box'>
                        <div
                          className='B-announcement-input-block B-announcement-filter-block G-input-group-edit area-padding'>
                          <label>
                            <Select<FacadeTypeEnum>
                              // clear={true}
                              useValue={true}
                              value={form.facadeType}
                              options={AnnouncementFacadeDropdown()}
                              placeholder="Select type"
                              onChange={this.changeFacadeType}
                              placeholderOpacity={true}
                              isAllList={true}



                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className='B-announcement-details-sub-block sub-width'>
                      <div className='B-announcement-details-sub-box'>
                        <p>Land category type:</p>
                      </div>
                      <div className='B-announcement-details-sub-box'>
                        <div
                          className='B-announcement-input-block B-announcement-filter-block G-input-group-edit area-padding'>
                          <label>
                            <Select<landCategoryEnum>
                              // clear={true}
                              useValue={true}
                              value={form.landCategory}
                              options={AnnouncementLandCategoryDropdown()}
                              placeholder='Land category'
                              onChange={this.changeLandCategory}
                              placeholderOpacity={true}
                              isAllList={true}
                              className={`${!submited && !form.landCategory && form.landCategory!==0 ? 'error-input' : ''}`}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className='B-announcement-details-sub-block sub-width'>
                      <div className='B-announcement-details-sub-box'>
                        <p>Land number: </p>
                      </div>
                      <div className='B-announcement-details-sub-box'>
                        <div
                          className='B-announcement-input-block B-announcement-filter-block G-input-group-edit area-padding'>
                          <label>
                            <NumberInput
                              name="landNumber"
                              placeholder="Land number"
                              value={form.landNumber}
                              className="G-input I-none-full-input"
                              onChange={this.changeNumberField}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className='B-announcement-details-sub-block sub-width'>
                      <div className='B-announcement-details-sub-box'>
                        <p>Plan number: </p>
                      </div>
                      <div className='B-announcement-details-sub-box'>
                        <div
                          className='B-announcement-input-block B-announcement-filter-block G-input-group-edit area-padding'>
                          <label>
                            <NumberInput
                              name="planNumber"
                              placeholder="Plan number"
                              value={form.planNumber}
                              className="G-input I-none-full-input"
                              onChange={this.changeNumberField}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className='B-announcement-details-sub-block sub-width'>
                      <div className='B-announcement-details-sub-box'>
                        <p>District number: </p>
                      </div>
                      <div className='B-announcement-details-sub-box'>
                        <div
                          className='B-announcement-input-block B-announcement-filter-block G-input-group-edit area-padding'>
                          <label>
                            <NumberInput
                              name="district"
                              placeholder="District number"
                              value={form.district}
                              className={`G-input I-none-full-input  ${!submited && !form.district  ? 'error-input' : ''}`}

                              onChange={this.changeNumberField}

                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className='B-announcement-details-sub-block sub-width'>
                      <div className='B-announcement-details-sub-box'>
                        <p>Street width: </p>
                      </div>
                      <div className='B-announcement-details-sub-box'>
                        <div
                          className='B-announcement-input-block B-announcement-filter-block G-input-group-edit area-padding'>
                          <label>
                            <NumberInput
                              name="streetWidth"
                              placeholder="Street width"
                              value={form.streetWidth}
                              className="G-input I-none-full-input"
                              onChange={this.changeNumberField}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                  </>}


                  <div className='B-announcement-details-sub-block sub-width'>
                    <div className='B-announcement-details-sub-box'>
                      <p>Area: <span className="required-red">*</span></p>
                    </div>
                    <div className='B-announcement-details-sub-box'>
                      <div
                        className='B-announcement-input-block B-announcement-filter-block G-input-group-edit area-padding'>
                        <label>
                          <NumberInput
                            name="area"
                            placeholder="Area"
                            value={form.area}
                            className={`G-input I-none-full-input  ${!submited && !form.area? 'error-input' : ''}`}
                            onChange={this.changeNumberField}
                          />
                          <span className="B-sup-title">m<sup>2</sup></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {this.validationForFloor()?
                  <div className='B-announcement-details-sub-block sub-width'>
                    <div className='B-announcement-details-sub-box'>
                      <p>floor: <span className="required-red">*</span></p>
                    </div>
                    <div className='B-announcement-details-sub-box'>
                      <div
                        className='B-announcement-input-block B-announcement-filter-block G-input-group-edit area-padding'>
                        <label>
                          <NumberInput
                            name="floor"
                            placeholder="Floor"
                            value={form.floor}
                            className={`G-input I-none-full-input  ${!submited && !form.floor? 'error-input' : ''}`}
                            max={200}

                            onChange={this.changeNumberField}
                          />
                          {/*<span className="B-sup-title">m<sup>2</sup></span>*/}
                        </label>
                      </div>
                    </div>
                  </div>: null}

                  {this.validationForSittingArea()?
                  <div className='B-announcement-details-sub-block sub-width'>
                    <div className='B-announcement-details-sub-box'>
                      <p>Sitting area: <span className="required-red">*</span></p>
                    </div>
                    <div className='B-announcement-details-sub-box'>
                      <div
                        className='B-announcement-input-block B-announcement-filter-block G-input-group-edit area-padding'>
                        <label>
                          <NumberInput
                            name="sittingArea"
                            max={10}
                            placeholder="Sitting area"
                            value={form.sittingArea}
                            className="G-input I-none-full-input"
                            onChange={this.changeNumberField}
                          />
                        </label>
                      </div>
                    </div>
                  </div>: null}


                  {this.validationBedAndBathroom() ?  <>
                    <div className='B-announcement-details-sub-block sub-width'>
                      <div className='B-announcement-details-sub-box'>
                        <p>Bedrooms:</p>
                      </div>
                      <div className='B-announcement-details-sub-box'>
                        <div
                          className='B-announcement-input-block B-announcement-filter-block G-input-group-edit area-padding'>
                          <label>
                            <NumberInput
                              name="bedroomCount"
                              placeholder="Bedroom count"
                              value={form.bedroomCount}
                              className="G-input I-none-full-input"
                              onChange={this.changeNumberField}
                              max= {100}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className='B-announcement-details-sub-block sub-width'>
                      <div className='B-announcement-details-sub-box'>
                        <p>Bathrooms:</p>
                      </div>
                      <div className='B-announcement-details-sub-box'>
                        <div
                          className='B-announcement-input-block B-announcement-filter-block G-input-group-edit area-padding'>
                          <label>
                            <NumberInput
                              name="bathroomCount"
                              placeholder="Bathroom count"
                              value={form.bathroomCount}
                              className="G-input I-none-full-input"
                              onChange={this.changeNumberField}
                              max= {100}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </>: null}

                </div>

              </div> : null}
            {!form ? null :
              <div className='B-announcement-details-info-components' style={{marginTop: '20px'}}>
                <div className="B-announcement-details-info-title"/>
                <div className="B-announcement-details-info-box">
                  {this.validationForFireSystem()?
                  <div className='B-announcement-details-sub-block sub-width'>
                    <div className='B-announcement-details-sub-box'/>

                    <div className='B-announcement-details-sub-box'>
                      <div
                        className='B-announcement-input-block B-announcement-filter-block G-input-group-edit area-padding'>
                        <div className="other-period B-some-props-for-edit">
                          <label className="G-flex-align-center G-mt-4">

                            <input type="checkbox"
                                   value={form.fireSystem}

                                   onChange={this.changeFireSystem}
                                   defaultChecked={form.fireSystem}/>
                            <span/>
                            <p className="G-fs-14 G-ml-1 G-w-100-P G-cursor prop-available">Fire system</p>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>:null}

                  {form.announcementEstateType === AnnouncementEstateTypeEnum.Commercial && form.commercialType === AnnouncementCommercialTypeEnum.WareHouse ? <>
                    <div className='B-announcement-details-sub-block sub-width'>
                      <div className='B-announcement-details-sub-box'/>
                      <div className='B-announcement-details-sub-box'>
                        <div
                          className='B-announcement-input-block B-announcement-filter-block G-input-group-edit area-padding'>
                          <div className="other-period B-some-props-for-edit">
                            <label className="G-flex-align-center G-mt-4">
                              <input type="checkbox"
                                     value={form.officeSpace}

                                     onChange={this.changeOfficeSpace}
                                     defaultChecked={form.officeSpace}/>
                              <span/>
                              <p className="G-fs-14 G-ml-1 G-w-100-P G-cursor prop-available">Office space</p>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='B-announcement-details-sub-block sub-width'>
                      <div className='B-announcement-details-sub-box'/>

                      <div className='B-announcement-details-sub-box'>
                        <div
                          className='B-announcement-input-block B-announcement-filter-block G-input-group-edit area-padding'>
                          <div className=" other-period B-some-props-for-edit">
                            <label className="G-flex-align-center G-mt-4">
                              <input type="checkbox"
                                     value={form.laborResidence}
                                     onChange={this.changeLaborResidence}
                                     defaultChecked={form.laborResidence}/>
                              <span/>
                              <p className="G-fs-14 G-ml-1 G-w-100-P G-cursor prop-available">Labor residence</p>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>:null}

                </div>


              </div>}


            {this.validationForFeatureList() ?
              <div className='B-announcement-details-info-components'>
                <div className='B-announcement-details-info-title'>
                  <h3>Features</h3>
                </div>
                <div className='B-announcement-details-info-box B-announcement-filter-block'>
                  <div className="G-input-group-edit padding-inputs-filter ">
                    <div className="G-input-group B-announcement-input-block ">
                      <MultiSelect<AnnouncementFeaturesTypeEnum>
                        value={form.features}
                        options={this.state.featureList}
                        placeholder='Select type'
                        onChange={this.changeFeatures}
                        clear={true}
                      />
                    </div>
                  </div>
                </div>
              </div> : null}
            <div className='B-announcement-details-info-components'>
              <div className='B-announcement-details-info-title'>
                <h3>Other documentations</h3>
              </div>
              <div className='B-announcement-details-info-box'>
                <div className='B-announcement-details-documentations'>
                  <div className='B-upload-file'>
                    <label className="I-G-uploader">
                      <input type="file" accept=".pdf, .doc, .docx, .xls, .xlsx"
                             onChange={this.uploadOtherDocuments} multiple={true} ref={this.fileForDocument}/>
                      <i className="B-plus"/>
                    </label>
                  </div>
                  {uploadsData.otherDocuments.map((item, index) =>
                    <div key={index} className='documents-box'>
                      <div className="P-added-document">
                        <a href={URL.createObjectURL(item)} className="added-file-icon"
                           style={{backgroundImage: `url("${pdfIcon}")`}} target="_blank"/>
                        <span className="delete-file"
                              onClick={() => this.deleteOtherDocument(index)}>&times;</span>

                      </div>
                    </div>
                  )}
                  {uploadsData.otherDocumentsFiles.map((item, index) =>
                    <div className='documents-box' key={index}>
                      <div className="P-added-document">
                        <a href={item.document}
                           download={item.document}
                           style={{backgroundImage: `url("${item.documentImage}")`}}
                           target="_blank"/>
                        <span className="delete-file"
                              onClick={() => this.deleteOtherDocument(index)}>&times;</span>

                      </div>
                    </div>)
                  }
                </div>
              </div>
            </div>
            <div className='B-announcement-details-info-components'>
              <div className='B-announcement-details-info-title'/>

              <div className='B-announcement-details-info-box'>
                <div className="B-edit-announcement-buttons ">
                  <div className="edit-reject-button btn">
                    <button onClick={this.toggleCancelModal}>Cancel</button>
                  </div>
                  <div className="edit-approve-button btn">

                    {this.state.isApproved?
                      <LoaderContent
                        loading={this.state.loading}
                        disabled={this.state.loading}
                        onClick={this.saveEditAnnouncement}
                      >Save and approve</LoaderContent>
                      :null

                      // this.state.isPending ?
                      //   <LoaderContent
                      //     loading={this.state.loading}
                      //     disabled={this.state.loading}
                      //     onClick={this.toggleApprovedModal}
                      //   >Save and approve</LoaderContent>
                      //   :
                      //   <LoaderContent
                      //     loading={this.state.loading}
                      //     disabled={this.state.loading}
                      //     onClick={this.approveInReview}
                      //   >Save and approve</LoaderContent>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.isOpenCancelModal ? <CancelModal onClose={this.toggleCancelModal}/> : null}
        {form && details ?
          this.state.isOpenApprovedModal && <ApproveModal
                DescriptionTitleEng={form.title || ''}
                DescriptionTextEng={form.description || ''}
                DescriptionTitleAr={form.titleArabian || ''}
                DescriptionAr={form.descriptionArabian || ''}
                id={details.id}
                onClose={this.toggleApprovedModal}/> : null}
      </div>
    ) : <PageLoader/>;
  }
}

export default AnnouncementEdit;
