import * as React from 'react';
// import Select from "../../../components/select";
import Select from 'react-select';
import SelectNew from '../../../components/select'
import MultiSelect from '../../../components/multi-select';
import {
    AnnouncementEstateTypeEnum,
    AnnouncementFeaturesTypeEnum,
    AnnouncementRentType,
    AnnouncementResidentialTypeEnum,
    AnnouncementStatusEnum,
    AnnouncementTypeEnum,
    IAddSaveFilterRequestModel,
    IDropdownOption
} from "../../../platform/constants/interfaces";
import {AnnouncementFeaturesDropdown} from "../../../platform/constants/dropdowns";
import DatePicker from "react-datepicker";
import {
    AnnouncementCommercialTypeEnum,
    AnnouncementLandTypeEnum,
    BuildingAgeEnum,
    ConstructionStatusEnum,
    FurnishedStatusEnum,
    OwnershipEnum,
    SaleTypeEnum
} from "../../../platform/api/announcement";
import GeographicController from "../../../platform/api/geographic";
import NumberInput from "../../../components/number-input";


interface IState {
    openRentType: boolean,
    startDate: any,
    endDate: any,
    countries: Array<IDropdownOption<number>>;
    cities: Array<IDropdownOption<number>>;
    announcementId: number
}

interface IProps {
    form: IAddSaveFilterRequestModel;
    onChange(form: IAddSaveFilterRequestModel): void;

    isReportPage?: boolean;


}


class FilterAnnouncement extends React.Component<IProps, IState> {

    private optionAnnouncementType = [
        {value: 0, label: [<span className="select-text-select-box" key={0}>Sale</span>]},
        {value: 1, label: [<span className="select-text-select-box-multi" key={1}>New</span>]},
        {value: 2, label: [<span className="select-text-select-box-multi" key={2}>Resale</span>]},
        {value: 3, label: [<span className="select-text-select-box-multi" key={3}>Both</span>]},
        {value: 4, label: [<span className="select-text-select-box" key={4}>Rent</span>]},
        {value: 5, label: [<span className="select-text-select-box-multi" key={5}>daily</span>]},
        {value: 6, label: [<span className="select-text-select-box-multi" key={6}>weekly</span>]},
        {value: 7, label: [<span className="select-text-select-box-multi" key={7}>monthly</span>]},
        {value: 8, label: [<span className="select-text-select-box-multi" key={8}>yearly</span>]},
        {value: 9, label: ''},
    ];
    private optionAnnouncementEstateTypeViewEnum = [
        {value: 0, label: [<span className="select-text-select-box" key={0}>Residential</span>]},
        {value: 1, label: [<span className="select-text-select-box-multi" key={1}>Building</span>]},
        {value: 2, label: [<span className="select-text-select-box-multi" key={2}>Apartments</span>]},
        {value: 3, label: [<span className="select-text-select-box-multi" key={3}>Villa</span>]},
        {value: 4, label: [<span className="select-text-select-box-multi" key={4}>Duplex</span>]},
        {value: 5, label: [<span className="select-text-select-box-multi" key={5}>Compound</span>]},
        {value: 6, label: [<span className="select-text-select-box-multi" key={6}>Chalet</span>]},
        {value: 7, label: [<span className="select-text-select-box-multi" key={7}>Tower</span>]},
        {value: 8, label: [<span className="select-text-select-box-multi" key={8}>Studio</span>]},
        {value: 9, label: [<span className="select-text-select-box-multi" key={9}>FarmHouse</span>]},
        {value: 10, label: [<span className="select-text-select-box" key={10}>Commercial</span>]},
        {value: 11, label: [<span className="select-text-select-box-multi" key={11}>Showroom</span>]},
        {value: 12, label: [<span className="select-text-select-box-multi" key={12}>Shop</span>]},
        {value: 13, label: [<span className="select-text-select-box-multi" key={13}>Office space</span>]},
        {value: 14, label: [<span className="select-text-select-box-multi" key={14}>Warehouse</span>]},


        {value: 15, label: [<span className="select-text-select-box" key={15}>Land</span>]},
        {value: 16, label: [<span className="select-text-select-box-multi" key={16}>Agricultural lands</span>]},
        {value: 17, label: [<span className="select-text-select-box-multi" key={17}>Industrial lands</span>]},
        {value: 18, label: [<span className="select-text-select-box-multi" key={18}>Commercial lands</span>]},
        {value: 19, label: [<span className="select-text-select-box-multi" key={19}>Residential lands</span>]},

        {value: 20, label: ''},

    ];

