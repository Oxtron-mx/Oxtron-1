"use server";

import { getAuthenticatedUserId, handleError } from "@/actions/shared";
import axiosInstance from "@/lib/axios-instance";
import { Logistic } from "@/lib/validation";
// removed mock utils
import {
  API_BASE_URL,
  getAccessToken,
  mapPropertyStatusToNumber,
} from "@/utils/api-config";

export async function createLogistic(
  logistic: Logistic
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

    const response = await axiosInstance.post(
      `${API_BASE_URL}/api/logistics`,
      {
        name: logistic.name || "",
        property_status_id: logistic.propertyStatus,
        // Note: origin_id and destination_id need to be location IDs
        // The frontend sends origin/destination as strings (city names)
        // This would require looking up location IDs from city names
        origin_id: 1, // TODO: Lookup location_id from origin city name
        destination_id: 1, // TODO: Lookup location_id from destination city name
        description: "",
        vehicle_model: logistic.idCboModel,
        client_id: 1, // TODO: Lookup client_id from client name using /api/organization/clients
        load: logistic.loadLogistic || "",
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

export async function getLogisticsByUserId(): Promise<ApiResponse<Logistic[]>> {
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

    const response = await axiosInstance.get(`${API_BASE_URL}/api/logistics`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const apiData = response.data?.data || [];

    const newData: Logistic[] = apiData.map((logistic: any, index: number) => ({
      idControlLogistics: logistic.id || index + 1,
      idUserControl: 66,
      origin: logistic.origin_name || "",
      destination: logistic.destination_name || "",
      originzc: "",
      destinationzc: "",
      loadLogistic: logistic.load || "",
      client: logistic.client_name || "",
      idCboStatus: mapPropertyStatusToNumber(logistic.property_status),
      name: logistic.name,
      // Note: Backend returns names but not all IDs in list view
      // These would need catalog/location/client lookups for full mapping
      idTravelCboType: 1, // Would need to determine from vehicle type
      idCboModel: logistic.vehicle_id || 1, // vehicle_id is the model reference
      idCboBrand: 1, // Would need catalog lookup from vehicle_id
      licensePlate: "",
      propertyStatus: mapPropertyStatusToNumber(logistic.property_status),
      idControlVehicle: logistic.vehicle_id || 1,
      active: 1,
    }));

    return {
      success: true,
      status: 200,
      data: newData,
      message: "Successfully getting logistic",
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function getLogisticById(
  origin: string,
  destination: string
): Promise<ApiResponse<Logistic | null>> {
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

    // Buscar por ID si origin/destination son números
    const logisticId = parseInt(origin) || 1;
    const response = await axiosInstance.get(
      `${API_BASE_URL}/api/logistics/${logisticId}`,
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
        message: "Logistic not found",
        data: null,
      };
    }

    const logistic: Logistic = {
      idControlLogistics: apiData.id,
      idUserControl: 66,
      origin: apiData.origin_name || "",
      destination: apiData.destination_name || "",
      originzc: "",
      destinationzc: "",
      loadLogistic: apiData.load || "",
      client: apiData.client_name || "",
      idCboStatus: mapPropertyStatusToNumber(
        apiData.property_status_name || apiData.property_status
      ),
      name: apiData.name,
      // Backend returns IDs in get_logistics_by_id
      idTravelCboType: 1, // Would need to determine from vehicle type
      idCboModel: apiData.vehicle_id || 1,
      idCboBrand: 1, // Would need catalog lookup from vehicle_id
      licensePlate: "",
      propertyStatus: mapPropertyStatusToNumber(
        apiData.property_status_name || apiData.property_status
      ),
      idControlVehicle: apiData.vehicle_id || 1,
      active: 1,
    };

    return {
      success: true,
      status: 200,
      message: "success",
      data: logistic,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function updateLogistic(
  logistic: Logistic
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

    const response = await axiosInstance.put(
      `${API_BASE_URL}/api/logistics/${logistic.idControlLogistics}`,
      {
        name: logistic.name || "",
        property_status_id: logistic.propertyStatus,
        origin_id: 1, // TODO: Lookup location_id from origin city name
        destination_id: 1, // TODO: Lookup location_id from destination city name
        description: "",
        vehicle_model: logistic.idCboModel,
        client_id: 1, // TODO: Lookup client_id from client name
        load: logistic.loadLogistic || "",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = response.data?.message || "Successfully updated logistic";

    return {
      success: true,
      status: 200,
      message: "Successfully updated logistic",
      data: data,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteLogistic(
  IdLogistics: number
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
      `${API_BASE_URL}/api/logistics/${IdLogistics}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = response.data?.message || "Successfully deleted logistic";

    return {
      success: true,
      status: 204,
      message: "Successfully deleted logistic",
      data,
    };
  } catch (error) {
    return handleError(error);
  }
}
