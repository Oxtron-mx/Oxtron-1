'use server'

import {getAuthenticatedUserId, handleError} from "@/actions/shared";
import axiosInstance from "@/lib/axios-instance";
import {Commuting} from "@/lib/validation";
// removed mock utils
import { API_BASE_URL, getApiKey } from "@/utils/api-config";

export async function createCommuting(commuting: Commuting): Promise<ApiResponse<any>> {
  try {
    const apiKey = await getApiKey();
    const response = await axiosInstance.post(`${API_BASE_URL}/api/commuting?api_key=${apiKey}`, {
      name: 'Transporte de Empleados', // TODO: Agregar name a Commuting type
      facility_id: commuting.idControlFacility,
      description: commuting.description || '',
    })
    const data = response.data?.message || response.data as string

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

export async function getCommutingByUserId(): Promise<ApiResponse<Commuting[]>> {
  try {
    const apiKey = await getApiKey();
    const response = await axiosInstance.get(`${API_BASE_URL}/api/commuting?api_key=${apiKey}`)
    const apiData = response.data?.data || []

    const newData: Commuting[] = apiData.map((commuting: any, index: number) => ({
      idControlCommuting: commuting.id || index + 1,
      idUserControl: 66,
      idControlFacility: 1, // TODO: Mapear desde facility_name
      description: commuting.description || '',
      active: 1,
    }))

    return {
      success: true,
      status: 200,
      data: newData,
      message: 'Successfully getting commuting',
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function getCommutingById(idControlCommuting: number): Promise<ApiResponse<any>> {
  try {
    const apiKey = await getApiKey();
    const response = await axiosInstance.get(`${API_BASE_URL}/api/commuting/${idControlCommuting}?api_key=${apiKey}`)
    const apiData = response.data?.data

    if (!apiData) {
      return {
        success: true,
        status: 404,
        message: 'Commuting not found',
        data: null,
      }
    }

    const commuting: Commuting = {
      idControlCommuting: apiData.id || idControlCommuting,
      idUserControl: 66,
      idControlFacility: 1, // TODO: Mapear desde facility_name
      description: apiData.description || '',
      active: 1,
    }

    return {
      success: true,
      status: 200,
      message: 'success',
      data: commuting,
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function updateCommuting(commuting: Commuting): Promise<ApiResponse<any>> {
  try {
    const apiKey = await getApiKey();
    const response = await axiosInstance.put(
      `${API_BASE_URL}/api/commuting/${commuting.idControlCommuting}?api_key=${apiKey}`,
      {
        name: 'Transporte de Empleados', // TODO: Agregar name a Commuting type
        facility_id: commuting.idControlFacility,
        description: commuting.description || '',
      }
    )
    const data = response.data?.message || 'Successfully updated commuting'

    return {
      success: true,
      status: 200,
      data,
      message: data,
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function deleteCommuting(IdCommuting: number): Promise<ApiResponse<string>> {
  try {
    const apiKey = await getApiKey();
    const response = await axiosInstance.delete(`${API_BASE_URL}/api/commuting/${IdCommuting}?api_key=${apiKey}`)
    const data = response.data?.message || 'Successfully deleted commuting'

    return {
      success: true,
      status: 204,
      message: 'Successfully deleted commuting',
      data,
    }
  } catch (error) {
    return handleError(error)
  }
}
