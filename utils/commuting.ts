// #### GET /api/commuting
// Datos mock según la estructura de respuesta de la API documentada en request.md

export const getCommutingByUserIdData = {
  "success": true,
  "message": "Se obtuvieron 4 commuting para la organización",
  "timestamp": "2023-11-04T12:00:00",
  "data": [
    {
      "id": 1,
      "name": "Transporte de Empleados - Planta Norte",
      "description": "Desplazamiento diario de empleados",
      "facility_name": "Planta de Producción Norte"
    },
    {
      "id": 2,
      "name": "Transporte de Empleados - Planta Sur",
      "description": "Desplazamiento diario de empleados",
      "facility_name": "Planta de Producción Sur"
    }
  ]
}

// #### GET /api/commuting/{commuting_id}
export const getCommutingByIdData = {
  "success": true,
  "message": "Commuting obtenido exitosamente",
  "timestamp": "2023-11-04T12:00:00",
  "data": {
    "id": 1,
    "name": "Transporte de Empleados - Planta Norte",
    "description": "Desplazamiento diario de empleados",
    "facility_name": "Planta de Producción Norte"
  }
}

