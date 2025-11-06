import axiosInstance from "@/lib/axios-instance";

export const getManufacturing = async () => {
  try {
    const {
      data: { data, ...rest },
    } = await axiosInstance.get(`/api/manufacturing/`);
    return {
      data: data.map((manufacturing: any) => ({
        process: manufacturing.name,
        idFacility: manufacturing.id,
        idTypeEquipment: manufacturing.equipment_name,
        idTypeFuelUsed: manufacturing.emission_factor_name,
        idTypeEquipmentCode: manufacturing.id,
        active: 1,
        idControlManufacturing: manufacturing.id,
        idUserControl: 66,
      })),
      ...rest,
    };
  } catch (error) {
    console.error(error);
  }
};
