"use server";

import { handleError } from "@/actions/shared";
import axiosInstance from "@/lib/axios-instance";
import { Facility } from "@/lib/validation";
// removed mock utils

import {
  API_BASE_URL,
  getApiKey,
  mapPropertyStatusToNumber,
} from "@/utils/api-config";

async function resolveLocationIds(
  countryName: string,
  cityName: string,
  apiKey: string
): Promise<{ countryId: number; cityId: number }> {
  // Obtener países
  const countriesRes = await axiosInstance.get(
    `${API_BASE_URL}/api/catalogs/country`
  );
  const countries = countriesRes.data?.data || [];
  const country = countries.find(
    (c: any) => c.name?.toLowerCase() === countryName?.toLowerCase()
  );
  const countryId = country?.id ?? 1;

  // Obtener ciudades del país
  const citiesRes = await axiosInstance.get(
    `${API_BASE_URL}/api/catalogs/country/${countryId}/cities`
  );
  const cities = citiesRes.data?.data || [];
  const city = cities.find(
    (ct: any) => ct.name?.toLowerCase() === cityName?.toLowerCase()
  );
  const cityId = city?.id ?? 1;

  return { countryId, cityId };
}

export async function createFacility(
  facility: Facility
): Promise<ApiResponse<string>> {
  try {
    const apiKey = await getApiKey();
    const { countryId, cityId } = await resolveLocationIds(
      facility.country,
      facility.city,
      apiKey
    );
    const response = await axiosInstance.post(
      `${API_BASE_URL}/api/facilities?api_key=${apiKey}`,
      {
        name: facility.idFacility,
        description: facility.description || "",
        country_id: countryId,
        city_id: cityId,
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
    const apiKey = await getApiKey();
    const response = await axiosInstance.get(
      `${API_BASE_URL}/api/facilities?api_key=${apiKey}`
    );
    const apiData = response.data?.data || [];

    // Mapear respuesta de API a formato de Facility
    const newData: Facility[] = apiData.map((facility: any, index: number) => ({
      idFacility: facility.name,
      propertyStatus: mapPropertyStatusToNumber(facility.property_status),
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
      propertyStatus: mapPropertyStatusToNumber(apiData.property_status),
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
    const apiKey = await getApiKey();
    const { countryId, cityId } = await resolveLocationIds(
      facility.country,
      facility.city,
      apiKey
    );
    const response = await axiosInstance.put(
      `${API_BASE_URL}/api/facilities/${facility.idControlFacility}?api_key=${apiKey}`,
      {
        name: facility.idFacility,
        description: facility.description || "",
        country_id: countryId,
        city_id: cityId,
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
