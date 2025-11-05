// #### GET /api/vehicles
// Datos mock según la estructura de respuesta de la API documentada en request.md

export const getVehiclesByUserIdData = {
  "success": true,
  "message": "Se obtuvieron 10 vehicles para la organización",
  "timestamp": "2023-11-04T12:00:00",
  "data": [
    {
      "id": 1,
      "name": "Camioneta de Reparto 1",
      "description": "Vehículo para entregas locales",
      "vehicle_model_name": "Honda Civic 2023",
      "property_status": "Propiedad",
      "licence_plate": "ABC-123",
      "quantity": 1
    },
    {
      "id": 2,
      "name": "Camioneta de Reparto 2",
      "description": "Vehículo para entregas de larga distancia",
      "vehicle_model_name": "Toyota Hilux 2023",
      "property_status": "Arrendada",
      "licence_plate": "XYZ-456",
      "quantity": 1
    }
  ]
}

// #### GET /api/vehicles/{vehicle_id}
export const getVehicleByIdData = {
  "success": true,
  "message": "Vehicle obtenido exitosamente",
  "timestamp": "2023-11-04T12:00:00",
  "data": {
    "id": 1,
    "name": "Camioneta de Reparto 1",
    "description": "Vehículo para entregas locales",
    "vehicle_model_name": "Honda Civic 2023",
    "property_status": "Propiedad",
    "licence_plate": "ABC-123",
    "quantity": 1
  }
}

