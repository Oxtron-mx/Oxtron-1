import { AxiosError } from 'axios'
import { Dispatch, SetStateAction } from 'react'
// --------------------------- Sidebar

export interface SidebarProps {
    children: React.ReactNode;
    name: string;
    isOpen: boolean;
    route: string;
    lang: string;
}

// --------------------------- Measure

export type IMeasureResponse = {
    data: IFacility |
      IVehicle |
      ITravel |
      ILogistic |
      IManufacturing |
      ICommuting
};

export interface IMeasureContextType {
    cards: Card[];
    showModal: boolean;
    handleShowModal: () => void;
    handleHideModal: () => void;
    title: string;
    data: IMeasureResponse[];
    loading: boolean;
    error: AxiosError | null;
    scope: string;
    measure?: IMeasureResponse;
    setMeasure: Dispatch<SetStateAction<IMeasureResponse | undefined>>,
    setData: Dispatch<SetStateAction<IMeasureResponse[]>>,
    addMeasure: (measure: IMeasureResponse) => void,
}

export interface IUser {
    idUSerControl: number;
    idCompany: number;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    password: string;
    active: string;
    idUSerType: number;
    telephoneUser: string;
    timeZone: string;
    language: string;
    }

export interface IFacility {
    idControlFacility: number;
    idUserControl: number;
    idFacility?: string;
    propertyStatus: number;
    city?: string;
    country?: string;
    description?: string;
    active?: number;
}

export interface Status {
    idStatus: number;
    description: string;
    active: number;
}

export interface ComboBrand {
    idVehicleCboBrand: number;
    description: string;
    active: number;
}

export interface ComboModel {
    idVehicleCboModel: number;
    idVehicleCboBrand: number;
    year: string;
    description: string;
    active: number;
}

export interface ComboType {
    idVehicleCboType: number;
    description: string;
    units: string;
    active: number;
}
export interface ComboFuel {
    id: number;
    name: string;
    description: string;
}
export interface ComboRole {
    idCatRole:   number;
    description: string;
    active:      number;
}


export interface ICboModeTransport {
    idCommutingCboModeTransport: number;
    description: string;
    units: string;
    active: number;
}

export interface IVehicle {
    idControlVehicle: number;
    idUserControl: number;
    idStatus: number;
    name?: string;
    idCboBrand: number;
    idCboModel: number;
    idCboType: number;
    licensePlate?: string;
    active: number;
}

export interface ITravel {
    idControlTravel: number;
    idUserControl: number;
    idTravel: string;
    description?: string;
    active?: number;
}

export interface ILogistic {
    idControlLogistics: number;
    idUserControl: number;
    origin?: string;
    destination?: string;
    originzc?: string;
    destinationzc?: string;
    loadLogistic?: string;
    client?: string;
    idCboStatus: number;
    name?: string;
    idTravelCboType: number;
    idCboModel: number;
    idCboBrand: number;
    licensePlate?: string;
    active: number;
    propertyStatus: string;
    selectVehicle: string;
}

export interface IManufacturing {
    idControlManufacturing: number;
    idUserControl: number;
    process?: string;
    idFacility: string;
    idTypeEquipment: number;
    idTypeFuelUsed: number;
    idTypeEquipmentCode: number;
    active: number;
}

export interface ICommuting {
    idControlCommuting: number;
    idUserControl: number;
    idControlFacility: string;
    description?: string;
    active: number;
}

export interface VLabel {
    value: string;
    label: string;
}

/*

type IFacility = z.infer<typeof Facility>

type IVehicle = z.infer<typeof Vehicle>

type ITravel = z.infer<typeof Travel>

type ILogistic = z.infer<typeof Logistic>

type IManufacturing = z.infer<typeof Manufacturing>

type ICommuting = z.infer<typeof Commuting>

* */

// --------------------------- Dashboard

export interface EnvironmentalTableProps {
    data: TableDataProps[];  // Usando el tipo que ya definiste
  }

export interface TableDataProps {
    id: string;
    alcance1: number;
    alcance2: number;
    alcance3: number;
    totalCO2e: number;
    progreso: string;
}

export interface EmissionTonsProps {
    total: string;
    eD_Scope1_T: number;
    eD_Stationary_T: number;
    eD_Mobile_T: number;
    eD_Refrigerants_T: number;
    eD_Biogenic_T: number;
    eD_Scope2_T: number;
    eD_Location_T: number;
    eD_Market_T: number;
    eD_Heat_T: number;
    eD_Scope3_T: number;
    eD_Transport_T: number;
    eD_Business_T: number;
    eD_Employee_T: number;
    eD_Biogenic2_T: number;
}

