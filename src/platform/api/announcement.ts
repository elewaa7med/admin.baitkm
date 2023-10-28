import Connection from '../services/connection';
import {
    AnnouncementEstateTypeEnum,
    AnnouncementFeaturesTypeEnum,
    AnnouncementRentType,
    AnnouncementResidentialTypeEnum,
    AnnouncementStatusEnum,
    AnnouncementTypeEnum,
    IAddSaveFilterRequestModel,
    IAnnouncementDetailsModel,
    IAnnouncementModifyRequestModel,
    IGetProfilePhoto,
    IPagingRes,
    IPhotoProduct,
    IResponse,
    SortByStatusReportType
} from '../constants/interfaces';

const controller = 'Announcement';
// Response Model

export interface IUserApproved {
    id: number,
    announcementType: AnnouncementTypeEnum,
    announcementEstateType: AnnouncementEstateTypeEnum,
    announcementRentType: AnnouncementRentType,
    announcementStatus: AnnouncementStatusEnum,
    announcementResidentialType: AnnouncementResidentialTypeEnum,
    address: string,
    lat: number,
    lng: number,
    price: string,
    area: number,
    bedroomCount: number,
    bathroomCount: number,
    features: string,
    title: string,
    description: string,
    userProfilePhoto: IGetProfilePhoto,
    userName: string,
    photo: IPhotoProduct
    createDate: string,
    isFavourite:boolean,
    userId:number,
    shareUrl:string,
}


export interface IUserFeatured {
    id: number;
    address: string;
    lat: number;
    long: number;
    title: string;
    price: string;
    userProfilePhoto: IGetProfilePhoto;
    userName: string;
    photo: IPhotoProduct;
    dateFrom: string;
    dateTo: string;
    isFavourite:boolean;
    userId:number,

}


export interface IPendingUsers {
    id: number;
    announcementType: AnnouncementTypeEnum;
    announcementEstateType: AnnouncementEstateTypeEnum;
    announcementStatus: AnnouncementStatusEnum;
    address: string;
    lat: number;
    long: number;
    title: string;
    price: string;
    userProfilePhoto: IGetProfilePhoto;
    userName: string;
    photo: IPhotoProduct;
    createDate: string;
    userId:number;
}



export interface IGetUserDetailsAnnouncement {
    id: number,
    announcementType: AnnouncementTypeEnum,
    announcementEstateType: AnnouncementEstateTypeEnum,
    announcementRentType: AnnouncementRentType,
    announcementStatus: AnnouncementStatusEnum,
    announcementResidentialType: AnnouncementResidentialTypeEnum,
    address: string,
    lat: number,
    long: number,
    price: string,
    area: number,
    bedroomCount: number,
    bathroomCount: number,
    features: string,
    title: string,
    description: string,
    userName: string,
    photo: IPhotoProduct
    createDate: string,
    isFavourite:boolean;
    publishDay:string;

};

export interface IGetAnnouncementDetails {
    id: number,
    announcementType: AnnouncementTypeEnum,
    announcementEstateType: AnnouncementEstateTypeEnum,
    announcementRentType: AnnouncementRentType,
    announcementStatus: AnnouncementStatusEnum,
    announcementResidentialType: AnnouncementResidentialTypeEnum,
    commercialType: AnnouncementCommercialTypeEnum;
    landType:AnnouncementLandTypeEnum;
    features: AnnouncementFeaturesTypeEnum[],
    address: string,
    price: string,
    area: string,
    bedroomCount: number,
    bathroomCount: number,
    title: string,
    description: string,
    titleArabian: string,
    descriptionArabian: string,
    userProfilePhoto: IPhotoProduct
    userId: number,
    userName: string,
    userPhone:number,
    subscriptions: [],
    userAnnouncementCount: number,
    photo:IPhotoProduct
    photos:IPhotoProduct[] ,
    documents: IDocument[],
    conversationId: number,
    isFavourite: boolean,
    remainingDay: number,
    publishDay:string,
    lat: number,
    lng: number,
    isOtherPeriod:boolean ,
    shareUrl: string,
    announcementRejectInfos:IAnnouncementRejectInfosEnum[],
    isTop:boolean,
    floor: number;
    constructionStatus: ConstructionStatusEnum
    ownerShip: OwnershipEnum;
    buildingAge: BuildingAgeEnum;
    furnishingStatus: FurnishedStatusEnum;
    saleType:SaleTypeEnum;
    sittingArea:number,
    country:string,
    city:string
    numberOfAppartment?: number;
    numberOfFloors?: number;
    numberOfVilla?: number;
    numberOfShop?: number;
    numberOfUnits?: number;
    district?: number;

