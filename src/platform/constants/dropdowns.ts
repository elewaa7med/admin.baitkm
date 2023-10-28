import {
  AnnouncementEstateTypeEnum,
  // AnnouncementEstateTypeViewEnum,
  AnnouncementFeaturesTypeEnum, AnnouncementRentType, AnnouncementResidentialTypeEnum,
   AnnouncementTypeEnum,
  IDropdownOption,
  ReportsStatusViewEnum
} from './interfaces';
import { PushNotificationActionTypeView, PushNotificationUserTypeView } from '../api/notification';
import {
  AnnouncementCommercialTypeEnum,
  AnnouncementLandTypeEnum, BuildingAgeEnum, ConstructionStatusEnum,
  FacadeTypeEnum, FurnishedStatusEnum, landCategoryEnum,
  OwnershipEnum, SaleTypeEnum
} from "../api/announcement";


// const enumToSelectOptions = <Value extends number>(obj: object, withTranslations: boolean = true, notIncludeValues: Value[] = []) => {
//   const options: Array<IDropdownOption<Value>> = [];
//   Object.keys(obj).map(item => {
//     if (!isNaN(+item)) options.push({
//       name: obj[item],
//       value: +item as Value,
//     });
//
//     return true;
//   });
//
//   return options;
// };

export const enumToSelectOptions = <Value extends number>(obj: object, withTranslations: boolean = true, notIncludeValues: Value[] = []) => {
  const options: Array<IDropdownOption<Value>> = [];
  Object.keys(obj).map(item => {
    if (!isNaN(+item) && notIncludeValues.indexOf(+item as Value) === -1) options.push({
      name:  obj[item],
      value: +item as Value,
    });

    return true;
  });

  return options;
};
export const addAny = <Value>(array: Array<IDropdownOption<Value>>) => [{
  name: 'Any',
  value: '//cr',
}, ...array];

export const SortTypeDropdown = enumToSelectOptions<ReportsStatusViewEnum>(ReportsStatusViewEnum);
export const SortNotifActionDropdown = enumToSelectOptions<PushNotificationActionTypeView>(PushNotificationActionTypeView);
export const SortNotifUserDropdown = enumToSelectOptions<PushNotificationUserTypeView>(PushNotificationUserTypeView);
export const SortTypeDropdownAnnouncementType = enumToSelectOptions<AnnouncementTypeEnum>(AnnouncementTypeEnum);

// export const AnnouncementFeaturesDropdown = () => enumToSelectOptions<AnnouncementFeaturesTypeEnum>(AnnouncementFeaturesTypeEnum, false);



export const AnnouncementResidentialDropdown = () => enumToSelectOptions<AnnouncementResidentialTypeEnum>(AnnouncementResidentialTypeEnum);
export const AnnouncementCommercialDropdown = () => enumToSelectOptions<AnnouncementCommercialTypeEnum>(AnnouncementCommercialTypeEnum);
export const AnnouncementCLandDropdown = () => enumToSelectOptions<AnnouncementLandTypeEnum>(AnnouncementLandTypeEnum);
export const AnnouncementOwnershipDropdown = () => enumToSelectOptions<OwnershipEnum>(OwnershipEnum);
export const AnnouncementFacadeDropdown = () => enumToSelectOptions<FacadeTypeEnum>(FacadeTypeEnum);

export const AnnouncementFurnishedStatusDropdown = () => enumToSelectOptions<FurnishedStatusEnum>(FurnishedStatusEnum);
export const AnnouncementSaleTypeDropdown = () => enumToSelectOptions<SaleTypeEnum>(SaleTypeEnum);
export const AnnouncementBuildingAgeDropdown = () => enumToSelectOptions<BuildingAgeEnum>(BuildingAgeEnum);
export const AnnouncementConstructionStatusDropdown = () => enumToSelectOptions<ConstructionStatusEnum>(ConstructionStatusEnum)
export const AnnouncementFeaturesDropdown = () => enumToSelectOptions<AnnouncementFeaturesTypeEnum>(AnnouncementFeaturesTypeEnum);
export const AnnouncementEstateTypeDropdown = () => enumToSelectOptions<AnnouncementEstateTypeEnum>(AnnouncementEstateTypeEnum);
export const AnnouncementTypeDropdown = () => enumToSelectOptions<AnnouncementTypeEnum>(AnnouncementTypeEnum);
export const AnnouncementRentTypeDropdown = () =>enumToSelectOptions<AnnouncementRentType>(AnnouncementRentType);
export const AnnouncementLandCategoryDropdown = () => enumToSelectOptions<landCategoryEnum>(landCategoryEnum);

