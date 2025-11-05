import {create} from 'zustand';
import {
  createFacility,
  deleteFacility,
  getFacilitiesByUserId,
  updateFacility
} from "@/actions/measure/facilities";
import {Facility} from "@/lib/validation";

type FacilityStore = {
  facilities: Facility[];
  facility: Facility | null;
  error: string | null;
  loading: boolean;
  setFacilities: (facilities: Facility[]) => void;
  setFacility: (facility: Facility | null) => void;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  fetchFacilities: () => Promise<void>;
  fetchFacilityById: () => Promise<void>;
  createFacility: (facility: Facility) => Promise<string | undefined>;
  updateFacility: (updatedFacility: Facility) => Promise<string | undefined>;
  deleteFacility: (id: number) => Promise<string | undefined>;
};

export const useFacilityStore = create<FacilityStore>((set) => ({
  facilities: [],
  facility: null,
  error: null,
  loading: false,
  setFacilities: (facilities) => set({facilities}),
  setFacility: (facility: Facility | null) => {
    set({loading: true})
    if (facility) {
      localStorage.setItem("selectedFacility", JSON.stringify(facility));
    } else {
      localStorage.removeItem("selectedFacility");
    }
    set({ facility });
    set({loading: false})
  },
  setError: (error) => set({error}),
  setLoading: (loading) => set({loading}),
  fetchFacilities: async () => {
    set({loading: true});
    try {
      const response = await getFacilitiesByUserId();
      set({facilities: response.data, error: null, loading: false});
      console.log(response)
    } catch (error) {
      set({error: 'Failed to fetch facilities', loading: false});
    }
  },
  fetchFacilityById: async () => {
    const savedFacility = localStorage.getItem("selectedFacility");
    if (savedFacility) {
      set({ facility: JSON.parse(savedFacility) });
    }
  },
  createFacility: async (facility) => {
    set({loading: true});
    try {
      const response = await createFacility(facility);
      const fetchResponse = await getFacilitiesByUserId();

      set({facilities: fetchResponse.data, error: null, loading: false});

      return response.data;
    } catch (error) {
      set({error: 'Failed to create facility', loading: false});
    }
  },
  updateFacility: async (updatedFacility: Facility) => {
    set({loading: true});
    try {
      const response = await updateFacility(updatedFacility);
      const fetchResponse = await getFacilitiesByUserId();

      set({facilities: fetchResponse.data, error: null, loading: false});

      return response.data;
    } catch (error) {
      set({error: 'Failed to update facility', loading: false});
    }
  },
  deleteFacility: async (id) => {
    set({loading: true});
    try {
      const response = await deleteFacility(id);
      const fetchResponse = await getFacilitiesByUserId();

      set({facilities: fetchResponse.data, error: null, loading: false});

      return response.data;
    } catch (error) {
      set({error: 'Failed to delete facility', loading: false});
    }
  },
}));