    fireSystem?: any;
    numberOfWareHouse?: number;
    officeSpace?: any;
    laborResidence?: any
    facadeType?: FacadeTypeEnum;
    landNumber?: number;
    planNumber?: number;
    streetWidth?: number;
    landCategory?:landCategoryEnum;

}

export enum landCategoryEnum{
    Street1 = 0,
    Street2,
    Street3,
    Street4,
    'Streets ' = landCategoryEnum.Street1 ,
    'Streets 2 ' = landCategoryEnum.Street2,
    'Streets 3 ' = landCategoryEnum.Street3,
    'Streets  4' = landCategoryEnum.Street4,

}

export enum AnnouncementLandTypeEnum {
    AgriculturalLands,
    IndustrialLands,
    CommercialLands,
    ResidentialLands,
    "Agricultural lands" = AnnouncementLandTypeEnum.AgriculturalLands,
    "Industrial lands" = AnnouncementLandTypeEnum.IndustrialLands,
    "Commercial lands" = AnnouncementLandTypeEnum.CommercialLands,
    "Residential lands" = AnnouncementLandTypeEnum.ResidentialLands
};

export enum AnnouncementLandTypeEnumArabic {
    AgriculturalLands,
    IndustrialLands,
    CommercialLands,
    ResidentialLands,
    "أراضي صناعية" = AnnouncementLandTypeEnum.AgriculturalLands,
    "أراضي زراعية" = AnnouncementLandTypeEnum.IndustrialLands,
    "أراضي سكنية" = AnnouncementLandTypeEnum.CommercialLands,
    "راضي تجارية" = AnnouncementLandTypeEnum.ResidentialLands
};



export enum AnnouncementCommercialTypeEnum {
    Showroom,
    Shop,
    OfficeSpace,
    WareHouse,
    "Showroom " = AnnouncementCommercialTypeEnum.Showroom,
    "Shop " = AnnouncementCommercialTypeEnum.Shop,
    "Office space" = AnnouncementCommercialTypeEnum.OfficeSpace,
    "warehouse " = AnnouncementCommercialTypeEnum.WareHouse,

};

export enum AnnouncementCommercialTypeEnumArabic {
    Showroom,
    Shop,
    OfficeSpace,
    WareHouse,
    "مكاتب " = AnnouncementCommercialTypeEnum.Showroom,
    " مساحة مكتب" = AnnouncementCommercialTypeEnum.Shop,
    "مساحة مكتب" = AnnouncementCommercialTypeEnum.OfficeSpace,
    "مخزن " = AnnouncementCommercialTypeEnum.WareHouse,

};


export enum ConstructionStatusEnum {
    UnderConstruction,
    ReadyToMove,
    "Under construction" = ConstructionStatusEnum.UnderConstruction,
    "Ready to move" = ConstructionStatusEnum.ReadyToMove
}


export enum OwnershipEnum {
    Freehold,
    Leasehold,
    Poa,
    "Freehold " = OwnershipEnum.Freehold,
    "Leasehold " = OwnershipEnum.Leasehold,
    "Poa " = OwnershipEnum.Poa,
}

