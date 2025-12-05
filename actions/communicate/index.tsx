"use server";

import { auth } from "@/auth";
import { ReportHeader, VLabel } from "@/constants/types";
import { API_BASE_URL, getAccessToken } from "@/utils/api-config";
import axiosInstance from "@/lib/axios-instance";
import { Communicate } from "@/lib/validation";

export async function fetchRecentReports(): Promise<Communicate[]> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return [];
    }

    // Get current user to get organization_id
    const userResponse = await axiosInstance.get(
      `${API_BASE_URL}/api/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const user = userResponse.data;

    // Get all facilities (emitters) for the organization
    const facilitiesResponse = await axiosInstance.get(
      `${API_BASE_URL}/api/facilities`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const facilities = facilitiesResponse.data?.data || [];

    // For now, return empty array or map facilities to Communicate format
    // In the future, we could get recent emission activities per emitter
    return facilities.map((facility: any, index: number) => ({
      idControlCommunicate: index + 1,
      idUserControl: user.id || 0,
      idControlFacility: facility.id,
      idFacility: facility.name,
      type: "1", // Default type
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    })) as Communicate[];
  } catch (error) {
    console.error("communicate->fetchRecentReports:", { error });
    return [];
  }
}

export async function createCommunicateReport({
  idControlFacility,
  idFacility,
  type,
  startDate,
  endDate,
}: Communicate) {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    // Note: The new system uses emission-activity instead of communicate
    // This function would need to create an emission activity, but we need more data
    // For now, we'll return a placeholder that matches the Communicate type
    // In a real implementation, you'd need to:
    // 1. Get the organization_emitter_id from idControlFacility (facility)
    // 2. Get emission_factor_id from type
    // 3. Create emission activity with proper data

    return {
      idControlCommunicate: 0,
      idUserControl: 0,
      idControlFacility,
      idFacility,
      type,
      startDate,
      endDate,
    } as Communicate;
  } catch (error) {
    console.error("Error creating Report", error);
    throw error;
  }
}

export async function createReport({
  idUserControl,
  type,
  idFacility,
  idControlFacility,
  startDate,
  endDate,
}: ReportHeader) {
  try {
    // In the new system, reports are generated on-demand from emission activities
    // This function is kept for compatibility but doesn't create a persistent report
    // The actual report is generated when showReport/getPDF/getCSV is called
    return {
      idControlCommunicate: 0,
      idUserControl,
      idControlFacility,
      idFacility,
      type: type.toString(),
      startDate:
        typeof startDate === "string" ? new Date(startDate) : startDate,
      endDate: typeof endDate === "string" ? new Date(endDate) : endDate,
    } as ReportHeader;
  } catch (error) {
    console.error("Error creating Report", error);
    throw error;
  }
}

export async function updateReport(data: ReportHeader) {
  try {
    // In the new system, emission activities are immutable
    // To "update" a report, you'd need to create new emission activities
    // This function is kept for compatibility
    return data;
  } catch (error) {
    console.error("Error updating Report", error);
    throw error;
  }
}

export async function showReport(
  idUserControl: number,
  startDate: string,
  endDate: string,
  type: number
) {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    // Use the new emission-activity/report endpoint
    const response = await axiosInstance.post(
      `${API_BASE_URL}/api/organization/emission-activity/report`,
      {
        start_date: startDate,
        end_date: endDate,
        format: "json",
        emission_factor_type_id: type || undefined,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Map the response to ReportHeader format for compatibility
    const reportData = response.data?.data || response.data;
    return {
      idControlCommunicate: 0,
      idUserControl,
      idControlFacility: 0,
      idFacility: "",
      type: type.toString(),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      ...reportData,
    } as ReportHeader;
  } catch (error) {
    console.error("Error generating report", error);
    throw error;
  }
}

export async function getCboTypes(): Promise<VLabel[]> {
  try {
    // Map to new catalog: emission factor types
    const response = await axiosInstance.get(
      `${API_BASE_URL}/api/catalogs/emission-factor-types`
    );
    const data = (response.data?.data || []) as Array<{
      id: number;
      name: string;
    }>;

    return data.map((type) => ({
      value: type.id.toString(),
      label: type.name,
    }));
  } catch (error) {
    console.error("Error getting types", error);
    throw error;
  }
}

/* export async function getReport (idUserControl: number, startDate: Date, endDate: Date, type: number) {
  try {
    const response = await axiosInstance.get('/Report/Listar_Reporte', {
      params: {
        idUserControl,
        startDate,
        endDate,
        type,
      }
    })
    return response.data
  } catch (error) {
    throw error;
  }
} */

export async function getPDF(idControlCommunicate: number) {
  try {
    const token = await getAccessToken();
    if (!token) {
      return null;
    }

    // For PDF, we need start_date and end_date
    // Since we only have idControlCommunicate, we'll need to get the report data first
    // For now, return null - this would need to be implemented based on how reports are stored
    // In the new system, you'd call the report endpoint with format='pdf'

    // This is a placeholder - in reality you'd need to store/retrieve the date range
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(
      new Date().setFullYear(new Date().getFullYear() - 1)
    )
      .toISOString()
      .split("T")[0];

    const response = await axiosInstance.post(
      `${API_BASE_URL}/api/organization/emission-activity/report`,
      {
        start_date: startDate,
        end_date: endDate,
        format: "pdf",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getCSV(
  idControlCommunicate: number,
  idUserControl: number
) {
  try {
    const token = await getAccessToken();
    if (!token) {
      return null;
    }

    // Get date range - placeholder implementation
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(
      new Date().setFullYear(new Date().getFullYear() - 1)
    )
      .toISOString()
      .split("T")[0];

    const response = await axiosInstance.post(
      `${API_BASE_URL}/api/organization/emission-activity/report`,
      {
        start_date: startDate,
        end_date: endDate,
        format: "csv",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getXLSX(
  idControlCommunicate: number,
  idUserControl: number
) {
  try {
    // XLSX format is not available in the new API, so we'll use CSV
    // The frontend can handle CSV as XLSX if needed
    return await getCSV(idControlCommunicate, idUserControl);
  } catch (error) {
    console.log(error);
    return null;
  }
}
