import {create} from 'zustand';
import {getCboFuelType} from "@/actions/shared";
import {
  createManufacturing,
  deleteManufacturing,
  getManufacturingByUserId, getTypeOfEquipment,
  updateManufacturing
} from "@/actions/measure/manufacturing";
import {Facility, Manufacturing} from "@/lib/validation";
import {getFacilitiesByUserId} from "@/actions/measure/facilities";
import {ComboFuel, ComboTypeOfEquipment} from "@/constants/types";
import { getEmissionFactorSubtypes, getEquipmentTypes } from '@/services/CatalogService';
import { getManufacturing } from '@/services/Manufacturing';

type ManufacturingStore = {
  manufacturing: Manufacturing[];
  facilities: Facility[];
  fuel: ComboFuel[];
  equipment: ComboTypeOfEquipment[];
  manufacture: Manufacturing | null;
  error: string | null;
  loading: boolean;
  setManufacturing: (manufacturing: Manufacturing[]) => void;
  setManufacture: (manufacturing: Manufacturing | null) => void;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  fetchFormData: () => Promise<void>;
  fetchManufacturing: () => Promise<void>;
  fetchManufacturingById: () => Promise<void>;
  createManufacturing: (manufacturing: Manufacturing) => Promise<string | undefined>;
  updateManufacturing: (manufacturing: Manufacturing) => Promise<string | undefined>;
  deleteManufacturing: (id: number) => Promise<string | undefined>;
};

export const useManufacturingStore = create<ManufacturingStore>((set) => ({
  manufacturing: [],
  facilities: [],
  fuel: [],
  equipment: [],
  manufacture: null,
  error: null,
  loading: false,
  setManufacturing: (manufacturing) => set({manufacturing}),
  setManufacture: (manufacturing: Manufacturing | null) => {
    set({loading: true})
    if (manufacturing) {
      localStorage.setItem("selectedManufacturing", JSON.stringify(manufacturing));
    } else {
      localStorage.removeItem("selectedManufacturing");
    }
    set({manufacture: manufacturing});
    set({loading: false})
  },
  setError: (error) => set({error}),
  setLoading: (loading) => set({loading}),
  fetchFormData: async () => {
    set({loading: true});
    try {
      const facilitiesResponse = await getFacilitiesByUserId();
      const fuelResponse = await getEmissionFactorSubtypes();
      const equipmentResponse = await getEquipmentTypes();

      set({
        facilities: facilitiesResponse.data,
        fuel: fuelResponse.data,
        equipment: equipmentResponse.data,
        error: null,
        loading: false,
      });
    } catch (error) {
      set({error: 'Failed to fetch manufacturing', loading: false});
    }
  },
  fetchManufacturing: async () => {
    set({loading: true});
    try {
      const response = await getManufacturing();
      set({manufacturing: response.data, error: null, loading: false});
    } catch (error) {
      set({error: 'Failed to fetch manufacturing', loading: false});
    }
  },
  fetchManufacturingById: async () => {
    const savedManufacturing = localStorage.getItem("selectedManufacturing");
    if (savedManufacturing) {
      set({manufacture: JSON.parse(savedManufacturing)});
    }
  },
  createManufacturing: async (manufacture) => {
    set({loading: true});
    try {
      const response = await createManufacturing(manufacture);
      const fetchResponse = await getManufacturing();

      set({manufacturing: fetchResponse.data, error: null, loading: false});

      return response.data;
    } catch (error) {
      set({error: 'Failed to create manufacturing', loading: false});
    }
  },
  updateManufacturing: async (updatedManufacturing: Manufacturing) => {
    set({loading: true});
    try {
      const response = await updateManufacturing(updatedManufacturing);
      const fetchResponse = await getManufacturing();

      set({manufacturing: fetchResponse.data, error: null, loading: false});

      return response.data;
    } catch (error) {
      set({error: 'Failed to update manufacturing', loading: false});
    }
  },
  deleteManufacturing: async (id) => {
    set({loading: true});
    try {
      const response = await deleteManufacturing(id);
      const fetchResponse = await getManufacturing();

      set({manufacturing: fetchResponse.data, error: null, loading: false});

      return response.data;
    } catch (error) {
      set({error: 'Failed to delete manufacturing', loading: false});
    }
  },
}));
