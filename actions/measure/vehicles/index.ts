"use server";
import { getAuthenticatedUserId, handleError } from "@/actions/shared";
import axiosInstance from "@/lib/axios-instance";
import { Vehicle } from "@/lib/validation";
import { getVehiclesByUserIdData, getVehicleByIdData } from "@/utils/vehicles";
import {
  API_BASE_URL,
  USE_MOCK_DATA,
  getApiKey,
  mapPropertyStatusToNumber,
} from "@/utils/api-config";

export async function createVehicle(
  vehicle: Vehicle
): Promise<ApiResponse<string>> {
  try {
    if (USE_MOCK_DATA) {
      return {
        success: true,
        status: 201,
        data: `Vehicle '${vehicle.name || "Vehicle"}' creado exitosamente`,
        message: `Vehicle '${vehicle.name || "Vehicle"}' creado exitosamente`,
      };
    }

    const apiKey = await getApiKey();
    const response = await axiosInstance.post(
      `${API_BASE_URL}/api/vehicles?api_key=${apiKey}`,
      {
        name: vehicle.name || "",
        description: "",
        vehicle_model: vehicle.idCboModel,
        property_status_id: vehicle.idStatus,
        licence_plate: vehicle.licensePlate || "",
        quantity: 1,
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
    if (USE_MOCK_DATA) {
      const newData: Vehicle[] = getVehiclesByUserIdData.data.map(
        (vehicle, index) => ({
          idControlVehicle: vehicle.id || index + 1,
          idUserControl: 66,
          idStatus: mapPropertyStatusToNumber(vehicle.property_status),
          name: vehicle.name,
          idCboBrand: 1, // TODO: Mapear desde vehicle_model_name
          idCboModel: 1, // TODO: Mapear desde vehicle_model_name
          idCboType: 1, // TODO: Mapear desde vehicle_model_name
          licensePlate: vehicle.licence_plate,
          active: 1,
        })
      );

      return {
        success: true,
        status: 200,
        data: newData,
        message: "Successfully getting vehicles",
      };
    }

    const apiKey = await getApiKey();
    const response = await axiosInstance.get(
      `${API_BASE_URL}/api/vehicles?api_key=${apiKey}`
    );
    const apiData = response.data?.data || [];

    const newData: Vehicle[] = apiData.map((vehicle: any, index: number) => ({
      idControlVehicle: vehicle.id || index + 1,
      idUserControl: 66,
      idStatus: mapPropertyStatusToNumber(vehicle.property_status),
      name: vehicle.name,
      idCboBrand: 1, // TODO: Mapear desde vehicle_model_name
      idCboModel: 1, // TODO: Mapear desde vehicle_model_name
      idCboType: 1, // TODO: Mapear desde vehicle_model_name
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
    if (USE_MOCK_DATA) {
      const mockVehicle = getVehicleByIdData.data;
      const vehicle: Vehicle = {
        idControlVehicle: mockVehicle.id,
        idUserControl: 66,
        idStatus: mapPropertyStatusToNumber(mockVehicle.property_status),
        name: mockVehicle.name,
        idCboBrand: 1, // TODO: Mapear desde vehicle_model_name
        idCboModel: 1, // TODO: Mapear desde vehicle_model_name
        idCboType: 1, // TODO: Mapear desde vehicle_model_name
        licensePlate: mockVehicle.licence_plate,
        active: 1,
      };

      return {
        success: true,
        status: 200,
        message: "success",
        data: vehicle,
      };
    }

    // Buscar por ID en lugar de nombre si name es un número
    const vehicleId = parseInt(name) || 1;
    const apiKey = await getApiKey();
    const response = await axiosInstance.get(
      `${API_BASE_URL}/api/vehicles/${vehicleId}?api_key=${apiKey}`
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
      idStatus: mapPropertyStatusToNumber(apiData.property_status),
      name: apiData.name,
      idCboBrand: 1, // TODO: Mapear desde vehicle_model_name
      idCboModel: 1, // TODO: Mapear desde vehicle_model_name
      idCboType: 1, // TODO: Mapear desde vehicle_model_name
      licensePlate: apiData.licence_plate,
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
    if (USE_MOCK_DATA) {
      return {
        success: true,
        status: 200,
        message: `Vehicle '${
          vehicle.name || "Vehicle"
        }' actualizado exitosamente`,
        data: `Vehicle '${vehicle.name || "Vehicle"}' actualizado exitosamente`,
      };
    }

    const apiKey = await getApiKey();
    const response = await axiosInstance.put(
      `${API_BASE_URL}/api/vehicles/${vehicle.idControlVehicle}?api_key=${apiKey}`,
      {
        name: vehicle.name || "",
        description: "",
        vehicle_model: vehicle.idCboModel,
        property_status_id: vehicle.idStatus,
        licence_plate: vehicle.licensePlate || "",
        quantity: 1,
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
    if (USE_MOCK_DATA) {
      return {
        success: true,
        status: 204,
        message: "Successfully deleted vehicle",
        data: "Successfully deleted vehicle",
      };
    }

    const apiKey = await getApiKey();
    const response = await axiosInstance.delete(
      `${API_BASE_URL}/api/vehicles/${idVehicles}?api_key=${apiKey}`
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
