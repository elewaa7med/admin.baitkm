import * as React from 'react';

import {TableCellType} from './types';
import {DifficultyLevelEnum, GameTypeEnum, QuestionStateEnum} from './enums';
import {
  AnnouncementCommercialTypeEnum, AnnouncementLandTypeEnum,
  BuildingAgeEnum,
  ConstructionStatusEnum, FacadeTypeEnum,
  FurnishedStatusEnum,
  IDocument,
  IStatisticsData, landCategoryEnum,
  OwnershipEnum,
  SaleTypeEnum
} from "../api/announcement";

export interface IResponse<Data> {
  data: Data;
  messages: Array<{
    key: number;
    value: string;
  }>;
  success: boolean;
};

export interface IPaging {
  page: number;
  count: number;


}

export interface IPagingRes<Data> {
  data: Data[];
  // announcementFilter?:Data[]|null;
  announcementResponseFilter?:Data[]|null;
  page: number;
  count: number;
  activePage: number,
  itemCount: number,
  pageCount: number,
  dateFrom?:string,
  modelFilterCount?:number
}

export interface IRoute {
  path: string;
  component: React.ComponentClass;
  isPrivate: boolean;
};

export interface ISidebar {
  name: string;
  icon: string;
  path: string;
};

export interface IBreadcrumb {
  label: string;
  path?: string;
}

export interface IRequest<Body extends object> {
  controller: string;
  action: string;
  body: Body;
  query?: object;
  noneJSONBody?: boolean;
};

export interface IRequestNoBody {
  controller: string;
  action: string;
  query?: object;
  noneJSONBody?: boolean;
};

export interface IPaginationChange { selected: number };

export interface IUser {
  id: number;
  imagePath: string | null;
  phoneNumber: string | null;
  announcements: number | null;
  userName: string | null;
  email: string | null;
  location: string | null;
  status: string | null;
  earnedMoney: number;
  // registrationDate: string;
  // participatedGamesCount: number;
};



export interface IAddSaveFilterRequestModel {
  search:string,
  address: string,
  announcementType: AnnouncementTypeEnum|null,
  announcementEstateType: AnnouncementEstateTypeEnum|null,
  announcementResidentialType: AnnouncementResidentialTypeEnum|null,
  announcementRentType: AnnouncementRentType|null,
  features:AnnouncementFeaturesTypeEnum[],
    commercialType: AnnouncementCommercialTypeEnum| null;
    landType:AnnouncementLandTypeEnum| null;
  announcementStatus:AnnouncementStatusEnum |null,
  priceFrom: number,
  priceTo: number,
  minArea: number,
  maxArea: number,
  userName: string,
  dateFrom: any |null,
  dateTo: any |null
  bedroomCount: number,
  bathroomCount: number,
  reportAnnouncementStatus?:AnnouncementStatusEnum | null,
    floor: number;
    constructionStatus: ConstructionStatusEnum| null
    ownerShip: OwnershipEnum| null;
    buildingAge: BuildingAgeEnum| null;
    furnishingStatus: FurnishedStatusEnum| null;
    saleType:SaleTypeEnum| null;
    maxSittingArea:number,
    minSittingArea:number,
    country:string,
    city:string,
    countryId?:number|null,
    cityId?:number|null,
  announcementId?:number

}



export interface ITableColumnConfig<Data extends object> {
  cell(row: Data, index: number): TableCellType;
  wrapperClass?(row: Data, index?: number): string;
  className?: string;
  name?: string | number | HTMLElement | React.ReactNode;
  style?: React.CSSProperties;
};

export interface IDropdownOption<Value> {
  name: string | number | React.ReactNode | HTMLElement;
  value: Value;
};

export interface INotification {
  id: number;
  title: string;
  body: string;
  addedDate: string;
  sendingDate: string;
};

export interface IGame {
  id: number;
  prize: number;
  budget: number;
  prizePerUser: number;
  startDate: string;
  startDateTime: string;
  winningUsersCount: number;
  participantCount: number;
  isLive: boolean;
  gameModeType: GameTypeEnum;
};

