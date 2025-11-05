import {create} from 'zustand';
import {
  createCommuting,
  deleteCommuting,
  getCommutingByUserId,
  updateCommuting
} from "@/actions/measure/commuting";
import {Facility, Commuting} from "@/lib/validation";
import {getFacilitiesByUserId} from "@/actions/measure/facilities";

type CommutingStore = {
  commuting: Commuting[];
  facilities: Facility[];
  commute: Commuting | null;
  error: string | null;
  loading: boolean;
  setCommuting: (commuting: Commuting[]) => void;
  setCommute: (commuting: Commuting | null) => void;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  fetchFormData: () => Promise<void>;
  fetchCommuting: () => Promise<void>;
  fetchCommutingById: () => Promise<void>;
  createCommuting: (commuting: Commuting) => Promise<string | undefined>;
  updateCommuting: (commuting: Commuting) => Promise<string | undefined>;
  deleteCommuting: (id: number) => Promise<string | undefined>;
};

export const useCommutingStore = create<CommutingStore>((set) => ({
  commuting: [],
  facilities: [],
  commute: null,
  error: null,
  loading: false,
  setCommuting: (commuting) => set({commuting}),
  setCommute: (commuting: Commuting | null) => {
    set({loading: true})
    if (commuting) {
      localStorage.setItem("selectedCommuting", JSON.stringify(commuting));
    } else {
      localStorage.removeItem("selectedCommuting");
    }
    set({commute: commuting});
    set({loading: false})
  },
  setError: (error) => set({error}),
  setLoading: (loading) => set({loading}),
  fetchFormData: async () => {
    set({loading: true});
    try {
      const facilitiesResponse = await getFacilitiesByUserId();
      set({
        facilities: facilitiesResponse.data,
        error: null,
        loading: false,
      });
    } catch (error) {
      set({error: 'Failed to fetch commuting', loading: false});
    }
  },
  fetchCommuting: async () => {
    set({loading: true});
    try {
      const response = await getCommutingByUserId();
      set({commuting: response.data, error: null, loading: false});
    } catch (error) {
      set({error: 'Failed to fetch commuting', loading: false});
    }
  },
  fetchCommutingById: async () => {
    const savedCommuting = localStorage.getItem("selectedCommuting");
    if (savedCommuting) {
      set({commute: JSON.parse(savedCommuting)});
    }
  },
  createCommuting: async (commute) => {
    set({loading: true});
    try {
      const response = await createCommuting(commute);
      const fetchResponse = await getCommutingByUserId();

      set({commuting: fetchResponse.data, error: null, loading: false});

      return response.data;
    } catch (error) {
      set({error: 'Failed to create commuting', loading: false});
    }
  },
  updateCommuting: async (updatedCommuting: Commuting) => {
    set({loading: true});
    try {
      const response = await updateCommuting(updatedCommuting);
      const fetchResponse = await getCommutingByUserId();

      set({commuting: fetchResponse.data, error: null, loading: false});

      return response.data;
    } catch (error) {
      set({error: 'Failed to update commuting', loading: false});
    }
  },
  deleteCommuting: async (id) => {
    set({loading: true});
    try {
      const response = await deleteCommuting(id);
      const fetchResponse = await getCommutingByUserId();

      set({commuting: fetchResponse.data, error: null, loading: false});

      return response.data;
    } catch (error) {
      set({error: 'Failed to delete commuting', loading: false});
    }
  },
}));
