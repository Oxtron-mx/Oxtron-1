"use server";

import { handleError } from "@/actions/shared";
import axiosInstance from "@/lib/axios-instance";
import { Facility } from "@/lib/validation";
import {
  getFacilitiesByUserIdData,
  getFacilityByIdData,
} from "@/utils/facilities";

import {
  API_BASE_URL,
  USE_MOCK_DATA,
  getApiKey,
  mapPropertyStatusToNumber,
} from "@/utils/api-config";

export async function createFacility(
  facility: Facility
): Promise<ApiResponse<string>> {
  try {
    if (USE_MOCK_DATA) {
      // Simular respuesta de creación
      return {
        success: true,
        status: 201,
        data: `Facility '${facility.idFacility}' creado exitosamente`,
        message: `Facility '${facility.idFacility}' creado exitosamente`,
      };
    }

    const apiKey = await getApiKey();
    const response = await axiosInstance.post(
      `${API_BASE_URL}/api/facilities?api_key=${apiKey}`,
      {
        name: facility.idFacility,
        description: facility.description || "",
        country_id: 1, // TODO: Mapear desde facility.country
        city_id: 1, // TODO: Mapear desde facility.city
        property_status_id: facility.propertyStatus,
      }
    );
    const data = response.data?.message || (response.data as string);

    return {
      success: true,
      status: 201,
      data,
      message: data,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function getFacilitiesByUserId(): Promise<
  ApiResponse<Facility[]>
> {
  try {
    if (USE_MOCK_DATA) {
      // Mapear datos mock a formato de Facility
      const newData = getFacilitiesByUserIdData.data.map((facility, index) => ({
        idFacility: facility.name,
        propertyStatus: mapPropertyStatusToNumber(facility.property_status),
        city: facility.city_name,
        country: facility.country_name,
        active: 1,
        idControlFacility: index + 1,
        idUserControl: 66,
        description: facility.description || "",
      }));
      return {
        success: true,
        status: 200,
        data: newData,
        message: "Successfully getting facilities",
      };
    }

    const apiKey = await getApiKey();
    const response = await axiosInstance.get(
      `${API_BASE_URL}/api/facilities?api_key=${apiKey}`
    );
    const apiData = response.data?.data || [];

    // Mapear respuesta de API a formato de Facility
    const newData: Facility[] = apiData.map((facility: any, index: number) => ({
      idFacility: facility.name,
      propertyStatus: 1, // TODO: Mapear desde property_status
      city: facility.city_name,
      country: facility.country_name,
      active: 1,
      idControlFacility: facility.id || index + 1,
      idUserControl: 66,
      description: facility.description || "",
    }));

    return {
      success: true,
      status: 200,
      data: newData,
      message: "Successfully getting facilities",
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function getFacilityById(
  idFacility: number
): Promise<ApiResponse<Facility | null>> {
  try {
    if (USE_MOCK_DATA) {
      // Buscar en datos mock o usar el primer elemento
      const mockFacility =
        getFacilityByIdData.data || getFacilitiesByUserIdData.data[0];
      const facility: Facility = {
        idFacility: mockFacility.name,
        propertyStatus: mapPropertyStatusToNumber(mockFacility.property_status),
        city: mockFacility.city_name,
        country: mockFacility.country_name,
        active: 1,
        idControlFacility: idFacility,
        idUserControl: 66,
        description: mockFacility.description || "",
      };

      return {
        success: true,
        status: 200,
        message: "success",
        data: facility,
      };
    }

    const apiKey = await getApiKey();
    const response = await axiosInstance.get(
      `${API_BASE_URL}/api/facilities/${idFacility}?api_key=${apiKey}`
    );
    const apiData = response.data?.data;

    if (!apiData) {
      return {
        success: true,
        status: 404,
        message: "Facility not found",
        data: null,
      };
    }

    // Mapear respuesta de API a formato de Facility
    const facility: Facility = {
      idFacility: apiData.name,
      propertyStatus: 1, // TODO: Mapear desde property_status
      city: apiData.city_name,
      country: apiData.country_name,
      active: 1,
      idControlFacility: apiData.id || idFacility,
      idUserControl: 66,
      description: apiData.description || "",
    };

    return {
      success: true,
      status: 200,
      message: "success",
      data: facility,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function updateFacility(
  facility: Facility
): Promise<ApiResponse<string>> {
  try {
    if (USE_MOCK_DATA) {
      return {
        success: true,
        status: 200,
        message: `Facility '${facility.idFacility}' actualizado exitosamente`,
        data: `Facility '${facility.idFacility}' actualizado exitosamente`,
      };
    }

    const apiKey = await getApiKey();
    const response = await axiosInstance.put(
      `${API_BASE_URL}/api/facilities/${facility.idControlFacility}?api_key=${apiKey}`,
      {
        name: facility.idFacility,
        description: facility.description || "",
        country_id: 1, // TODO: Mapear desde facility.country
        city_id: 1, // TODO: Mapear desde facility.city
        property_status_id: facility.propertyStatus,
      }
    );
    const data = response.data?.message || "Successfully updated facility";

    return {
      success: true,
      status: 200,
      message: "Successfully updated facility",
      data: data,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteFacility(
  idFacility: number
): Promise<ApiResponse<string>> {
  try {
    if (USE_MOCK_DATA) {
      return {
        success: true,
        status: 204,
        message: "Successfully deleted facility",
        data: "Successfully deleted facility",
      };
    }

    const apiKey = await getApiKey();
    const response = await axiosInstance.delete(
      `${API_BASE_URL}/api/facilities/${idFacility}?api_key=${apiKey}`
    );
    const data = response.data?.message || "Successfully deleted facility";

    return {
      success: true,
      status: 204,
      message: "Successfully deleted facility",
      data,
    };
  } catch (error) {
    return handleError(error);
  }
}