export interface IQuestion {
  id: number;
  answers: IQuestionAnswer[];
  correctAnswer: number;
  categoryName?: string;
  categoryId: number;
  difficultyLevel: number;
  status: QuestionStateEnum;
  questionBody: string;
};

export interface IQuestionAnalytics {
  question: string;
  difficultyLevel: DifficultyLevelEnum;
  passedUsers: number;
  rightAnswerPrecent: number;
};


export interface IUserQuestion extends IQuestion { person: IUser };

export interface IQuestionAnswer {
  answer: string;
  isRight: boolean;
};

export interface ICategory {
  categoryId: number;
  name: string;
  shortCode: string;
  questionCount: number;
  usedQuestionCount: number;
};

export interface ISignalQuestionStatistics {
  id: number;
  question: string;
  answers: Array<{
    id: number;
    answer: string;
    count: number;
    isRight: boolean;
  }>;
};

export interface IStreamComment extends IUser {
  comment: string;
  username: string;
};

export interface ISignalQuestion {
  id: number;
  question: string;
  answers: Array<{
    id: number;
    answer: string;
  }>;
};

export interface ICurrentGameQuestion {
  id: number;
  question: string;
  isLast: boolean;
  orderCriteria: number;
  answers: Array<{
    id: number;
    answer: string;
    isRight: boolean;
  }>;
};

export interface ICanvas extends HTMLCanvasElement { captureStream(FRAME_RATE?: number): MediaStream }




export interface IGetProfilePhoto {
  photo: string,
  photoBlur: string
}

export interface IPhotoProduct {
  photo: string,
  photoBlur: string,
  thumbNail?:string
}

export enum AnnouncementTypeEnum {
  Sale,
  Rent,
  'Sale ' = AnnouncementTypeEnum.Sale,
  'Rent ' = AnnouncementTypeEnum.Rent,
}


// export enum AnnouncementTypeViewEnum {
//   'Sale' = AnnouncementTypeEnum.Sale,
//   'Rent' = AnnouncementTypeEnum.Rent,
// }

export enum AnnouncementDetailsTypeViewEnum {
  'Sale' = AnnouncementTypeEnum.Sale,
  'Monthly rental' = AnnouncementTypeEnum.Rent,
}
export enum AnnouncementEstateTypeEnum {
  Residential,
  Commercial,
  Land,
  'Residential ' = AnnouncementEstateTypeEnum.Residential,
  'Commercial '  = AnnouncementEstateTypeEnum.Commercial,
  'Land ' = AnnouncementEstateTypeEnum.Land,
}

// export enum AnnouncementEstateTypeViewEnum {
//
//
// }
export enum AnnouncementStatusEnum {
    Pending,
    Accepted,
    Rejected,
    Hidden,
    Expired,
    InReview,
    Featured,
    NotApproved


}

export enum SortByStatusReportType {
  Pending,
  Accepted,
  Rejected,

}

export enum AnnouncementStatusViewEnum {
  'Pending' = AnnouncementStatusEnum.Pending,
  'Accepted' = AnnouncementStatusEnum.Accepted,
  'Rejected' = AnnouncementStatusEnum.Rejected,
  'Hidden' = AnnouncementStatusEnum.Hidden,
  'Expired' = AnnouncementStatusEnum.Expired,
  'In Review' = AnnouncementStatusEnum.InReview,

}
export enum ReportsStatusForViewEnum {
  All,
  Pending,
  Accepted,
  Rejected,

}
export enum ReportsStatusViewEnum {
  'All' = ReportsStatusForViewEnum.All,
  'Pending' = ReportsStatusForViewEnum.Pending,
  'Accepted' = ReportsStatusForViewEnum.Accepted,
  'Rejected' = ReportsStatusForViewEnum.Rejected,

}

