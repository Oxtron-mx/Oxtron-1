'use server'
import {auth} from '@/auth'
import axiosInstance from '@/lib/axios-instance'
import {Company} from '@/lib/validation'
import {ComboTypeOfLicense} from "@/constants/types";

/* export async function getCompanies(): Promise<Company[]> {
  try {
    const response = await axiosInstance.get('/Companies/Mostrar_Companies')

    return response.data as Company[]
  } catch (error) {
    console.log(error)
    throw error
  }
} */

export async function getCompanyById(idCompany: number): Promise<Company> {
  try {
    const response = await axiosInstance.get('/Companies/Mostrar_Companies_ById', {
      params: { idCompany }
    })

    const data = response.data as Company[]

    return data[0]
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function updateCompany(company: Company) {
  try {
    const session = await auth()
    const idUserControl: number = Number(session?.user?.id) ?? 0

    if (idUserControl === 0) return

    const response = await axiosInstance.put('/Companies/Actualizar_Companies', company)

    return response.status
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getTypeOfLicenses(): Promise<ComboTypeOfLicense[]> {
  try {
    const response = await axiosInstance.get('/TypesLicenses/Mostrar_Types_Licenses');
    return response.data
  } catch (e) {
    return []
  }
}
