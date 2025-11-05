import {create} from 'zustand';
import {Vehicle} from "@/lib/validation";
import {createVehicle, deleteVehicle, getVehiclesByUserId, updateVehicle} from "@/actions/measure/vehicles";
import {ComboBrand, ComboModel, ComboType, Status} from '@/constants/types';
import {getCboBrands, getCboModelsBrand, getCboStatuses, getCboTypes} from "@/actions/shared";

type VehiclesStore = {
  vehicles: Vehicle[];
  statuses: Status[];
  brands: ComboBrand[];
  models: ComboModel[];
  types: ComboType[];
  vehicle: Vehicle | null;
  error: string | null;
  loading: boolean;
  setVehicles: (vehicles: Vehicle[]) => void;
  setVehicle: (vehicle: Vehicle | null) => void;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  fetchFormData: () => Promise<void>;
  fetchVehicles: () => Promise<void>;
  fetchVehicleById: () => Promise<void>;
  fetchModels: (idBrand: number) => Promise<void>;
  createVehicle: (vehicle: Vehicle) => Promise<string | undefined>;
  updateVehicle: (updatedVehicle: Vehicle) => Promise<string | undefined>;
  deleteVehicle: (id: number) => Promise<string | undefined>;
};

export const useVehicleStore = create<VehiclesStore>((set) => ({
  vehicles: [],
  statuses: [],
  brands: [],
  models: [],
  types: [],
  vehicle: null,
  error: null,
  loading: false,
  setVehicles: (vehicles) => set({vehicles}),
  setVehicle: (vehicle: Vehicle | null) => {
    set({loading: true})
    if (vehicle) {
      localStorage.setItem("selectedVehicle", JSON.stringify(vehicle));
    } else {
      localStorage.removeItem("selectedVehicle");
    }
    set({vehicle});
    set({loading: false})
  },
  setError: (error) => set({error}),
  setLoading: (loading) => set({loading}),
  fetchFormData: async () => {
    set({loading: true});
    try {
      const statusResponse = await getCboStatuses();
      const brandResponse = await getCboBrands();
      const typeResponse = await getCboTypes();
      set({
        statuses: statusResponse.data,
        brands: brandResponse.data,
        types: typeResponse.data,
        error: null,
        loading: false,
      });
    } catch (error) {
      set({error: 'Failed to fetch vehicles', loading: false});
    }
  },
  fetchVehicles: async () => {
    set({loading: true});
    try {
      const response = await getVehiclesByUserId();
      set({vehicles: response.data, error: null, loading: false});
    } catch (error) {
      set({error: 'Failed to fetch vehicles', loading: false});
    }
  },
  fetchVehicleById: async () => {
    const savedVehicle = localStorage.getItem("selectedVehicle");
    if (savedVehicle) {
      set({vehicle: JSON.parse(savedVehicle)});
    }
  },
  fetchModels: async (idBrand: number) => {
    const modelResponse = await getCboModelsBrand(idBrand);
    set({models: modelResponse.data, error: null, loading: false});
  },
  createVehicle: async (vehicle) => {
    set({loading: true});
    try {
      const response = await createVehicle(vehicle);
      const fetchResponse = await getVehiclesByUserId();

      set({vehicles: fetchResponse.data, error: null, loading: false});

      return response.data;
    } catch (error) {
      set({error: 'Failed to create vehicle', loading: false});
    }
  },
  updateVehicle: async (updatedVehicle: Vehicle) => {
    set({loading: true});
    try {
      const response = await updateVehicle(updatedVehicle);
      const fetchResponse = await getVehiclesByUserId();

      set({vehicles: fetchResponse.data, error: null, loading: false});

      return response.data;
    } catch (error) {
      set({error: 'Failed to update vehicle', loading: false});
    }
  },
  deleteVehicle: async (id) => {
    set({loading: true});
    try {
      const response = await deleteVehicle(id);
      const fetchResponse = await getVehiclesByUserId();

      set({vehicles: fetchResponse.data, error: null, loading: false});

      return response.data;
    } catch (error) {
      set({error: 'Failed to delete vehicle', loading: false});
    }
  },
}));