export enum ColorsStatus {
  '#CE002A' = AnnouncementStatusEnum.Rejected,
  '#7A7A7A' = AnnouncementStatusEnum.Pending,
  '#000000' = AnnouncementStatusEnum.Accepted,
}
export enum ColorsStatusReports {
  '#7A7A7A' = SortByStatusReportType.Pending,
  '#000000' = SortByStatusReportType.Accepted,
  '#CE002A' = SortByStatusReportType.Rejected,
}



//  interface for user-details

export interface IUserDetails {
  activeAnnouncementCount: number
  city: string;
  cityId: number;
  dateOfBirth: string;
  email: string;
  fullName: string;
  hiddenAnnouncementCount: number;
  id: number;
  isLocal: boolean;
  osType: OsType;
  phone: string;
  phoneCode: string;
  profilePhoto: IGetProfilePhoto;
  unreadConversationCount: number;
  isBlocked:boolean;
  activities:IStatisticsData[]
  cityByIpAddress:string,
  countryByIpAddress:string,
  ipAddress:string,
}

export enum AnnouncementFeaturesTypeEnum {
    Parking,
    SharedGym,
    Garden,
    PrivateSwimmingPool,
    PlayGround,
    PetsAllowed,
    Kitchen,
    SharedSwimmingPool,
    Security,
    Balcony,
    PrivateGym,
    Elevator,
    AirConditioning,
    CentralAirConditioning,
    LaundryRoom,
    DriverRoom,
    DiningRoom,
    MaidRoom,
    CoffeeShops,
    Extension,
    HeatingSystem,
    LivingRoom,
    BusShuttle,
    KinderGarden,
    SuperMarket,

    "Parking "=AnnouncementFeaturesTypeEnum.Parking,
    "Shared gym"=AnnouncementFeaturesTypeEnum.SharedGym,
    "Garden "=AnnouncementFeaturesTypeEnum.Garden,
    "Private swimming pool"=AnnouncementFeaturesTypeEnum.PrivateSwimmingPool,
    "Play ground"=AnnouncementFeaturesTypeEnum.PlayGround,
    "Pets allowed"=AnnouncementFeaturesTypeEnum.PetsAllowed,
    "Kitchen "=AnnouncementFeaturesTypeEnum.Kitchen,
    "Shared swimming pool"=AnnouncementFeaturesTypeEnum.SharedSwimmingPool,
    "Security "=AnnouncementFeaturesTypeEnum.Security,
    "Balcony "=AnnouncementFeaturesTypeEnum.Balcony,
    "Private gym"=AnnouncementFeaturesTypeEnum.PrivateGym,
    "Elevator "=AnnouncementFeaturesTypeEnum.Elevator,
    "Air Conditioning"=AnnouncementFeaturesTypeEnum.AirConditioning,
    "Central Air Conditioning"=AnnouncementFeaturesTypeEnum.CentralAirConditioning,
    "Laundry room"=AnnouncementFeaturesTypeEnum.LaundryRoom,
    "Driver room"=AnnouncementFeaturesTypeEnum.DriverRoom,
    "Dining room"=AnnouncementFeaturesTypeEnum.DiningRoom,
    "Maid room"=AnnouncementFeaturesTypeEnum.MaidRoom,
    "Coffee shops"=AnnouncementFeaturesTypeEnum.CoffeeShops,
    "Extension "=AnnouncementFeaturesTypeEnum.Extension,
    "Heating system"=AnnouncementFeaturesTypeEnum.HeatingSystem,
    "Living room"=AnnouncementFeaturesTypeEnum.LivingRoom,
    "Bus shuttle"=AnnouncementFeaturesTypeEnum.BusShuttle,
    "Kinder garten"=AnnouncementFeaturesTypeEnum.KinderGarden,
    "Super market"=AnnouncementFeaturesTypeEnum.SuperMarket

}