    private optionReportTypeEnum = [
        // {value: 0, label: 'Pending'},
        {value: 1, label: 'Accepted'},
        {value: 2, label: 'Rejected'},
    ];

    public state: IState = {
        openRentType: false,
        startDate: null,
        endDate: null,
        cities: [],
        countries: [],
        announcementId: 0
    };


    public async componentDidMount() {
        // window.routerHistory.listen(this.routerHandler);
        const res = await GeographicController.GetCountryList();
        this.setState({
            countries: res.data.map(x => ({
                name: x.name,
                value: x.id,
            }))
        });
        const {form} = this.props;
        if (form.countryId) {
            this.getCity();
        }
    }

    private getCity = async () => {
        const {form} = this.props;
        if (form.countryId) {
            const res = await GeographicController.GetCityList(form.countryId);
            this.setState({
                cities: res.data.map(x => ({
                    name: x.name,
                    value: x.id,
                }))
            });
        } else {
            this.setState({
                cities: []
            });
        }
    };

    private changeFeatures = (value: AnnouncementFeaturesTypeEnum[]) => {
        const {form, onChange} = this.props;
        form.features = value;
        onChange(form);
    };

    private changeReportType = (option: { value: number, label: string } | null) => {
        const {form, onChange} = this.props;
        if (option) {
            if (option.value === 0) {
                form.reportAnnouncementStatus = AnnouncementStatusEnum.Pending;
            }
            if (option.value === 1) {
                form.reportAnnouncementStatus = AnnouncementStatusEnum.Accepted;
            }
            if (option.value === 2) {
                form.reportAnnouncementStatus = AnnouncementStatusEnum.Rejected;
            }
        } else {
            form.reportAnnouncementStatus = null;
        }
        onChange(form);
    };
    private changeAnnouncementType = (option: { value: number, label: string } | null) => {
        const {form, onChange} = this.props;
        if (option) {

            if (option.value === 0) {
                this.props.form.announcementType = AnnouncementTypeEnum.Sale;
                this.props.form.announcementRentType = null;
                this.props.form.saleType = null;
            }
            if (option.value === 1) {
                this.props.form.announcementType = AnnouncementTypeEnum.Sale;
                this.props.form.announcementRentType = null;
                this.props.form.saleType = SaleTypeEnum.NewType;
            }
            if (option.value === 2) {
                this.props.form.announcementType = AnnouncementTypeEnum.Sale;
                this.props.form.announcementRentType = null;
                this.props.form.saleType = SaleTypeEnum.Resale;

            }
            if (option.value === 3) {
                this.props.form.announcementType = AnnouncementTypeEnum.Sale;
                this.props.form.announcementRentType = null;
                this.props.form.saleType = SaleTypeEnum.Both;
            }

            if (option.value === 4) {
                this.props.form.announcementType = AnnouncementTypeEnum.Rent;
                this.props.form.announcementRentType = null;
                onChange(form);
            }
            if (option.value === 5) {
                this.props.form.announcementType = AnnouncementTypeEnum.Rent;
                this.props.form.announcementRentType = AnnouncementRentType.Daily;
            }
            if (option.value === 6) {
                this.props.form.announcementType = AnnouncementTypeEnum.Rent;
                this.props.form.announcementRentType = AnnouncementRentType.Weekly;
            }
            if (option.value === 7) {
                this.props.form.announcementType = AnnouncementTypeEnum.Rent;
                this.props.form.announcementRentType = AnnouncementRentType.Monthly;
            }
            if (option.value === 8) {
                this.props.form.announcementType = AnnouncementTypeEnum.Rent;
                this.props.form.announcementRentType = AnnouncementRentType.Yearly;
            }

            onChange(form);
        } else {
            this.props.form.announcementType = null;
            this.props.form.announcementRentType = null;
            onChange(form);

        }
    };

