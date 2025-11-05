// #### GET /api/travels
// Datos mock según la estructura de respuesta de la API documentada en request.md

export const getTravelsByUserIdData = {
  success: true,
  message: "Se obtuvieron 8 travels para la organización",
  timestamp: "2023-11-04T12:00:00",
  data: [
    {
      id: 1,
      name: "Viaje a conferencia anual",
      description: "Viaje de negocios a Ciudad de México",
    },
    {
      id: 2,
      name: "Viaje a planta de producción",
      description: "Visita a instalaciones en Monterrey",
    },
  ],
};

// #### GET /api/travels/{travel_id}
export const getTravelByIdData = {
  success: true,
  message: "Travel obtenido exitosamente",
  timestamp: "2023-11-04T12:00:00",
  data: {
    id: 1,
    name: "Viaje a conferencia anual",
    description: "Viaje de negocios a Ciudad de México",
  },
};