// export enum AnnouncementFeaturesTypeViewEnum {
//   "Parking Area" = AnnouncementFeaturesTypeEnum.ParkingArea,
//   "Private Pool" = AnnouncementFeaturesTypeEnum.PrivatePool,
//   "Shared Pool" = AnnouncementFeaturesTypeEnum.SharedPool,
//   "Private Gym" = AnnouncementFeaturesTypeEnum.PrivateGym,
//   "Shared Gym" = AnnouncementFeaturesTypeEnum.SharedGym,
//   "Sports court" = AnnouncementFeaturesTypeEnum.SportsCourt,
//   "Security features" = AnnouncementFeaturesTypeEnum.SecurityFeatures,
//   "Elevator" = AnnouncementFeaturesTypeEnum.Elevator,
//   "Garden" = AnnouncementFeaturesTypeEnum.Garden,
//   "Pets allowed" = AnnouncementFeaturesTypeEnum.PetsAllowed,
//   "Central Heating" = AnnouncementFeaturesTypeEnum.CentralHeat,
//   "Air Conditioning" = AnnouncementFeaturesTypeEnum.AirConditioning,
//
//
//
// }

export enum AnnouncementRentType{
  Daily,
  Weekly,
  Monthly,
  Yearly,
  'Daily '=AnnouncementRentType.Daily,
  'Weekly '=AnnouncementRentType.Weekly,
  'Monthly '=AnnouncementRentType.Monthly,
  'Yearly '=AnnouncementRentType.Yearly
}
// export enum AnnouncementRentTypeView{
//   'Daily rental'=AnnouncementRentType.Daily,
//   'Weekly rental'=AnnouncementRentType.Weekly,
//   'Monthly rental'=AnnouncementRentType.Monthly,
//   'Yearly rental'=AnnouncementRentType.Yearly
// }
export enum AnnouncementRentTypeViewShort{
  'D'=AnnouncementRentType.Daily,
  'W'=AnnouncementRentType.Weekly,
  'M'=AnnouncementRentType.Monthly,
  'Y'=AnnouncementRentType.Yearly
}
export enum AnnouncementResidentialTypeEnum {
    Building,
    Apartments,
    Villa,
    Duplex,
    Compound,
    Chalet,
    Tower,
    Studio,
    FarmHouse,
    "Building " = AnnouncementResidentialTypeEnum.Building,
    "Apartments " = AnnouncementResidentialTypeEnum.Apartments,
    "Villa " = AnnouncementResidentialTypeEnum.Villa,
    "Duplex " = AnnouncementResidentialTypeEnum.Duplex,
    "Compound " = AnnouncementResidentialTypeEnum.Compound,
    "Chalet " = AnnouncementResidentialTypeEnum.Chalet,
    "Tower " = AnnouncementResidentialTypeEnum.Tower,
    "Studio " = AnnouncementResidentialTypeEnum.Studio,
    "Farm house" = AnnouncementResidentialTypeEnum.FarmHouse,
}



export enum AnnouncementResidentialTypeEnumArabian {
  Building,
  Apartments,
  Villa,
  Duplex,
  Compound,
  Chalet,
  Tower,
  Studio,
  FarmHouse,
  "بناية " = AnnouncementResidentialTypeEnum.Building,
  "شقة " = AnnouncementResidentialTypeEnum.Apartments,
  "ڤيلا " = AnnouncementResidentialTypeEnum.Villa,
  "دوبلكس " = AnnouncementResidentialTypeEnum.Duplex,
  "مجمع سكني " = AnnouncementResidentialTypeEnum.Compound,
  "شاليه " = AnnouncementResidentialTypeEnum.Chalet,
  "برج " = AnnouncementResidentialTypeEnum.Tower,
  "ستوديو " = AnnouncementResidentialTypeEnum.Studio,
  "'نزل مزرعة" = AnnouncementResidentialTypeEnum.FarmHouse,
}