export enum BuildingAgeEnum {
    Age1,
    Age2,
    Age3,
    Age4,
    Age5,
    '0-1 Year' = BuildingAgeEnum.Age1,
    '1-2 Year' = BuildingAgeEnum.Age2,
    '2-5 Year' = BuildingAgeEnum.Age3,
    '5+ Year' = BuildingAgeEnum.Age4,
    'Any' = BuildingAgeEnum.Age5,
}

export enum FurnishedStatusEnum {
    Furnished,
    SemiFurnished,
    Unfurnished,
    "Furnished " = FurnishedStatusEnum.Furnished,
    "Semi furnished " = FurnishedStatusEnum.SemiFurnished,
    "Unfurnished " = FurnishedStatusEnum.Unfurnished,

}

export enum FacadeTypeEnum {
    WaterFront,
    North,
    East,
    West,
    South,
    NorthEast,
    SouthEast,
    SouthWest,
    NorthWest,
    "Water Front" = FacadeTypeEnum.WaterFront,
    "North " = FacadeTypeEnum.North,
    "East " = FacadeTypeEnum.East,
    "West " = FacadeTypeEnum.West,
    "South " = FacadeTypeEnum.South,
    "North East" = FacadeTypeEnum.NorthEast,
    "South East" = FacadeTypeEnum.SouthEast,
    "South West" = FacadeTypeEnum.SouthWest,
    "North West" = FacadeTypeEnum.NorthWest,

}


export enum SaleTypeEnum {
    NewType,
    Resale,
    Both,
    'New ' = SaleTypeEnum.NewType,
    'Resale ' = SaleTypeEnum.Resale,
    'Both ' = SaleTypeEnum.Both
}


export interface IAnnouncementRejectInfosEnum {
    announcementRejectDate:string;
    announcementRejectReason: string;
    description?: string,

}
export interface IDocument {
    document:string,
    documentImage:string,
}

export interface IGetReportsList {
    id: number,
    announcementId: number,
    description: string,
    createDate: string,
    price: string,
    address: string,
    title: string,
    announcementStatus: AnnouncementStatusEnum,
    reportStatus: AnnouncementStatusEnum,
    announcementRentType: AnnouncementRentType,
    userProfilePhoto: IGetProfilePhoto,
    userId: number,
    userName: string,
    photo: IGetProfilePhoto,
    shareUrl: string | null
}

export interface IGetDashboardAnnouncementList {
    pendingListModel: IPendingUsers[],
    activeAnnouncementCount: number,
    featuredAnnouncementCount: number,
    rejectedAnnouncements : number,
    expiredAnnouncements: number,
    isDraftAnnouncements: number,
    unreadSupportMessagesCount: number,
    newReportings: number,
    pendingCount: number;
    androidCount: number,
    iosCount: number,
    webCount: number,
    userCount:number
    userCreateAnnouncemtsCount: number,
    pendingReportingCount:number,
    statistics:IStatisticsData,

}

export interface IStatisticsData {
    day:string;
    duration:number;
    userCount:number;
}
export enum AnnouncementRejectStatus {
  Approve = 1,
  Reject,
  RejectReason,
  OtherReason,
  Available,
  NewNotification


}
// export enum AnnouncementRejectStatusView {
//     "Information is not complete, please provide more details of the property"= AnnouncementRejectStatus.Reason1,
//     "Please upload clear pictures and/or documents of the property" = AnnouncementRejectStatus.Reason2,
//     "Please amend location of the property in the map to match information entered" = AnnouncementRejectStatus.Reason3,
// }

export interface IAnnouncementRejectionType {
    id: number,
    description: string,
}

export interface IRejectAnnouncement {
    description?: string,
    announcementRejectStatus: AnnouncementRejectStatus
}


export interface IDashboardAnnouncementStatisticModel {
    saleCount: number,
    rentCount: number,
    residentalCount: number,
    comercialCount: number,
    landCount: number
}

