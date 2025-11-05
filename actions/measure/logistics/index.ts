'use server'

import {getAuthenticatedUserId, handleError} from "@/actions/shared";
import axiosInstance from "@/lib/axios-instance";
import {Logistic} from "@/lib/validation"
// removed mock utils
import { API_BASE_URL, getApiKey, mapPropertyStatusToNumber } from "@/utils/api-config";

export async function createLogistic(logistic: Logistic): Promise<ApiResponse<string>> {
  try {
    const apiKey = await getApiKey();
    const response = await axiosInstance.post(`${API_BASE_URL}/api/logistics?api_key=${apiKey}`, {
      name: logistic.name || '',
      property_status_id: logistic.propertyStatus,
      origin_id: 1, // TODO: Mapear desde origin
      destination_id: 1, // TODO: Mapear desde destination
      description: '',
      vehicle_model: logistic.idCboModel,
      client_id: 1, // TODO: Mapear desde client
      load: logistic.loadLogistic || '',
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

export async function getLogisticsByUserId(): Promise<ApiResponse<Logistic[]>> {
  try {
    const apiKey = await getApiKey();
    const response = await axiosInstance.get(`${API_BASE_URL}/api/logistics?api_key=${apiKey}`)
    const apiData = response.data?.data || []

    const newData: Logistic[] = apiData.map((logistic: any, index: number) => ({
      idControlLogistics: logistic.id || index + 1,
      idUserControl: 66,
      origin: logistic.origin_name,
      destination: logistic.destination_name,
      originzc: '',
      destinationzc: '',
      loadLogistic: logistic.load,
      client: logistic.client_name,
      idCboStatus: mapPropertyStatusToNumber(logistic.property_status),
      name: logistic.name,
      idTravelCboType: 1, // TODO: Mapear
      idCboModel: 1, // TODO: Mapear desde vehicle_model_name
      idCboBrand: 1, // TODO: Mapear
      licensePlate: '',
      propertyStatus: mapPropertyStatusToNumber(logistic.property_status),
      idControlVehicle: 1, // TODO: Mapear
      active: 1,
    }))

    return {
      success: true,
      status: 200,
      data: newData,
      message: 'Successfully getting logistic',
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function getLogisticById(origin: string, destination: string): Promise<ApiResponse<Logistic | null>> {
  try {
    // Buscar por ID si origin/destination son números
    const logisticId = parseInt(origin) || 1;
    const apiKey = await getApiKey();
    const response = await axiosInstance.get(`${API_BASE_URL}/api/logistics/${logisticId}?api_key=${apiKey}`)
    const apiData = response.data?.data

    if (!apiData) {
      return {
        success: true,
        status: 404,
        message: 'Logistic not found',
        data: null,
      }
    }

    const logistic: Logistic = {
      idControlLogistics: apiData.id,
      idUserControl: 66,
      origin: apiData.origin_name,
      destination: apiData.destination_name,
      originzc: '',
      destinationzc: '',
      loadLogistic: apiData.load,
      client: apiData.client_name,
      idCboStatus: mapPropertyStatusToNumber(apiData.property_status),
      name: apiData.name,
      idTravelCboType: 1, // TODO: Mapear
      idCboModel: 1, // TODO: Mapear
      idCboBrand: 1, // TODO: Mapear
      licensePlate: '',
      propertyStatus: mapPropertyStatusToNumber(apiData.property_status),
      idControlVehicle: 1, // TODO: Mapear
      active: 1,
    }

    return {
      success: true,
      status: 200,
      message: 'success',
      data: logistic,
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function updateLogistic(logistic: Logistic): Promise<ApiResponse<string>> {
  try {
    const apiKey = await getApiKey();
    const response = await axiosInstance.put(
      `${API_BASE_URL}/api/logistics/${logistic.idControlLogistics}?api_key=${apiKey}`,
      {
        name: logistic.name || '',
        property_status_id: logistic.propertyStatus,
        origin_id: 1, // TODO: Mapear
        destination_id: 1, // TODO: Mapear
        description: '',
        vehicle_model: logistic.idCboModel,
        client_id: 1, // TODO: Mapear
        load: logistic.loadLogistic || '',
      }
    )
    const data = response.data?.message || 'Successfully updated logistic'

    return {
      success: true,
      status: 200,
      message: 'Successfully updated logistic',
      data: data,
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function deleteLogistic(IdLogistics: number): Promise<ApiResponse<string>> {
  try {
    const apiKey = await getApiKey();
    const response = await axiosInstance.delete(`${API_BASE_URL}/api/logistics/${IdLogistics}?api_key=${apiKey}`)
    const data = response.data?.message || 'Successfully deleted logistic'

    return {
      success: true,
      status: 204,
      message: 'Successfully deleted logistic',
      data,
    }
  } catch (error) {
    return handleError(error)
  }
}
