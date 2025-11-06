import { handleError } from "@/actions/shared";
import axiosInstance from "@/lib/axios-instance";

export async function getCountries() {
    try {
      const {data} = await axiosInstance.get(
        `/api/catalogs/country`
      );
  
      return data
    } catch (error) {
        console.error(error);
    }
  }

  export async function getCities( countryId : string ) {
    try {
      const {data} = await axiosInstance.get(
        `/api/catalogs/country/${countryId}/cities`
      );
  
      return data;
    } catch (error) {
        console.error(error);    }
  }


  export const getEquipmentTypes = async () => {
    try {
      const {data} = await axiosInstance.get(
        `/api/catalogs/equipment_type`
      );
      return data;
    } catch (error) {
        console.error(error);
    }
  }

  export const getEmissionFactorSubtypes = async () => {
    try {
      const {data} = await axiosInstance.get(
        `/api/catalogs/emission-factor-subtypes`
      );
      return data;
    } catch (error) {
      console.error(error);
    }
  }

 