export interface IDashboardAnnouncementStatisticRM {
    startDate: Date | null,
    endDate: Date | null,
}

class AnnouncementController {

    public static DashboardAnnouncementStatistic = async (data: IDashboardAnnouncementStatisticRM): Promise<IResponse<IDashboardAnnouncementStatisticModel>> => {
        const result = await Connection.POST({
            body: data,
            action: `DashboardAnnouncementStatistic`,
            controller,
        });

        return result;
    }


    public static GetAdminAnnouncementList = async (data: { page: number, count: number }): Promise<IPagingRes<IUserApproved[]>> => {
        const result = await Connection.POST<object>({
            body: data,
            action: `ApprovedListAdmin`,
            controller,
        });

        return result;
    }


    public static GetFeaturedListAdminList = async (data: { page: number, count: number }): Promise<IPagingRes<IUserFeatured>> => {
        const result = await Connection.POST({
            body: data,
            action: `FeaturedListAdmin`,
            controller,
        });

        return result;
    }
    public static GetRejectedListAdminList = async (data: { page: number, count: number }): Promise<IPagingRes<IUserFeatured>> => {
        const result = await Connection.POST({
            body: data,
            action: `RejectListAdmin`,
            controller,
        });

        return result;
    }
    public static GetAdminPemdingList = async (data: { page: number, count: number }): Promise<IPagingRes<IPendingUsers>> => {
        const result = await Connection.POST({
            body: data,
            action: `PendingListAdmin`,
            controller,
        });

        return result;
    }

    public static GetUserList = async (data: { page: number, count: number }, id: string): Promise<IResponse<IPagingRes<IGetUserDetailsAnnouncement>>> => {
        const result = await Connection.POST<object>({
            body: data,
            action: `MyAnnouncementListByUserId/${id}`,
            controller,
        });

        return result;
    }
    public static GetAnnouncementDetails = async (id: string): Promise<IResponse<IGetAnnouncementDetails>> => {
        const result = await Connection.GET({
            action: `MyAnnouncementDetails/${id}`,
            controller,
        });

        return result;
    }
    public static GetAnnouncementById = async (id: number): Promise<IResponse<IUserApproved[]>> => {
        const result = await Connection.GET({
            action: `AnnouncementSearch/${id}`,
            controller,
        });

        return result;
    }

    public static GetDashboardAnnouncementList = async (): Promise<IResponse<IGetDashboardAnnouncementList>> => {
        const result = await Connection.GET({
            action: `DashboardPendingListAdmin`,
            controller,
        });

        return result;
    }

    public static GetReportAllList = async (data: { page: number, count: number }): Promise<IResponse<IPagingRes<IGetReportsList>>> => {
        const result = await Connection.POST<object>({
            body: data,
            action: `AnnouncementReportList`,
            controller,
        });

        return result;
    }

    public static GetReportListByEnum = async (data: { page: number, count: number, reportAnnouncementStatus: SortByStatusReportType | null }): Promise<IResponse<IPagingRes<IGetReportsList>>> => {
        const result = await Connection.POST({
            body: data,
            action: `FilterByAnnouncementReportStatus`,
            controller,
        });

        return result;
    }


    public static RejectAnnouncement = async (data: {
      id:number | null,
      DescriptionEnglish?: string,
      DescriptionArabian?: string,
      notificationType: AnnouncementRejectStatus
    }, id: number): Promise<IResponse<boolean>> => {
        const result = await Connection.PUT<object>({
            body: data,
            action: `RejectAnnouncement/${id}`,
            controller,
        });

        return result;
    }



    public static ApproveAnnouncement = async (data: {
        title: string,
        description: string,
        titleArabian: string,
        descriptionArabian: string,
        defaultDay: number,
        day: number,

    },
        id: number): Promise<IResponse<boolean>> => {
        const result = await Connection.PUT<object>({
            body: data,
            action: `ApproveAnnouncement/${id}`,
            controller,
        });

        return result;
    }


