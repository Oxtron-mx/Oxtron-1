'use server'

import {getAuthenticatedUserId, handleError} from "@/actions/shared";
import axiosInstance from '@/lib/axios-instance'
import {Facility} from '@/lib/validation'
import { getFacilitiesByUserIdData } from "@/utils/facilities";

export async function createFacility(facility: Facility): Promise<ApiResponse<string>> {
  try {
    const idUserControl = await getAuthenticatedUserId();
    const response = await axiosInstance.post('/Facilities/Registrar_Facilities', {...facility, idUserControl,})
    const data = response.data as string

    return {
      success: true,
      status: 201,
      data,
      message: data,
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function getFacilitiesByUserId(): Promise<ApiResponse<Facility[]>> {
  try {
    // const idUser = await getAuthenticatedUserId();
    // const response = await axiosInstance.get('/api/facilities', {params: {idUser}})
    // const data: Facility[] = response.data as Facility[]
    const newData = getFacilitiesByUserIdData.data.map(facility => ({
          idFacility: facility.name,
          propertyStatus: facility.property_status,
          city: facility.city_name,
          country: facility.country_name,
          active: 1,
          idControlFacility: 0,
          idUserControl: 66,
          description: facility.description,
      }))
  return {
      success: true,
      status: 200,
      data: newData,
      message: 'Successfully getting facilities',
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function getFacilityById(idFacility: number): Promise<ApiResponse<Facility | null>> {
  try {
    const idUser = await getAuthenticatedUserId();
    const response = await axiosInstance.get('/Facilities/Mostrar_Facilities_ByFacility', {params: {idFacility, idUser}})
    const data = response.data as Facility

    return {
      success: true,
      status: data.active === 1 ? 200 : 404,
      message: 'success',
      data: data.active === 1 ? data : null,
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function updateFacility(facility: Facility): Promise<ApiResponse<string>> {
  try {
    const response = await axiosInstance.put('/Facilities/Actualizar_Facilities', {...facility})
    const data = response.data as string

    return {
      success: true,
      status: 200,
      message: 'Successfully updated facility',
      data: data,
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function deleteFacility(idFacility: number): Promise<ApiResponse<string>> {
  try {
    const response = await axiosInstance.delete('/Facilities/Mostrar_Facilities_ByFacility', {params: {idFacility}})
    const data = response.data as string

    return {
      success: true,
      status: 204,
      message: 'Successfully deleted facility',
      data,
    }
  } catch (error) {
    return handleError(error)
  }
}
