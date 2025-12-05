"use server";

import { handleError } from "@/actions/shared";
import axiosInstance from "@/lib/axios-instance";
import { Facility } from "@/lib/validation";
// removed mock utils

import { getAccessToken, mapPropertyStatusToNumber } from "@/utils/api-config";

async function resolveLocationIds(
  countryName: string,
  cityName: string,
  token: string
): Promise<{ countryId: number; cityId: number }> {
  // Obtener países
  const countriesRes = await axiosInstance.get(`/api/catalogs/country`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const countries = countriesRes.data?.data || [];
  const country = countries.find(
    (c: any) => c.name?.toLowerCase() === countryName?.toLowerCase()
  );
  const countryId = country?.id ?? 1;

  // Obtener ciudades del país
  const citiesRes = await axiosInstance.get(
    `/api/catalogs/country/${countryId}/cities`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
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
    const token = await getAccessToken();
    if (!token) {
      return {
        success: false,
        status: 401,
        message: "Authentication required",
        data: null,
      };
    }

    const { countryId, cityId } = await resolveLocationIds(
      facility.country,
      facility.city,
      token
    );
    const response = await axiosInstance.post(
      `/api/facilities`,
      {
        name: facility.idFacility,
        description: facility.description || "",
        country_id: countryId,
        city_id: cityId,
        property_status_id: facility.propertyStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    console.log("getFacilitiesByUserId: Starting");
    const token = await getAccessToken();
    console.log("getFacilitiesByUserId: Token received", token ? "Yes" : "No");
    if (!token) {
      console.error("getFacilitiesByUserId: No token available");
      return {
        success: false,
        status: 401,
        message: "Authentication required",
        data: [],
      };
    }

    console.log("getFacilitiesByUserId: Making API call to /api/facilities/");
    const response = await axiosInstance.get(`/api/facilities/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("getFacilitiesByUserId: API response received", response.data);
    const apiData = response.data?.data || [];
    console.log("getFacilitiesByUserId: API data extracted", apiData);

    // Mapear respuesta de API a formato de Facility
    const newData: Facility[] = apiData.map((facility: any, index: number) => ({
      idFacility: facility.name,
      propertyStatus: mapPropertyStatusToNumber(
        facility.property_status || facility.property_status_name
      ),
      city: facility.city_name,
      country: facility.country_name,
      active: 1,
      idControlFacility: facility.id || index + 1,
      idUserControl: 66,
      description: facility.description || "",
    }));
    console.log("getFacilitiesByUserId: Mapped data", newData);

    return {
      success: true,
      status: 200,
      data: newData,
      message: "Successfully getting facilities",
    };
  } catch (error) {
    console.error("getFacilitiesByUserId: Error caught", error);
    return handleError(error);
  }
}

export async function getFacilityById(
  idFacility: number
): Promise<ApiResponse<Facility | null>> {
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

    const response = await axiosInstance.get(`/api/facilities/${idFacility}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
      propertyStatus: mapPropertyStatusToNumber(
        apiData.property_status_name || apiData.property_status
      ),
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
    const token = await getAccessToken();
    if (!token) {
      return {
        success: false,
        status: 401,
        message: "Authentication required",
        data: null,
      };
    }

    const { countryId, cityId } = await resolveLocationIds(
      facility.country,
      facility.city,
      token
    );
    const response = await axiosInstance.put(
      `/api/facilities/${facility.idControlFacility}`,
      {
        name: facility.idFacility,
        description: facility.description || "",
        country_id: countryId,
        city_id: cityId,
        property_status_id: facility.propertyStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      `/api/facilities/${idFacility}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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
