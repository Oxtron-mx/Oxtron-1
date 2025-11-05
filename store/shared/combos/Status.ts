import {create} from 'zustand'
import {Status} from "@/constants/types"
import {getCboStatuses} from '@/actions/shared'

type StatusStore = {
  statuses: Status[]
  status: Status | null
  loading: boolean
  error: string | null
  setStatuses: (statuses: Status[]) => void
  setStatus: (status: Status | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  fetchStatuses: () => Promise<void>
  /* createStatus: (newStatus: Omit<Status, 'idStatus'>) => Promise<void>
  updateStatus: (id: number, updatedStatus: Omit<Status, 'idStatus'>) => Promise<void>
  deleteStatus: (id: number) => Promise<void>*/
}

export const useStatusStore = create<StatusStore>((set) => ({
  statuses: [],
  status: null,
  loading: false,
  error: null,
  setStatuses: (statuses) => set({statuses}),
  setStatus: (status) => set({status}),
  setLoading: (loading) => set({loading}),
  setError: (error) => set({error}),
  fetchStatuses: async () => {
    set({loading: true, error: null})
    try {
      const response = await getCboStatuses()
      set({statuses: response.data, loading: false})
    } catch (error) {
      set({error: 'Failed to fetch statuses', loading: false})
    }
  },
  /* createStatus: async (newStatus) => {
    set({loading: true, error: null})
    try {
      await axios.post('/cboStatus/Registrar_cboStatus', newStatus)
      const response = await axios.get('/cboStatus/Mostrar_cboStatus')
      set({statuses: response.data, loading: false})
    } catch (error) {
      set({error: 'Failed to create status', loading: false})
    }
  },
  updateStatus: async (id, updatedStatus) => {
    set({loading: true, error: null})
    try {
      await axios.put(`/cboStatus/Actualizar_cboStatus`, {idStatus: id, ...updatedStatus})
      const response = await axios.get('/cboStatus/Mostrar_cboStatus')
      set({statuses: response.data, loading: false})
    } catch (error) {
      set({error: 'Failed to update status', loading: false})
    }
  },
  deleteStatus: async (id) => {
    set({loading: true, error: null})
    try {
      await axios.delete(`/cboStatus/Eliminar_cboStatus`, {data: {idStatus: id}})
      const response = await axios.get('/cboStatus/Mostrar_cboStatus')
      set({statuses: response.data, loading: false})
    } catch (error) {
      set({error: 'Failed to delete status', loading: false})
    }
  }, */
}))