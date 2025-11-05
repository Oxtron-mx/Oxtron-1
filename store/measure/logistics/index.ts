import {create} from 'zustand';
import {Logistic, Vehicle} from "@/lib/validation";
import {createLogistic, deleteLogistic, getLogisticsByUserId, updateLogistic} from "@/actions/measure/logistics";
import {ComboBrand, ComboModel, ComboType, Status} from '@/constants/types';
import {getCboBrands, getCboModelsBrand, getCboStatuses, getCboTypes} from "@/actions/shared";
import { getVehiclesByUserId } from '@/actions/measure/vehicles';

type LogisticsStore = {
  steps: number;
  currentStep: number;
  logistics: Logistic[];
  statuses: Status[];
  brands: ComboBrand[];
  models: ComboModel[];
  types: ComboType[];
  vehicles: Vehicle[];
  logistic: Logistic | null;
  error: string | null;
  loading: boolean;
  setCurrentStep: (step: number) => void;
  setLogistics: (logistics: Logistic[]) => void;
  setLogistic: (logistic: Logistic | null) => void;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  setResetCurrentStep: () => void;
  setLastStep: () => void;
  fetchFormData: () => Promise<void>;
  fetchLogistics: () => Promise<void>;
  fetchLogisticById: () => Promise<void>;
  fetchModels: (idBrand: number) => Promise<void>;
  createLogistic: (logistic: Logistic) => Promise<string | undefined>;
  updateLogistic: (updatedLogistic: Logistic) => Promise<string | undefined>;
  deleteLogistic: (id: number) => Promise<string | undefined>;
};

export const useLogisticStore = create<LogisticsStore>((set) => ({
  steps: 2,
  currentStep: 0,
  logistics: [],
  statuses: [],
  brands: [],
  models: [],
  types: [],
  vehicles: [],
  logistic: null,
  error: null,
  loading: false,
  setCurrentStep: (step: number) => set({currentStep: step}),
  setLogistics: (logistics) => set({logistics}),
  setLogistic: (logistic: Logistic | null) => {
    set({loading: true})
    if (logistic) {
      localStorage.setItem("selectedLogistic", JSON.stringify(logistic));
    } else {
      localStorage.removeItem("selectedLogistic");
    }
    set({logistic});
    set({loading: false})
  },
  setError: (error) => set({error}),
  setLoading: (loading) => set({loading}),
  setResetCurrentStep: () => set({currentStep: 0}),
  setLastStep: () => set({currentStep: 1}),
  fetchFormData: async () => {
    set({loading: true});
    try {
      const statusResponse = await getCboStatuses();
      const brandResponse = await getCboBrands();
      const typeResponse = await getCboTypes();
      const vehiclesResponse = await getVehiclesByUserId();
      set({
        statuses: statusResponse.data,
        brands: brandResponse.data,
        types: typeResponse.data,
        vehicles: vehiclesResponse.data,
        error: null,
        loading: false,
      });
    } catch (error) {
      set({error: 'Failed to fetch logistics', loading: false});
    }
  },
  fetchLogistics: async () => {
    set({loading: true});
    try {
      const response = await getLogisticsByUserId();
      const uniqueData = response.data?.filter((data) => data.active === 1) || []

      set({logistics: uniqueData, error: null, loading: false});
    } catch (error) {
      set({error: 'Failed to fetch logistics', loading: false});
    }
  },
  fetchLogisticById: async () => {
    const savedLogistic = localStorage.getItem("selectedLogistic");
    if (savedLogistic) {
      set({logistic: JSON.parse(savedLogistic)});
    }
  },
  fetchModels: async (idBrand: number) => {
    const modelResponse = await getCboModelsBrand(idBrand);
    set({models: modelResponse.data, error: null, loading: false});
  },
  createLogistic: async (logistic) => {
    set({loading: true});
    try {
      console.log('logistic:', logistic)
      const response = await createLogistic(logistic);
      const fetchResponse = await getLogisticsByUserId();

      set({logistics: fetchResponse.data, error: null, loading: false});

      return response.data;
    } catch (error) {
      set({error: 'Failed to create logistic', loading: false});
    }
  },
  updateLogistic: async (updatedLogistic: Logistic) => {
    set({loading: true});
    try {
      const response = await updateLogistic(updatedLogistic);
      const fetchResponse = await getLogisticsByUserId();

      set({logistics: fetchResponse.data, error: null, loading: false});

      return response.data;
    } catch (error) {
      set({error: 'Failed to update logistic', loading: false});
    }
  },
  deleteLogistic: async (id) => {
    set({loading: true});
    try {
      const response = await deleteLogistic(id);
      const fetchResponse = await getLogisticsByUserId();

      set({logistics: fetchResponse.data, error: null, loading: false});

      return response.data;
    } catch (error) {
      set({error: 'Failed to delete logistic', loading: false});
    }
  },
}));
