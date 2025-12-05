"use server";
import { handleError } from "@/actions/shared";
import axiosInstance from "@/lib/axios-instance";
import { Vehicle } from "@/lib/validation";
import {
  API_BASE_URL,
  getAccessToken,
  mapPropertyStatusToNumber,
} from "@/utils/api-config";

export async function createVehicle(
  vehicle: Vehicle
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
      `${API_BASE_URL}/api/vehicles`,
      {
        name: vehicle.name || "",
        description: "",
        vehicle_model: vehicle.idCboModel,
        property_status_id: vehicle.idStatus,
        licence_plate: vehicle.licensePlate || "",
        quantity: 1,
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

export async function getVehiclesByUserId(): Promise<ApiResponse<Vehicle[]>> {
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

    const response = await axiosInstance.get(`${API_BASE_URL}/api/vehicles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const apiData = response.data?.data || [];

    const newData: Vehicle[] = apiData.map((vehicle: any, index: number) => ({
      idControlVehicle: vehicle.id || index + 1,
      idUserControl: 66,
      idStatus: mapPropertyStatusToNumber(vehicle.property_status),
      name: vehicle.name,
      // Note: Backend returns vehicle_model_name but not model_id/brand_id/type_id
      // To get these, we'd need to query catalogs with vehicle_model_name
      // For now, using defaults - this can be improved by modifying backend to return model_id
      idCboBrand: vehicle.model_id ? 1 : 1, // Would need catalog lookup
      idCboModel: vehicle.model_id || 1,
      idCboType: vehicle.model_id ? 1 : 1, // Would need catalog lookup
      licensePlate: vehicle.licence_plate,
      active: 1,
    }));

    return {
      success: true,
      status: 200,
      data: newData,
      message: "Successfully getting vehicles",
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function getVehicleById(
  name: string
): Promise<ApiResponse<Vehicle | null>> {
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

    // Buscar por ID en lugar de nombre si name es un número
    const vehicleId = Number.parseInt(name, 10) || 1;
    const response = await axiosInstance.get(
      `${API_BASE_URL}/api/vehicles/${vehicleId}`,
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
        message: "Vehicle not found",
        data: null,
      };
    }

    const vehicle: Vehicle = {
      idControlVehicle: apiData.id,
      idUserControl: 66,
      idStatus: mapPropertyStatusToNumber(
        apiData.property_status_name || apiData.property_status
      ),
      name: apiData.name,
      // Backend returns model_id in get_vehicle_by_id, but not brand_id/type_id
      // These would need to be obtained from vehicle model catalog
      idCboBrand: 1, // Would need catalog lookup from model_id
      idCboModel: apiData.model_id || 1,
      idCboType: 1, // Would need catalog lookup from model_id
      licensePlate: apiData.license_plate || apiData.licence_plate,
      active: 1,
    };

    return {
      success: true,
      status: 200,
      message: "success",
      data: vehicle,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function updateVehicle(
  vehicle: Vehicle
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
      `${API_BASE_URL}/api/vehicles/${vehicle.idControlVehicle}`,
      {
        name: vehicle.name || "",
        description: "",
        vehicle_model: vehicle.idCboModel,
        property_status_id: vehicle.idStatus,
        licence_plate: vehicle.licensePlate || "",
        quantity: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = response.data?.message || "Successfully updated vehicle";

    return {
      success: true,
      status: 200,
      message: "Successfully updated vehicle",
      data: data,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteVehicle(idVehicles: number) {
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
      `${API_BASE_URL}/api/vehicles/${idVehicles}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = response.data?.message || "Successfully deleted vehicle";

    return {
      success: true,
      status: 204,
      message: "Successfully deleted vehicle",
      data,
    };
  } catch (error) {
    return handleError(error);
  }
}
