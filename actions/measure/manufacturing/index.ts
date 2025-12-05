"use server";

import { handleError } from "@/actions/shared";
import axiosInstance from "@/lib/axios-instance";
import { Manufacturing } from "@/lib/validation";
import { ComboTypeOfEquipment } from "@/constants/types";
// removed mock utils
import { API_BASE_URL, getAccessToken } from "@/utils/api-config";

export async function createManufacturing(manufacturing: Manufacturing) {
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
      `${API_BASE_URL}/api/manufacturing`,
      {
        name: manufacturing.process,
        facility_id: manufacturing.idFacility,
        equipment_id: manufacturing.idTypeEquipment,
        emission_factor_id: manufacturing.idTypeFuelUsed,
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

export async function getManufacturingByUserId(): Promise<
  ApiResponse<Manufacturing[]>
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

    const response = await axiosInstance.get(
      `${API_BASE_URL}/api/manufacturing`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const apiData = response.data?.data || [];

    const newData: Manufacturing[] = apiData.map(
      (manufacturing: any, index: number) => ({
        idControlManufacturing: manufacturing.id || index + 1,
        idUserControl: 66,
        process: manufacturing.process_name || manufacturing.name,
        // Backend returns names in list view, but IDs are available in detail view
        // For full mapping, would need to lookup facility/equipment/emission_factor by name
        idFacility: manufacturing.facility_id || 1,
        idTypeEquipment: manufacturing.equipment_id || 1,
        idTypeFuelUsed: manufacturing.emission_factor_id || 1,
        idTypeEquipmentCode: 0,
        active: 1,
      })
    );

    return {
      success: true,
      status: 200,
      data: newData,
      message: "Successfully getting manufacturing",
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function getManufacturingById(
  process: string
): Promise<ApiResponse<Manufacturing | null>> {
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

    // Buscar por ID si process es un número
    const manufacturingId = Number.parseInt(process, 10) || 1;
    const response = await axiosInstance.get(
      `${API_BASE_URL}/api/manufacturing/${manufacturingId}`,
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
        message: "Manufacturing not found",
        data: null,
      };
    }

    const manufacturing: Manufacturing = {
      idControlManufacturing: apiData.id,
      idUserControl: 66,
      process: apiData.process_name || apiData.name,
      // Backend returns IDs in get_manufacturing_by_id
      idFacility: apiData.facility_id || 1,
      idTypeEquipment: apiData.equipment_id || 1,
      idTypeFuelUsed: apiData.emission_factor_id || 1,
      idTypeEquipmentCode: 0,
      active: 1,
    };

    return {
      success: true,
      status: 200,
      message: "success",
      data: manufacturing,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function updateManufacturing(
  manufacturing: Manufacturing
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
      `${API_BASE_URL}/api/manufacturing/${manufacturing.idControlManufacturing}`,
      {
        name: manufacturing.process,
        facility_id: manufacturing.idFacility,
        equipment_id: manufacturing.idTypeEquipment,
        emission_factor_id: manufacturing.idTypeFuelUsed,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = response.data?.message || "Successfully updated manufacturing";

    return {
      success: true,
      status: 200,
      message: "Successfully updated manufacturing",
      data: data,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteManufacturing(IdManufacturing: number) {
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
      `${API_BASE_URL}/api/manufacturing/${IdManufacturing}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = response.data?.message || "Successfully deleted manufacturing";

    return {
      success: true,
      status: 204,
      message: "Successfully deleted manufacturing",
      data,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function getTypeOfEquipment(): Promise<
  ApiResponse<ComboTypeOfEquipment[]>
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

    // Use the new catalog endpoint for equipment types
    const response = await axiosInstance.get(
      `${API_BASE_URL}/api/catalogs/equipment_type`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const apiData = response.data?.data || [];

    // Map to ComboTypeOfEquipment format
    const data: ComboTypeOfEquipment[] = apiData.map((equipment: any) => ({
      id: equipment.id?.toString() || "",
      name: equipment.name || equipment.description || "",
      description: equipment.description || equipment.name || "",
      active:
        equipment.is_active !== undefined
          ? equipment.is_active
            ? 1
            : 0
          : equipment.active || 1,
    }));

    return {
      success: true,
      status: 200,
      message: "Successfully getting manufacturingCboEquipment",
      data: data.filter((typeOfEq) => typeOfEq.active === 1),
    };
  } catch (error) {
    return handleError(error);
  }
}
