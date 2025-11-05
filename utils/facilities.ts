// #### GET /api/facilities
// Datos mock según la estructura de respuesta de la API documentada en request.md

export const getFacilitiesByUserIdData = {
  success: true,
  message: "Se obtuvieron 5 facilities para la organización",
  timestamp: "2023-11-04T12:00:00",
  data: [
    {
      id: 1,
      name: "Planta de Producción Norte",
      description: "Instalación principal de manufactura",
      city_name: "Monterrey",
      country_name: "México",
      property_status: "Propiedad",
    },
    {
      id: 2,
      name: "Planta de Producción Sur",
      description: "Instalación secundaria de manufactura",
      city_name: "Guadalajara",
      country_name: "México",
      property_status: "Arrendada",
    },
    {
      id: 3,
      name: "Centro de Distribución Este",
      description: "Centro logístico principal",
      city_name: "Ciudad de México",
      country_name: "México",
      property_status: "Propiedad",
    },
  ],
};

// #### GET /api/facilities/{facility_id}
export const getFacilityByIdData = {
  success: true,
  message: "Facility obtenido exitosamente",
  timestamp: "2023-11-04T12:00:00",
  data: {
    id: 1,
    name: "Planta de Producción Norte",
    description: "Instalación principal de manufactura",
    city_name: "Monterrey",
    country_name: "México",
    property_status: "Propiedad",
  },
};