export interface EmissionPercentageProps {
    total: string;
    eD_Scope1_P: number;
    eD_Stationary_P: number;
    eD_Mobile_P: number;
    eD_Refrigerants_P: number;
    eD_Biogenic_P: number;
    eD_Scope2_P: number;
    eD_Location_P: number;
    eD_Market_P: number;
    eD_Heat_P: number;
    eD_Scope3_P: number;
    eD_Transport_P: number;
    eD_Business_P: number;
    eD_Employee_P: number;
    eD_Biogenic2_P: number;
}

export interface CircleChartProps {
    EmissionTons: EmissionTonsProps | null;
    EmissionPercentage: EmissionPercentageProps | null;
    dictionary: {
        title: string;
        scope: string;
        circle1: {
          stationary: string;
          mobile: string;
          refrigerants: string;
          biogenic: string;
        };
        circle2: {
          location: string;
          market: string;
          heat: string;
        };
        circle3: {
          transport: string;
          bussiness: string;
          employee: string;
          biogenic: string;
        };
    };
  }


export interface BarChartProps {
    gasTons: GasTons | null;
    gasPercentage: GasPercentage | null;
}

export interface GasTons {
    ggE_BCO2_T: number;
    ggE_CH4_T: number;
    ggE_CO2_T: number;
    ggE_N20_T: number;
}

export interface GasPercentage {
    ggE_BCO2_P: number;
    ggE_CH4_P: number;
    ggE_CO2_P: number;
    ggE_N20_P: number;
}

export interface HistoricEmissionProps {
    csc: number[];
    produced: number[];
    captured: number[];
}

export interface ControlData {
    idControl: number;
    idUserControl: number;
    year: number;
    month: number;
    csc: number;
    produced: number;
    captured: number;
    ggE_CO2_T: number;
    ggE_CH4_T: number;
    ggE_N20_T: number;
    ggE_BCO2_T: number;
    ggE_CO2_P: number;
    ggE_CH4_P: number;
    ggE_N20_P: number;
    ggE_BCO2_P: number;
    eD_Scope1_T: number;
    eD_Stationary_T: number;
    eD_Mobile_T: number;
    eD_Refrigerants_T: number;
    eD_Biogenic_T: number;
    eD_Scope1_P: number;
    eD_Stationary_P: number;
    eD_Mobile_P: number;
    eD_Refrigerants_P: number;
    eD_Biogenic_P: number;
    eD_Scope2_T: number;
    eD_Location_T: number;
    eD_Market_T: number;
    eD_Heat_T: number;
    eD_Scope2_P: number;
    eD_Location_P: number;
    eD_Market_P: number;
    eD_Heat_P: number;
    eD_Scope3_T: number;
    eD_Transport_T: number;
    eD_Business_T: number;
    eD_Employee_T: number;
    eD_Biogenic2_T: number;
    eD_Scope3_P: number;
    eD_Transport_P: number;
    eD_Business_P: number;
    eD_Employee_P: number;
    eD_Biogenic2_P: number;
    emissionsProduced: number;
    impactEquivalence: number;
    sectorComparison: number;
    progress: number;
    eipF_Facility_Id: string;
    eipF_Scope1: number;
    eipF_Scope2: number;
    eipF_Scope3: number;
    eipF_TotalCO2e: number;
    eipF_Progress: number;
    captureEmissions: number;
    [key: string]: number | string;
}

export interface IGWP {
    idGWP: number,
    year: number,
    description: string,
    active: number
}

// --------------------------- Auth

export interface forgotPasswordProps {
    email: string
}

export interface updatePasswordProps {
    email: string
    passwordOld: string
    passwordNew: string
}

// --------------------------- Communication

export interface ControlCommunicate {
    idControlCommunicate: number;
    idUserControl: number;
    idControlFacility: number;
    idFacility: string;
    type: string;
    startDate: string;
    endDate: string;
  }

// --------------------------- Settings
export interface ReportHeader {
    idControlCommunicate: number;
    idUserControl: number;
    idControlFacility: number;
    idFacility: string;
    type: string;
    startDate: Date;
    endDate: Date;
}

export interface CBOType {
    idType: number;
    country: string;
    description: string;
    active: number;
}

export interface BasicResponse<T> {
    status: number;
    success: boolean;
    data: T;
}

export interface ComboTypeOfEquipment {
    name: string;
    id: string;
    description: string;
}

export interface ComboTypeOfLicense {
    idTypeLicense: number;
    description:   string;
    acronym:       string;
    active:        number;
}
