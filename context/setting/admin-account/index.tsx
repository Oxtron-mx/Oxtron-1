import { createContext, useState } from 'react'
import { IUser } from '@/constants/types'
import {AxiosError} from "axios";
import {Company} from "@/lib/validation";
import {getUsersByCompanyId} from "@/actions/settings";
import {getUserBySession} from "@/actions/auth";
import {getCompanyById} from "@/actions/company";

export interface IAdminAccountContext {
  isLoading: boolean
  isRegisterUserModalOpen: boolean
  isUpdateUserModalOpen: boolean
  searchTerm: string
  handleOpenRegisterUserModal: () => void
  handleCloseRegisterUserModal: () => void
  handleOpenUpdateUserModal: () => void
  handleCloseUpdateUserModal: () => void
  setIsLoading: (isLoading: boolean) => void
  setSearchTerm: (term: string) => void
  user?: IUser
  setUser: (user: IUser) => void
  loadData: () => Promise<void>
  data: IUser[]
  company: Company | null
}

export const AdminAccountContext = createContext<IAdminAccountContext | null>(null)

export const AdminAccountProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isRegisterUserModalOpen, setIsRegisterUserModalOpen] = useState(false)
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [user, setUser] = useState<IUser | undefined>()
  const [data, setData] = useState<IUser[]>([])
  const [__, setError] = useState<AxiosError | null>(null)
  const [company, setCompany] = useState<Company | null>(null)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const response = await getUsersByCompanyId()
      const user = await getUserBySession()
      const company = await getCompanyById(user.idCompany)

      setData(response)
      setCompany(company)
    } catch (error) {
      console.error({ error })
      setError(error as AxiosError)
    } finally {
      setIsLoading(false)
    }
  }


  const handleOpenRegisterUserModal = () => setIsRegisterUserModalOpen(true)
  const handleCloseRegisterUserModal = () => setIsRegisterUserModalOpen(false)

  const handleOpenUpdateUserModal = () => setIsUpdateUserModalOpen(true)
  const handleCloseUpdateUserModal = () => setIsUpdateUserModalOpen(false)

  return (
    <AdminAccountContext.Provider
      value={ {
        isLoading,
        isRegisterUserModalOpen,
        isUpdateUserModalOpen,
        searchTerm,
        user,
        setIsLoading,
        handleCloseRegisterUserModal,
        handleOpenRegisterUserModal,
        handleOpenUpdateUserModal,
        handleCloseUpdateUserModal,
        setSearchTerm,
        setUser,
        loadData,
        data,
        company,
      } }
    >
      { children }
    </AdminAccountContext.Provider>
  )
}