    private changeAnnouncementEstateType = (option: { value: number, label: string } | null) => {
        const {form, onChange} = this.props;
        if (option) {
            if (option.value === 0) {
                this.props.form.announcementEstateType = AnnouncementEstateTypeEnum.Residential;
                this.props.form.announcementResidentialType = null;

            }
            if (option.value === 1) {
                this.props.form.announcementEstateType = AnnouncementEstateTypeEnum.Residential;
                this.props.form.announcementResidentialType = AnnouncementResidentialTypeEnum.Building;
            }
            if (option.value === 2) {
                this.props.form.announcementEstateType = AnnouncementEstateTypeEnum.Residential;
                this.props.form.announcementResidentialType = AnnouncementResidentialTypeEnum.Apartments;
            }
            if (option.value === 3) {
                this.props.form.announcementEstateType = AnnouncementEstateTypeEnum.Residential;
                this.props.form.announcementResidentialType = AnnouncementResidentialTypeEnum.Villa;
            }
            if (option.value === 4) {
                this.props.form.announcementEstateType = AnnouncementEstateTypeEnum.Residential;
                this.props.form.announcementResidentialType = AnnouncementResidentialTypeEnum.Duplex;
            }
            if (option.value === 5) {
                this.props.form.announcementEstateType = AnnouncementEstateTypeEnum.Residential;
                this.props.form.announcementResidentialType = AnnouncementResidentialTypeEnum.Compound;
            }
            if (option.value === 6) {
                this.props.form.announcementEstateType = AnnouncementEstateTypeEnum.Residential;
                this.props.form.announcementResidentialType = AnnouncementResidentialTypeEnum.Chalet;
            }
            if (option.value === 7) {
                this.props.form.announcementEstateType = AnnouncementEstateTypeEnum.Residential;
                this.props.form.announcementResidentialType = AnnouncementResidentialTypeEnum.Tower;
            }
            if (option.value === 8) {
                this.props.form.announcementEstateType = AnnouncementEstateTypeEnum.Residential;
                this.props.form.announcementResidentialType = AnnouncementResidentialTypeEnum.Studio;
            }
            if (option.value === 9) {
                this.props.form.announcementEstateType = AnnouncementEstateTypeEnum.Residential;
                this.props.form.announcementResidentialType = AnnouncementResidentialTypeEnum.FarmHouse;
            }

            if (option.value === 10) {
                this.props.form.announcementEstateType = AnnouncementEstateTypeEnum.Commercial;
                this.props.form.commercialType = null;
            }

            if (option.value === 11) {
                this.props.form.announcementEstateType = AnnouncementEstateTypeEnum.Commercial;
                this.props.form.commercialType = AnnouncementCommercialTypeEnum.Showroom;
            }
            if (option.value === 12) {
                this.props.form.announcementEstateType = AnnouncementEstateTypeEnum.Commercial;
                this.props.form.commercialType = AnnouncementCommercialTypeEnum.Shop;
            }
            if (option.value === 13) {
                this.props.form.announcementEstateType = AnnouncementEstateTypeEnum.Commercial;
                this.props.form.commercialType = AnnouncementCommercialTypeEnum.OfficeSpace;
            }
            if (option.value === 14) {
                this.props.form.announcementEstateType = AnnouncementEstateTypeEnum.Commercial;
                this.props.form.commercialType = AnnouncementCommercialTypeEnum.WareHouse;
            }

            if (option.value === 15) {
                this.props.form.announcementEstateType = AnnouncementEstateTypeEnum.Land;
                this.props.form.landType = null;
            }
            if (option.value === 16) {
                this.props.form.announcementEstateType = AnnouncementEstateTypeEnum.Land;
                this.props.form.landType = AnnouncementLandTypeEnum.AgriculturalLands;
            }
            if (option.value === 17) {
                this.props.form.announcementEstateType = AnnouncementEstateTypeEnum.Land;
                this.props.form.landType = AnnouncementLandTypeEnum.IndustrialLands;
            }
            if (option.value === 18) {
                this.props.form.announcementEstateType = AnnouncementEstateTypeEnum.Land;
                this.props.form.landType = AnnouncementLandTypeEnum.CommercialLands;
            }
            if (option.value === 19) {
                this.props.form.announcementEstateType = AnnouncementEstateTypeEnum.Land;
                this.props.form.landType = AnnouncementLandTypeEnum.ResidentialLands;
            }

            onChange(form);
        } else {
            this.props.form.announcementEstateType = null;
            this.props.form.announcementResidentialType = null;
            this.props.form.landType = null;
            this.props.form.commercialType = null;

            onChange(form);
        }

    };