    public static sentFavorite = async (data: {
        day:number,
    },announcementId: number): Promise<IResponse<boolean>> => {
        const result = await Connection.PUT<object>({
            body: data,
            action: `AddToTopList/${announcementId}`,
            controller,
        });

        return result;
    }

    public static RemoveFavorite = async (announcementId: number): Promise<IResponse<boolean>> => {
        const result = await Connection.PUT<object>({
            body: {},
            action: `RemoveFromTopList/${announcementId}`,
            controller,
        });

        return result;
    }

    public static approveReport = async (data:{announcementId: number}): Promise<IResponse<boolean>> => {
        const result = await Connection.PUT<object>({
            body: data,
            action: `ApproveReport/${data.announcementId}`,
            controller,
        });

        return result;
    }
    public static rejectReport = async (data:{announcementId: number}): Promise<IResponse<boolean>> => {
        const result = await Connection.PUT<object>({
            body: data,
            action: `RejectReport/${data.announcementId}`,
            controller,
        });

        return result;
    }
    public static FilterAnnouncement = async (data: { page: number, count: number, announcementFilter:IAddSaveFilterRequestModel }): Promise<IResponse<IPagingRes<IUserApproved>>> => {
        const result = await Connection.POST({
            body: data,
            action: `AnnouncementFilter`,
            controller,
        });

        return result;
    };
    public static ReportFilter = async (data: { page: number, count: number,reportAnnouncementStatus:AnnouncementStatusEnum | null, announcementFilter:IAddSaveFilterRequestModel }): Promise<IResponse<IPagingRes<IGetReportsList[]>>> => {
        const result = await Connection.POST({
            body: data,
            action: `ReportFilter`,
            controller,
        });

        return result;
    }

    public static GetDashboardStatistic = async (): Promise<IResponse<IStatisticsData>> => {
        const result = await Connection.GET({
            action: `DashboardStatistic`,
            controller,
        });
        return result;
    }
    public static GetAnnouncementDetailsForEdit = async (announcementId:string): Promise<IResponse<IAnnouncementDetailsModel>> => {
        const result = await Connection.GET({
            action: `MyAnnouncementDetails/${announcementId}`,
            controller,
        });
        return result;
    }



    public static UploadBasePhoto = (id: number, form: FormData): Promise<IResponse<IPhotoProduct>> => {
        const result = Connection.PUT({
            body: form,
            action: `UploadAnnouncementBasePhoto/${id}`,
            controller,
            noneJSONBody: true,
        });

        return result;
    };
    public static UploadOtherPhotos = (form: FormData): Promise<IResponse<boolean>> => {
        const result = Connection.PUT({
            body: form,
            action: `UploadOtherPhotos`,
            controller,
            noneJSONBody: true,
        });

        return result;
    };

    public static UploadOtherDocuments = (form: FormData): Promise<IResponse<boolean>> => {
        const result = Connection.PUT({
            body: form,
            action: `UploadOtherDocumentation`,
            controller,
            noneJSONBody: true,
        });

        return result;
    };

    public static MyAnnouncementEdit = (id: number, form: IAnnouncementModifyRequestModel): Promise<IResponse<number>> => {
        const result = Connection.PUT({
            body: form,
            action: `Edit/${id}`,
            controller,
        });

        return result;
    };

  public static GetAnnouncementRejectsType = async (): Promise<IResponse<IAnnouncementRejectionType[]>> => {
    const result = await Connection.GET({
      action: `GetAnnouncementRejectsType`,
      controller,
    });
    return result;
  }
    public static FilterById = async (announcementId:number): Promise<IResponse<IPagingRes<IUserApproved>>> => {
        const result = await Connection.GET({
            action: `FilterById/${announcementId}`,
            controller,
        });
        return result;
    }

};

export default AnnouncementController;


