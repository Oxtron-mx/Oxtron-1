"use server";

import { getAuthenticatedUserId, handleError } from "@/actions/shared";
import axiosInstance from "@/lib/axios-instance";
import { Commuting } from "@/lib/validation";
// removed mock utils
import { API_BASE_URL, getAccessToken } from "@/utils/api-config";

export async function createCommuting(
  commuting: Commuting
): Promise<ApiResponse<any>> {
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
      `${API_BASE_URL}/api/commuting`,
      {
        name: "Transporte de Empleados", // TODO: Agregar name a Commuting type
        facility_id: commuting.idControlFacility,
        description: commuting.description || "",
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

export async function getCommutingByUserId(): Promise<
  ApiResponse<Commuting[]>
> {
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

    const response = await axiosInstance.get(`${API_BASE_URL}/api/commuting`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const apiData = response.data?.data || [];

    const newData: Commuting[] = apiData.map(
      (commuting: any, index: number) => ({
        idControlCommuting: commuting.id || index + 1,
        idUserControl: 66,
        // Backend returns facility_name in list view, but facility_id is available in detail view
        // For full mapping, would need to lookup facility by name using /api/facilities
        idControlFacility: commuting.facility_id || 1,
        description: commuting.description || "",
        active: 1,
      })
    );

    return {
      success: true,
      status: 200,
      data: newData,
      message: "Successfully getting commuting",
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function getCommutingById(
  idControlCommuting: number
): Promise<ApiResponse<any>> {
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
      `${API_BASE_URL}/api/commuting/${idControlCommuting}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const apiData = response.data?.data;

    if (!apiData) {
      return {
        success: true,
        status: 404,
        message: "Commuting not found",
        data: null,
      };
    }

    const commuting: Commuting = {
      idControlCommuting: apiData.id || idControlCommuting,
      idUserControl: 66,
      // Backend returns facility_id in get_commuting_by_id
      idControlFacility: apiData.facility_id || 1,
      description: apiData.description || "",
      active: 1,
    };

    return {
      success: true,
      status: 200,
      message: "success",
      data: commuting,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function updateCommuting(
  commuting: Commuting
): Promise<ApiResponse<any>> {
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
      `${API_BASE_URL}/api/commuting/${commuting.idControlCommuting}`,
      {
        name: "Transporte de Empleados", // TODO: Agregar name a Commuting type
        facility_id: commuting.idControlFacility,
        description: commuting.description || "",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = response.data?.message || "Successfully updated commuting";

    return {
      success: true,
      status: 200,
      data,
      message: data,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteCommuting(
  IdCommuting: number
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
      `${API_BASE_URL}/api/commuting/${IdCommuting}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = response.data?.message || "Successfully deleted commuting";

    return {
      success: true,
      status: 204,
      message: "Successfully deleted commuting",
      data,
    };
  } catch (error) {
    return handleError(error);
  }
}
