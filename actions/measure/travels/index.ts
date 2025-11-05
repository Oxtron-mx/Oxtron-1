'use server'

import {getAuthenticatedUserId, handleError} from "@/actions/shared";
import axiosInstance from "@/lib/axios-instance";
import {Travel} from "@/lib/validation";
import { getTravelsByUserIdData, getTravelByIdData } from "@/utils/travels";
import { API_BASE_URL, USE_MOCK_DATA, getApiKey } from "@/utils/api-config";

export async function createTravel(travel: Travel): Promise<ApiResponse<string>> {
  try {
    if (USE_MOCK_DATA) {
      return {
        success: true,
        status: 201,
        data: `Travel '${travel.idTravel || 'Travel'}' creado exitosamente`,
        message: `Travel '${travel.idTravel || 'Travel'}' creado exitosamente`,
      }
    }

    const apiKey = await getApiKey();
    const response = await axiosInstance.post(`${API_BASE_URL}/api/travels?api_key=${apiKey}`, {
      name: travel.idTravel || '',
      description: travel.description || '',
    })
    const data = response.data?.message || response.data as string

    return {
      success: true,
      status: 201,
      data,
      message: data,
    }
  } catch (error) {
    console.error('Error en createTravel:', error)
    return handleError(error)
  }
}

export async function getTravelsByUserId(): Promise<ApiResponse<Travel[]>> {
  try {
    if (USE_MOCK_DATA) {
      const newData: Travel[] = getTravelsByUserIdData.data.map((travel, index) => ({
        idControlTravel: travel.id || index + 1,
        idUserControl: 66,
        idTravel: travel.name,
        description: travel.description || '',
        active: 1,
      }))

      return {
        success: true,
        status: 200,
        data: newData,
        message: 'Successfully getting travels',
      }
    }

    const apiKey = await getApiKey();
    const response = await axiosInstance.get(`${API_BASE_URL}/api/travels?api_key=${apiKey}`)
    const apiData = response.data?.data || []

    const newData: Travel[] = apiData.map((travel: any, index: number) => ({
      idControlTravel: travel.id || index + 1,
      idUserControl: 66,
      idTravel: travel.name,
      description: travel.description || '',
      active: 1,
    }))

    return {
      success: true,
      status: 200,
      data: newData,
      message: 'Successfully getting travels',
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function getTravelById(idTravel: number): Promise<ApiResponse<Travel | null>> {
  try {
    if (USE_MOCK_DATA) {
      const mockTravel = getTravelByIdData.data;
      const travel: Travel = {
        idControlTravel: mockTravel.id || idTravel,
        idUserControl: 66,
        idTravel: mockTravel.name,
        description: mockTravel.description || '',
        active: 1,
      }

      return {
        success: true,
        status: 200,
        message: 'success',
        data: travel,
      }
    }

    const apiKey = await getApiKey();
    const response = await axiosInstance.get(`${API_BASE_URL}/api/travels/${idTravel}?api_key=${apiKey}`)
    const apiData = response.data?.data

    if (!apiData) {
      return {
        success: true,
        status: 404,
        message: 'Travel not found',
        data: null,
      }
    }

    const travel: Travel = {
      idControlTravel: apiData.id || idTravel,
      idUserControl: 66,
      idTravel: apiData.name,
      description: apiData.description || '',
      active: 1,
    }

    return {
      success: true,
      status: 200,
      message: 'success',
      data: travel,
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function updateTravel(travel: Travel): Promise<ApiResponse<string>> {
  try {
    if (USE_MOCK_DATA) {
      return {
        success: true,
        status: 200,
        data: `Travel '${travel.idTravel || 'Travel'}' actualizado exitosamente`,
        message: `Travel '${travel.idTravel || 'Travel'}' actualizado exitosamente`,
      }
    }

    const apiKey = await getApiKey();
    const response = await axiosInstance.put(
      `${API_BASE_URL}/api/travels/${travel.idControlTravel}?api_key=${apiKey}`,
      {
        name: travel.idTravel || '',
        description: travel.description || '',
      }
    )
    const data = response.data?.message || 'Successfully updated travel'

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

export async function deleteTravel(idTravels: number): Promise<ApiResponse<string>> {
  try {
    if (USE_MOCK_DATA) {
      return {
        success: true,
        status: 204,
        message: 'Successfully deleted travel',
        data: 'Successfully deleted travel',
      }
    }

    const apiKey = await getApiKey();
    const response = await axiosInstance.delete(`${API_BASE_URL}/api/travels/${idTravels}?api_key=${apiKey}`)
    const data = response.data?.message || 'Successfully deleted travel'

    return {
      success: true,
      status: 204,
      message: 'Successfully deleted travel',
      data,
    }
  } catch (error) {
    return handleError(error)
  }
}
