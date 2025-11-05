// #### GET /api/manufacturing
// Datos mock según la estructura de respuesta de la API documentada en request.md

export const getManufacturingByUserIdData = {
  success: true,
  message: "Se obtuvieron 7 manufacturing para la organización",
  timestamp: "2023-11-04T12:00:00",
  data: [
    {
      id: 1,
      process_name: "Proceso de Fundición",
      facility_name: "Planta de Producción Norte",
      equipment_name: "Caldera Industrial",
      emission_factor_name: "Gas Natural - Combustión",
    },
    {
      id: 2,
      process_name: "Proceso de Soldadura",
      facility_name: "Planta de Producción Sur",
      equipment_name: "Soldadora Automática",
      emission_factor_name: "Electricidad",
    },
  ],
};

// #### GET /api/manufacturing/{manufacturing_id}
export const getManufacturingByIdData = {
  success: true,
  message: "Manufacturing obtenido exitosamente",
  timestamp: "2023-11-04T12:00:00",
  data: {
    id: 1,
    process_name: "Proceso de Fundición",
    facility_name: "Planta de Producción Norte",
    equipment_name: "Caldera Industrial",
    emission_factor_name: "Gas Natural - Combustión",
  },
};
