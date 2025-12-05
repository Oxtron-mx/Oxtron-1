'use server'

import {getAuthenticatedUserId, handleError} from "@/actions/shared";
import axiosInstance from "@/lib/axios-instance";
import {Travel} from "@/lib/validation";
// removed mock utils
import { API_BASE_URL, getAccessToken } from "@/utils/api-config";

export async function createTravel(travel: Travel): Promise<ApiResponse<string>> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return {
        success: false,
        status: 401,
        message: "Authentication required",
        data: null,
      };
    }
    
    const response = await axiosInstance.post(
      `${API_BASE_URL}/api/travels`,
      {
        name: travel.idTravel || '',
        description: travel.description || '',
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
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
    const token = await getAccessToken();
    if (!token) {
      return {
        success: false,
        status: 401,
        message: "Authentication required",
        data: [],
      };
    }
    
    const response = await axiosInstance.get(
      `${API_BASE_URL}/api/travels`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
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
    const token = await getAccessToken();
    if (!token) {
      return {
        success: false,
        status: 401,
        message: "Authentication required",
        data: null,
      };
    }
    
    const response = await axiosInstance.get(
      `${API_BASE_URL}/api/travels/${idTravel}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
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
    const token = await getAccessToken();
    if (!token) {
      return {
        success: false,
        status: 401,
        message: "Authentication required",
        data: null,
      };
    }
    
    const response = await axiosInstance.put(
      `${API_BASE_URL}/api/travels/${travel.idControlTravel}`,
      {
        name: travel.idTravel || '',
        description: travel.description || '',
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
    const token = await getAccessToken();
    if (!token) {
      return {
        success: false,
        status: 401,
        message: "Authentication required",
        data: null,
      };
    }
    
    const response = await axiosInstance.delete(
      `${API_BASE_URL}/api/travels/${idTravels}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
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