    private changeAddress = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const {form, onChange} = this.props;
        form.address = e.currentTarget.value;
        onChange(form);
    };
    private changeTitle = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const {form, onChange} = this.props;
        form.search = e.currentTarget.value;
        onChange(form);
    };
    private changeUserName = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const {form, onChange} = this.props;
        form.userName = e.currentTarget.value;
        onChange(form);
    };
    private changePrice = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const {form, onChange} = this.props;
        if (e.currentTarget.name === 'priceFrom') {
            form.priceFrom = Number(e.currentTarget.value);
        } else {
            form.priceTo = Number(e.currentTarget.value);
        }
        onChange(form);
    };
    private changeSittingArea = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const {form, onChange} = this.props;
        if (e.currentTarget.name === 'sittingAreaFrom') {
            form.minSittingArea = Number(e.currentTarget.value);
        } else {
            form.maxSittingArea = Number(e.currentTarget.value);
        }
        onChange(form);
    };
    private changeArea = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const {form, onChange} = this.props;
        if (e.currentTarget.name === 'maxArea') {
            form.maxArea = Number(e.currentTarget.value);
        } else {
            form.minArea = Number(e.currentTarget.value);
        }
        onChange(form);
    };


    private changeConstructionStatusEnum = (option: { value: number, label: string } | null) => {
        const {form, onChange} = this.props;
        if (option) {
            if (option) {
                if (option.value === 0) {
                    form.constructionStatus = ConstructionStatusEnum.UnderConstruction;
                } else {
                    form.constructionStatus = ConstructionStatusEnum.ReadyToMove;
                }
            }
        }else{
            form.constructionStatus = null
        }
        onChange(form);


    };
    private changeOwnershipEnum= (option: { value: number, label: string } | null) => {
        const {form, onChange} = this.props;
        if (form) {
            if (option) {
                if (option.value === 0) {
                    form.ownerShip = OwnershipEnum.Freehold;
                }
                if (option.value === 1) {
                    form.ownerShip = OwnershipEnum.Leasehold;
                }
                if (option.value === 2) {
                    form.ownerShip = OwnershipEnum.Poa;
                }
            }else{
                form.ownerShip = null
            }
            onChange(form);

        }

    };
    private changeBuildingAgeEnum= (option: { value: number, label: string } | null) => {
        const {form, onChange} = this.props;
        if (form) {
            if (option) {
                if (option.value === 0) {
                    form.buildingAge = BuildingAgeEnum.Age1;
                }
                if (option.value === 1) {
                    form.buildingAge = BuildingAgeEnum.Age2;
                }
                if (option.value === 2) {
                    form.buildingAge = BuildingAgeEnum.Age3;
                }
                if (option.value === 3) {
                    form.buildingAge = BuildingAgeEnum.Age4;
                }  if (option.value === 4) {
                    form.buildingAge = BuildingAgeEnum.Age5;
                }
            }else{
                form.buildingAge = null
            }
            onChange(form);

        }

    };
    private changeFurnishedStatusEnum= (option: { value: number, label: string } | null) => {
        const {form, onChange} = this.props;

        if (form) {
            if (option) {
                if (option.value === 0) {
                    form.furnishingStatus = FurnishedStatusEnum.Furnished;
                }
                if (option.value === 1) {
                    form.furnishingStatus = FurnishedStatusEnum.SemiFurnished;

                }
                if (option.value === 2) {
                    form.furnishingStatus = FurnishedStatusEnum.Unfurnished;

                }


            }else{
                form.furnishingStatus = null
            }
            onChange(form);

        }
    };
    private changeSaleTypeEnum = (option: { value: number, label: string } | null) => {
        const {form, onChange} = this.props;

        if (form) {
            if (option) {
                if (option.value === 0) {
                    form.saleType = SaleTypeEnum.NewType;
                }
                if (option.value === 1) {
                    form.saleType = SaleTypeEnum.Resale;
                }
                if (option.value === 2) {
                    form.saleType = SaleTypeEnum.Both;
                }

            } else {
                form.saleType = null
            }
            onChange(form);

        }
    };


    private changeCountry = (option: IDropdownOption<number>) => {
        const {form, onChange} = this.props;
        form.cityId = null;
        if (option) form.countryId = option.value;
        else delete form.countryId;
        this.getCity();
        onChange(form);
    };
    private changeCity = (option: IDropdownOption<number>) => {
        const {form, onChange} = this.props;
        if (option) form.cityId = option.value;
        else delete form.cityId;
        onChange(form);
    };
    private optionConstructionStatusEnum = [
        {value: 0, label: [<span className="select-text-select-box" key={0}>Under construction</span>]},
        {value: 1, label: [<span className="select-text-select-box" key={1}>Ready mo move</span>]},
        {value: 2, label: ''},
    ];
    private optionOwnershipEnum = [
        {value: 0, label: [<span className="select-text-select-box" key={0}>Freehold</span>]},
        {value: 1, label: [<span className="select-text-select-box" key={1}>Leasehold</span>]},
        {value: 2, label: [<span className="select-text-select-box" key={2}>Poa</span>]},
        {value: 3, label: ''},
    ];
    private optionBuildingAgeEnum = [
        {value: 0, label: [<span className="select-text-select-box" key={0}>0-1 Year</span>]},
        {value: 1, label: [<span className="select-text-select-box" key={1}>1-2 Year</span>]},
        {value: 2, label: [<span className="select-text-select-box" key={2}>2-5 Year</span>]},
        {value: 3, label: [<span className="select-text-select-box" key={3}>5+ Year</span>]},
        {value: 4, label: [<span className="select-text-select-box" key={4}>Any</span>]},
        {value: 5, label: ''},
    ];
    private optionFurnishedStatusEnum = [
        {value: 0, label: [<span className="select-text-select-box" key={0}>Furnished</span>]},
        {value: 1, label: [<span className="select-text-select-box" key={1}>Semi furnished</span>]},
        {value: 2, label: [<span className="select-text-select-box" key={2}>Unfurnished</span>]},
        {value: 3, label: ''},
    ];
    private optionSaleTypeEnum = [
        {value: 0, label: [<span className="select-text-select-box" key={0}>New type</span>]},
        {value: 1, label: [<span className="select-text-select-box" key={1}>Resale</span>]},
        {value: 2, label: [<span className="select-text-select-box" key={2}>Both</span>]},
        {value: 3, label: ''},
    ];


    // private changeNumberField = (e: React.SyntheticEvent<HTMLInputElement>) => {
    //     const {onChange,form} = this.props;
    //     if (form) {
    //         if (+e.currentTarget.value || +e.currentTarget.value === 0) form[e.currentTarget.name] = +e.currentTarget.value;
    //         onChange(form)
    //     }
    //
    // }


  // private  getAnnouncementById = (e: React.SyntheticEvent<HTMLInputElement>)=>{
  //     this.setState({announcementId: +e.currentTarget.value})
  //     !!this.props.getAnnouncementById && this.props.getAnnouncementById( +e.currentTarget.value)
  //   }

    public render() {
        const {form} = this.props;
        return (
          <div className={`B-announcement-filter-block`}>
              <div className='padding-inputs-filter'>
                  <div className='B-announcement-input-block'>
                      <label>
                          <p>Announcement Name</p>
                          <input type="text"
                                 name='search'
                                 placeholder='Type name'
                                 autoComplete='off'
                                 onChange={this.changeTitle}
                          />
                      </label>
                  </div>
              </div>
              <div className='padding-inputs-filter'>
                  <div className='B-announcement-input-block'>
                      <label>
                          <p>Announcement id</p>
                          <NumberInput
                            name="search"
                            placeholder="Announcement id"
                            value={form.search}
                            className={`G-input I-none-full-input`}

                            onChange={this.changeTitle}

                          />
                      </label>
                  </div>
              </div>
              {this.state.countries.length ?
                <div className='padding-inputs-filter'>
                    <div className='B-announcement-input-block'>
                        <label>
                            <p>Country</p>
                            <SelectNew<number>
                              clear={true}
                              useValue={true}
                              value={form.countryId}
                              options={this.state.countries}
                              placeholder="Country"
                              onChange={this.changeCountry}
                              placeholderOpacity={true}
                              isAllList={true}
                            />
                        </label>
                    </div>
                </div> : null}
              <div className='padding-inputs-filter'>
                  <div className='B-announcement-input-block'>
                      <label>
                          <p>City</p>
                          <SelectNew<number>
                            clear={true}
                            useValue={true}
                            value={form.cityId}
                            options={this.state.cities}
                            placeholder="City"
                            onChange={this.changeCity}
                            placeholderOpacity={true}
                            isAllList={true}
                          />
                      </label>
                  </div>
              </div>
              <div className='padding-inputs-filter'>
                  <div className='B-announcement-input-block'>
                      <label>
                          <p>Address</p>
                          <input type="text"
                                 name='address'
                                 placeholder='Type address'
                                 autoComplete='off'


                                 onChange={this.changeAddress}
                          />
                      </label>
                  </div>
              </div>
              <div className='padding-inputs-filter'>
                  <div className='B-announcement-input-block'>
                      <label>
                          <p>User name</p>
                          <input type="text"
                                 name='userName'
                                 autoComplete='off'
                                 onChange={this.changeUserName}
                                 placeholder='Type name'/>
                        </label>
                    </div>
                </div>
                <div className='padding-inputs-filter'>
                    <div className='B-announcement-input-block'>
                        <label>
                            <p>Announcement Type</p>
                            <Select
                                className="basic-single"
                                placeholder="Select type"
                                placeholderOpacity={true}
                                options={this.optionAnnouncementType}
                                isClearable={true}
                                isSearchable={false}
                                onChange={this.changeAnnouncementType}
                            />
                        </label>
                    </div>
                </div>
                <div className='padding-inputs-filter'>
                    <div className='B-announcement-input-block'>
                        <label>
                            <p>Announcement Estate Type</p>
                            <Select
                                className="basic-single"
                                placeholder="Select type"
                                placeholderOpacity={true}
                                options={this.optionAnnouncementEstateTypeViewEnum}
                                isClearable={true}
                                isSearchable={false}
                                onChange={this.changeAnnouncementEstateType}
                            />
                        </label>

                    </div>
                </div>
                <div className='padding-inputs-filter'>
                    <div className='B-announcement-input-block'>
                        <label>
                            <p>Sale type</p>
                            <Select
                                className="basic-single"
                                placeholder="Select type"
                                placeholderOpacity={true}
                                options={this.optionSaleTypeEnum}
                                isClearable={true}
                                isSearchable={false}
                                onChange={this.changeSaleTypeEnum}
                            />
                        </label>
                    </div>
                </div>

                <div className='padding-inputs-filter'>
                    <div className='B-announcement-input-block'>
                        <label>
                            <p>Announcement Features Type</p>
                            <div className="G-input-group">
                                <MultiSelect<AnnouncementFeaturesTypeEnum>
                                    value={form.features}
                                    options={AnnouncementFeaturesDropdown()}
                                    placeholder='Select type'
                                    onChange={this.changeFeatures}
                                    clear={true}
                                />
                            </div>
                        </label>
                    </div>
                </div>
                <div className='padding-inputs-filter'>
                    <div className='B-announcement-input-block'>
                        <label>
                            <p>Price from</p>
                            <input type="text"
                                   name='priceFrom'
                                   placeholder='Set price'
                                   autoComplete='off'
                                   onChange={this.changePrice}
                            />
                        </label>
                    </div>
                </div>
                <div className='padding-inputs-filter'>
                    <div className='B-announcement-input-block'>
                        <label>
                            <p>Price to</p>
                            <input type="text"
                                   name='priceTo'
                                   placeholder='Set price'
                                   autoComplete='off'
                                   onChange={this.changePrice}

                            />
                        </label>
                    </div>
                </div>
                <div className='padding-inputs-filter'>
                    <div className='B-announcement-input-block'>
                        <label>
                            <p>Area from</p>
                            <input type="text"
                                   name='minArea'
                                   placeholder='Set area'
                                   autoComplete='off'
                                   onChange={this.changeArea}
                            />
                        </label>
                    </div>
                </div>
                <div className='padding-inputs-filter'>
                    <div className='B-announcement-input-block'>
                        <label>
                            <p>Area to</p>
                            <input type="text"
                                   name='maxArea'
                                   placeholder='Set area'
                                   autoComplete='off'
                                   onChange={this.changeArea}
                            />
                        </label>
                    </div>
                </div>
                <div className='padding-inputs-filter'>
                    <p>Date from</p>
                    <DatePicker
                        placeholderText="Choose date"
                        selected={this.state.startDate}
                        onChange={date => {

                            this.setState({startDate: date});
                            if (this.props.form) {
                                if(date){
                                    this.props.form.dateFrom = date.toDateString()

                                }else{
                                    this.props.form.dateFrom = null
                                }
                            }
                            this.props.onChange(form);
                        }
                        }
                        startDate={this.state.startDate}
                        // endDate={this.state.endDate}
                        isClearable={this.state.startDate}
                        // selectsStart={true}
                        dateFormat="dd  MMMM  yyyy"
                    />
                </div>
                <div className='padding-inputs-filter'>
                    <p>Date to</p>
                    <DatePicker
                        placeholderText="Choose date"
                        selected={this.state.endDate}
                        onChange={date => {
                            this.setState({endDate: date});
                            if (this.props.form) {
                                if(date){
                                    this.props.form.dateTo = date.toDateString()

                                }else{
                                    this.props.form.dateTo = null

                                }
                            }
                            this.props.onChange(form);

                        }
                        }
                        endDate={this.state.endDate}
                        minDate={this.state.startDate}
                        isClearable={this.state.endDate}
                        selectsEnd={true}
                        dateFormat="dd  MMMM  yyyy"
                    />
                </div>

                {this.props.isReportPage ?
                    <div className='padding-inputs-filter'>
                        <div className='B-announcement-input-block'>
                            <label>
                                <p>Report Type</p>
                                <Select
                                    className="basic-single"
                                    placeholder="Select type"
                                    placeholderOpacity={true}
                                    options={this.optionReportTypeEnum}
                                    isClearable={true}
                                    isSearchable={false}
                                    onChange={this.changeReportType}
                                />
                            </label>

                        </div>
                    </div>
                    : null}

           {!this.props.isReportPage?     <div className='padding-inputs-filter'>
                    <div className='B-announcement-input-block'>
                        <label>
                            <p>Construction status</p>
                            <Select
                                className="basic-single"
                                placeholder="Select type"
                                placeholderOpacity={true}
                                options={this.optionConstructionStatusEnum}
                                isClearable={true}
                                isSearchable={false}
                                onChange={this.changeConstructionStatusEnum}
                            />
                        </label>
                    </div>
                </div>:null}
           { !this.props.isReportPage?     <div className='padding-inputs-filter'>
                    <div className='B-announcement-input-block'>
                        <label>
                            <p>Type of ownership</p>
                            <Select
                                className="basic-single"
                                placeholder="Select type"
                                placeholderOpacity={true}
                                options={this.optionOwnershipEnum}
                                isClearable={true}
                                isSearchable={false}
                                onChange={this.changeOwnershipEnum}
                            />
                        </label>
                    </div>
                </div>:null}
             {!this.props.isReportPage?    <div className='padding-inputs-filter'>
                    <div className='B-announcement-input-block'>
                        <label>
                            <p>Building age</p>
                            <Select
                                className="basic-single"
                                placeholder="Select type"
                                placeholderOpacity={true}
                                options={this.optionBuildingAgeEnum}
                                isClearable={true}
                                isSearchable={false}
                                onChange={this.changeBuildingAgeEnum}
                            />
                        </label>
                    </div>
                </div>:null}
            { !this.props.isReportPage?    <div className='padding-inputs-filter'>
                    <div className='B-announcement-input-block'>
                        <label>
                            <p>Furnishing type</p>
                            <Select
                                className="basic-single"
                                placeholder="Select type"
                                placeholderOpacity={true}
                                options={this.optionFurnishedStatusEnum}
                                isClearable={true}
                                isSearchable={false}
                                onChange={this.changeFurnishedStatusEnum}
                            />
                        </label>
                    </div>
                </div>:null}
              { !this.props.isReportPage?  <div className='padding-inputs-filter'>
                    <div className='B-announcement-input-block'>
                        <label>
                            <p>Sitting area from</p>
                            <input type="text"
                                   name='sittingAreaFrom'
                                   placeholder='Set price'
                                   autoComplete='off'
                                   onChange={this.changeSittingArea}
                            />
                        </label>
                    </div>
                </div>:null}
              { !this.props.isReportPage?  <div className='padding-inputs-filter'>
                    <div className='B-announcement-input-block'>
                        <label>
                            <p>Sitting area to</p>
                            <input type="text"
                                   name='sittingAreaTo'
                                   placeholder='Set price'
                                   autoComplete='off'
                                   onChange={this.changeSittingArea}

                            />
                        </label>
                    </div>
                </div>:null}
            </div>
        )
    }
}

export default FilterAnnouncement;
