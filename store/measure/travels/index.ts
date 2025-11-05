import {create} from 'zustand';
import {
  createTravel,
  deleteTravel,
  getTravelsByUserId,
  updateTravel
} from "@/actions/measure/travels";
import {Travel} from "@/lib/validation";

type TravelStore = {
  travels: Travel[];
  travel: Travel | null;
  error: string | null;
  loading: boolean;
  setTravels: (travels: Travel[]) => void;
  setTravel: (travel: Travel | null) => void;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  fetchTravels: () => Promise<void>;
  fetchTravelById: () => Promise<void>;
  createTravel: (travel: Travel) => Promise<string | undefined>;
  updateTravel: (updatedTravel: Travel) => Promise<string | undefined>;
  deleteTravel: (id: number) => Promise<string | undefined>;
};

export const useTravelStore = create<TravelStore>((set) => ({
  travels: [],
  travel: null,
  error: null,
  loading: false,
  setTravels: (travels) => set({travels}),
  setTravel: (travel: Travel | null) => {
    set({loading: true})
    if (travel) {
      localStorage.setItem("selectedTravel", JSON.stringify(travel));
    } else {
      localStorage.removeItem("selectedTravel");
    }
    set({ travel });
    set({loading: false})
  },
  setError: (error) => set({error}),
  setLoading: (loading) => set({loading}),
  fetchTravels: async () => {
    set({loading: true});
    try {
      const response = await getTravelsByUserId();
      set({travels: response.data, error: null, loading: false});
    } catch (error) {
      set({error: 'Failed to fetch travels', loading: false});
    }
  },
  fetchTravelById: async () => {
    const savedTravel = localStorage.getItem("selectedTravel");
    if (savedTravel) {
      set({ travel: JSON.parse(savedTravel) });
    }
  },
  createTravel: async (travel) => {
    set({loading: true});
    try {
      const response = await createTravel(travel);
      const fetchResponse = await getTravelsByUserId();

      set({travels: fetchResponse.data, error: null, loading: false});

      return response.data;
    } catch (error) {
      set({error: 'Failed to create travel', loading: false});
    }
  },
  updateTravel: async (updatedTravel: Travel) => {
    set({loading: true});
    try {
      const response = await updateTravel(updatedTravel);
      const fetchResponse = await getTravelsByUserId();

      set({travels: fetchResponse.data, error: null, loading: false});

      return response.data;
    } catch (error) {
      set({error: 'Failed to update travel', loading: false});
    }
  },
  deleteTravel: async (id) => {
    set({loading: true});
    try {
      const response = await deleteTravel(id);
      const fetchResponse = await getTravelsByUserId();

      set({travels: fetchResponse.data, error: null, loading: false});

      return response.data;
    } catch (error) {
      set({error: 'Failed to delete travel', loading: false});
    }
  },
}));