// export enum AnnouncementResidentialTypeViewEnum {
//     "Building" = AnnouncementResidentialTypeEnum.Building,
//     "Apartments" = AnnouncementResidentialTypeEnum.Apartments,
//     "Villa" = AnnouncementResidentialTypeEnum.Villa,
//     "Duplex" = AnnouncementResidentialTypeEnum.Duplex,
//     "Compound" = AnnouncementResidentialTypeEnum.Compound,
//     "Chalet" = AnnouncementResidentialTypeEnum.Chalet,
//     "Tower" = AnnouncementResidentialTypeEnum.Tower,
//     "Studio " = AnnouncementResidentialTypeEnum.Studio,
//     "Farm house" = AnnouncementResidentialTypeEnum.FarmHouse,
// }

export enum AnnouncementPhotoType {
  OtherImages,
  OtherDocumentations
}


export enum OsType
   {
       Android,
       Ios,
       Web
   }


export enum OsTypeView
{
    'Android'=OsType.Android,
    'Ios'=OsType.Ios,
    'Web'=OsType.Web
}

export interface IAnnouncementDetailsModel {
    address: string;
    announcementEstateType: AnnouncementEstateTypeEnum;
    announcementRentType: AnnouncementRentType;
    announcementResidentialType: AnnouncementResidentialTypeEnum;
    announcementStatus: AnnouncementStatusEnum;
    announcementType: AnnouncementTypeEnum;
    commercialType: AnnouncementCommercialTypeEnum;
    landType:AnnouncementLandTypeEnum;
    area: number;
    bathroomCount: number;
    bedroomCount: number;
    conversationId: number;
    description: string;
    descriptionArabian: string;
    documents: IDocument[];
    features: AnnouncementFeaturesTypeEnum[];
    id: number;
    isFavourite: boolean;
    isOtherPeriod: boolean;
    lat: number;
    lng: number;
    photo: IPhotoProduct;
    photos: IPhotoProduct[];
    price: string;
    publishDay: string;
    remainingDay: number;
    shareUrl: string;
    title: string;
    titleArabian: string;
    userAnnouncementCount: number;
    userId: number;
    userName: string;
    userPhone: string;
    userProfilePhoto: IPhotoProduct,
    floor: number;
    constructionStatus: ConstructionStatusEnum
    ownerShip: OwnershipEnum;
    buildingAge: BuildingAgeEnum;
    furnishingStatus: FurnishedStatusEnum;
    saleType:SaleTypeEnum;
    sittingArea:number,
    country:string,
    city:string,
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
  landCategory?:landCategoryEnum
}

export interface IFeatureListFilter {
    label: any,
    value: number,
    estateType: {
        residentialType?: AnnouncementResidentialTypeEnum[],
        commercialType?: AnnouncementCommercialTypeEnum[]
    }
}

export interface IAnnouncementModifyRequestModel {
    announcementType?: AnnouncementTypeEnum |null;
    announcementRentType: AnnouncementRentType;
    announcementEstateType?: AnnouncementEstateTypeEnum;
    announcementResidentialType?: AnnouncementResidentialTypeEnum;
    announcementStatus?: AnnouncementStatusEnum;
    features?: AnnouncementFeaturesTypeEnum[];
    commercialType?: AnnouncementCommercialTypeEnum;
    landType?:AnnouncementLandTypeEnum;
    address: string;
    lat?: number;
    lng?: number;
    price: number;
    area: number;
    bedroomCount?: number;
    bathroomCount?: number;
    title: string;
    description: string;
    titleArabian: string;
    descriptionArabian: string;
    isOtherPeriod?: boolean;
    floor: number;
    constructionStatus?: ConstructionStatusEnum
    ownerShip?: OwnershipEnum;
    buildingAge?: BuildingAgeEnum;
    furnishingStatus?: FurnishedStatusEnum;
    saleType?:SaleTypeEnum;
    sittingArea:number,
    country?:string,
    city?:string,
    currencyId:number,
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
  landCategory?:landCategoryEnum


};

export interface IAnnouncementUploadsData {
    basePhoto: string;
    basePhotoFile: File | null;
    otherImages: string[];
    otherDocumentsFiles:IDocument[];
    otherImageFiles: File[];
    otherDocuments: File[];

}
