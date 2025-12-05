"use server";

import axios from "axios";
import { auth } from "@/auth";
import axiosInstance from "@/lib/axios-instance";
import {
  ComboBrand,
  ComboFuel,
  ComboModel,
  ComboType,
  ICboModeTransport,
  Status,
} from "@/constants/types";
import { API_BASE_URL } from "@/utils/api-config";

declare global {
  type ApiResponse<T> = {
    success: boolean;
    data?: T;
    message: string;
    status: number;
  };
}

export async function handleError(error: unknown): Promise<ApiResponse<any>> {
  if (axios.isAxiosError(error)) {
    console.error(`Axios error: ${error.message}`, error.response?.data);

    // FastAPI puede retornar errores en formato {detail: "mensaje"} o {message: "mensaje"}
    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "An error occurred while processing the request.";

    return {
      success: false,
      message:
        typeof errorMessage === "string"
          ? errorMessage
          : JSON.stringify(errorMessage),
      status: error.response?.status || 500,
      data: null,
    };
  } else {
    console.error("Unexpected error:", error);
    return {
      success: false,
      message: (error as Error)?.message || "An unknown error occurred.",
      status: 500,
      data: null,
    };
  }
}

export async function getAuthenticatedUserId(): Promise<number> {
  const session = await auth();
  const idUser: number = Number(session?.user?.id ?? 0);

  if (idUser === 0) throw new Error("User session not found or invalid");
  return idUser;
}

export async function getCboStatuses(): Promise<ApiResponse<Status[]>> {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/api/catalogs/property_status`
    );
    const apiData = (response.data?.data || []) as Array<{
      id: number;
      name: string;
    }>;
    const data: Status[] = apiData.map((s) => ({
      idStatus: s.id,
      description: s.name,
      active: 1,
    }));

    return {
      success: true,
      status: 200,
      message: "Success",
      data,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function getCboBrands(): Promise<ApiResponse<ComboBrand[]>> {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/api/catalogs/vehicle_brand`
    );
    const apiData = (response.data?.data || []) as Array<{
      id: number;
      name: string;
    }>;
    const data: ComboBrand[] = apiData.map((b) => ({
      idVehicleCboBrand: b.id,
      description: b.name,
      active: 1,
    }));

    return { success: true, status: 200, message: "Success", data };
  } catch (error) {
    return handleError(error);
  }
}

export async function getCboModelsBrand(
  idBrand: number
): Promise<ApiResponse<ComboModel[]>> {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/api/catalogs/vehicle-brand/${idBrand}/models`
    );
    const apiData = (response.data?.data || []) as Array<{
      id: number;
      name: string;
      brand_name?: string;
      year?: number;
    }>;
    const data: ComboModel[] = apiData.map((m) => ({
      idVehicleCboModel: m.id,
      idVehicleCboBrand: idBrand,
      year: m.year ? String(m.year) : "",
      description: m.name,
      active: 1,
    }));

    return { success: true, status: 200, message: "Success", data };
  } catch (error) {
    return handleError(error);
  }
}

export async function getCboTypes(): Promise<ApiResponse<ComboType[]>> {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/api/catalogs/vehicle_type`
    );
    const apiData = (response.data?.data || []) as Array<{
      id: number;
      name: string;
    }>;
    const data: ComboType[] = apiData.map((t) => ({
      idVehicleCboType: t.id,
      description: t.name,
      units: "",
      active: 1,
    }));

    return { success: true, status: 200, message: "Success", data };
  } catch (error) {
    return handleError(error);
  }
}

export async function getCboModeTransport(): Promise<
  ApiResponse<ICboModeTransport[]>
> {
  try {
    const response = await axiosInstance.get(
      "/CommutingCboModeTransporte/Mostrar_CommutingCboModeTransporte"
    );
    const data: ICboModeTransport[] = response.data as ICboModeTransport[];

    return {
      success: true,
      status: 200,
      message: "Success",
      data: data.filter((status) => status.active === 1),
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function getCboElectricityType(): Promise<
  ApiResponse<ComboFuel[]>
> {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/api/catalogs/emission-factor-types`
    );
    const apiData = (response.data?.data || []) as Array<{
      id: number;
      name: string;
    }>;
    const data: ComboFuel[] = apiData.map((e) => ({
      id: e.id,
      name: e.name,
      description: e.name,
    }));

    return { success: true, status: 200, message: "Success", data };
  } catch (error) {
    return handleError(error);
  }
}

export async function getCboFuelType(): Promise<ApiResponse<ComboFuel[]>> {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/api/catalogs/fuel_type`
    );
    const apiData = (response.data?.data || []) as Array<{
      id: number;
      name: string;
    }>;
    const data: ComboFuel[] = apiData.map((f) => ({
      id: f.id,
      name: f.name,
      description: f.name,
    }));

    return { success: true, status: 200, message: "Success", data };
  } catch (error) {
    return handleError(error);
  }
}

export async function getCboGasType(): Promise<ApiResponse<ComboFuel[]>> {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/api/catalogs/emission-factor-subtypes`
    );
    const apiData = (response.data?.data || []) as Array<{
      id: number;
      name: string;
    }>;
    const data: ComboFuel[] = apiData.map((g) => ({
      id: g.id,
      name: g.name,
      description: g.name,
    }));

    return { success: true, status: 200, message: "Success", data };
  } catch (error) {
    return handleError(error);
  }
}

export async function getCboRefrigerantsType(): Promise<
  ApiResponse<ComboFuel[]>
> {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/api/catalogs/emission-factor-subtypes`
    );
    const apiData = (response.data?.data || []) as Array<{
      id: number;
      name: string;
    }>;
    const data: ComboFuel[] = apiData.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.name,
    }));

    return { success: true, status: 200, message: "Success", data };
  } catch (error) {
    return handleError(error);
  }
}
