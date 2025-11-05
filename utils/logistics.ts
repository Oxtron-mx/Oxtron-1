// #### GET /api/logistics
// Datos mock según la estructura de respuesta de la API documentada en request.md

export const getLogisticsByUserIdData = {
  success: true,
  message: "Se obtuvieron 12 logistics para la organización",
  timestamp: "2023-11-04T12:00:00",
  data: [
    {
      id: 1,
      name: "Ruta Monterrey-CDMX",
      description: "Ruta de distribución principal",
      property_status: "Propiedad",
      origin_name: "Monterrey",
      destination_name: "Ciudad de México",
      vehicle_model_name: "Honda Civic 2023",
      client_name: "Cliente ABC",
      load: "Productos electrónicos",
    },
    {
      id: 2,
      name: "Ruta Guadalajara-Monterrey",
      description: "Ruta de distribución secundaria",
      property_status: "Arrendada",
      origin_name: "Guadalajara",
      destination_name: "Monterrey",
      vehicle_model_name: "Toyota Hilux 2023",
      client_name: "Cliente XYZ",
      load: "Productos de consumo",
    },
  ],
};

// #### GET /api/logistics/{logistics_id}
export const getLogisticByIdData = {
  success: true,
  message: "Logistics obtenido exitosamente",
  timestamp: "2023-11-04T12:00:00",
  data: {
    id: 1,
    name: "Ruta Monterrey-CDMX",
    description: "Ruta de distribución principal",
    property_status: "Propiedad",
    origin_name: "Monterrey",
    destination_name: "Ciudad de México",
    vehicle_model_name: "Honda Civic 2023",
    client_name: "Cliente ABC",
    load: "Productos electrónicos",
  },
};
