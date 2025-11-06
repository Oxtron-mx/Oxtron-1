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

export const postManufacturing = async (manufacturing: any) => {
    const params = {
            "name": manufacturing.process,
            "facility_id": manufacturing.idFacility,
            "equipment_id": manufacturing.idTypeEquipment, //Anionic Furnance
            "emission_factor_id": manufacturing.idTypeFuelUsed //Blast Furnace Gas
        }
  try {
    const {data} = await axiosInstance.post(`/api/manufacturing`, params);
    return data;
  } catch (error) {
    console.error(error);
  }
};
