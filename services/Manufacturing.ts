import axiosInstance from "@/lib/axios-instance";

export const getManufacturing = async () => {
    try {
      const {data} = await axiosInstance.get(
        `/api/manufacturing/`
      );
      return data;
    } catch (error) {
      console.error(error);
    }
  }