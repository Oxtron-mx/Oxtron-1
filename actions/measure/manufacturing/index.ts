'use server'

import {getAuthenticatedUserId, handleError} from "@/actions/shared";
import axiosInstance from "@/lib/axios-instance";
import {Manufacturing} from "@/lib/validation"
import {ComboTypeOfEquipment} from "@/constants/types";
// removed mock utils
import { API_BASE_URL, getApiKey } from "@/utils/api-config";

export async function createManufacturing(manufacturing: Manufacturing) {
  try {
    const apiKey = await getApiKey();
    const response = await axiosInstance.post(`${API_BASE_URL}/api/manufacturing?api_key=${apiKey}`, {
      name: manufacturing.process,
      facility_id: manufacturing.idFacility,
      equipment_id: manufacturing.idTypeEquipment,
      emission_factor_id: manufacturing.idTypeFuelUsed,
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

export async function getManufacturingByUserId(): Promise<ApiResponse<Manufacturing[]>> {
  try {
    const apiKey = await getApiKey();
    const response = await axiosInstance.get(`${API_BASE_URL}/api/manufacturing?api_key=${apiKey}`)
    const apiData = response.data?.data || []

    const newData: Manufacturing[] = apiData.map((manufacturing: any, index: number) => ({
      idControlManufacturing: manufacturing.id || index + 1,
      idUserControl: 66,
      process: manufacturing.process_name,
      idFacility: 1, // TODO: Mapear desde facility_name
      idTypeEquipment: 1, // TODO: Mapear desde equipment_name
      idTypeFuelUsed: 1, // TODO: Mapear desde emission_factor_name
      idTypeEquipmentCode: 0,
      active: 1,
    }))

    return {
      success: true,
      status: 200,
      data: newData,
      message: 'Successfully getting manufacturing',
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function getManufacturingById(process: string): Promise<ApiResponse<Manufacturing | null>> {
  try {
    // Buscar por ID si process es un número
    const manufacturingId = parseInt(process) || 1;
    const apiKey = await getApiKey();
    const response = await axiosInstance.get(`${API_BASE_URL}/api/manufacturing/${manufacturingId}?api_key=${apiKey}`)
    const apiData = response.data?.data

    if (!apiData) {
      return {
        success: true,
        status: 404,
        message: 'Manufacturing not found',
        data: null,
      }
    }

    const manufacturing: Manufacturing = {
      idControlManufacturing: apiData.id,
      idUserControl: 66,
      process: apiData.process_name,
      idFacility: 1, // TODO: Mapear desde facility_name
      idTypeEquipment: 1, // TODO: Mapear desde equipment_name
      idTypeFuelUsed: 1, // TODO: Mapear desde emission_factor_name
      idTypeEquipmentCode: 0,
      active: 1,
    }

    return {
      success: true,
      status: 200,
      message: 'success',
      data: manufacturing,
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function updateManufacturing(manufacturing: Manufacturing): Promise<ApiResponse<string>> {
  try {
    const apiKey = await getApiKey();
    const response = await axiosInstance.put(
      `${API_BASE_URL}/api/manufacturing/${manufacturing.idControlManufacturing}?api_key=${apiKey}`,
      {
        name: manufacturing.process,
        facility_id: manufacturing.idFacility,
        equipment_id: manufacturing.idTypeEquipment,
        emission_factor_id: manufacturing.idTypeFuelUsed,
      }
    )
    const data = response.data?.message || 'Successfully updated manufacturing'

    return {
      success: true,
      status: 200,
      message: 'Successfully updated manufacturing',
      data: data,
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function deleteManufacturing(IdManufacturing: number) {
  try {
    const apiKey = await getApiKey();
    const response = await axiosInstance.delete(`${API_BASE_URL}/api/manufacturing/${IdManufacturing}?api_key=${apiKey}`)
    const data = response.data?.message || 'Successfully deleted manufacturing'

    return {
      success: true,
      status: 204,
      message: 'Successfully deleted manufacturing',
      data,
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function getTypeOfEquipment(): Promise<ApiResponse<ComboTypeOfEquipment[]>> {
  try {
    // Este endpoint no está en la nueva API, mantener el comportamiento original
    const response = await axiosInstance.get('/ManufacturingCboEquipment/Mostrar_ManufacturingCboEquipment')
    const data = response.data as ComboTypeOfEquipment[]

    return {
      success: true,
      status: 200,
      message: 'Successfully getting manufacturingCboEquipment',
      data: data.filter((typeOfEq) => typeOfEq.active === 1),
    }
  } catch (error) {
    return handleError(error)
  }
}
