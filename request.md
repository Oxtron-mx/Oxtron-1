# Oxtron API - Documentación de Endpoints

## Información General

*Título:* Oxtron API - GHG Protocol Management System  
*Versión:* 2.0.0  
*Descripción:* Sistema completo para la gestión de emisiones de gases de efecto invernadero según los estándares del Protocolo GHG.

*Base URL:* http://localhost:8000 (desarrollo)

---

## Autenticación

La mayoría de los endpoints requieren autenticación mediante API Key. La API Key debe enviarse como un query parameter llamado api_key.

*Ejemplo:*


GET /api/facilities?api_key=your-api-key-here


---

## Endpoints

### 📊 Health Check

#### GET /health

Verifica el estado del servicio.

*Autenticación:* No requerida

*Request:* Ninguno

*Response:*

json
{
  "success": true,
  "message": "Servicio funcionando correctamente",
  "timestamp": "2023-11-04T12:00:00",
  "data": {
    "status": "healthy",
    "version": "1.0.0",
    "environment": "development"
  }
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/health"


---

### 🔐 Autenticación

#### POST /api/auth/validate

Valida una API Key y retorna información de la organización.

*Autenticación:* No requerida (este endpoint valida la API Key)

*Request (Query Params):*

- api_key (string, required): La API Key a validar

*Response:*

json
{
  "success": true,
  "message": "API Key válida",
  "timestamp": "2023-11-04T12:00:00",
  "data": {
    "organization_id": 1,
    "organization_name": "Mi Organización",
    "api_key_id": 123,
    "is_active": true,
    "expires_at": "2024-12-31T23:59:59"
  }
}


*Ejemplo cURL:*

bash
curl -X POST "http://localhost:8000/api/auth/validate?api_key=your-api-key-here"


---

### 📚 Catálogos

#### GET /api/catalogs/{catalog_type}

Obtiene registros de un catálogo específico.

*Autenticación:* No requerida (excepto para measure_units)

*Path Parameters:*

- catalog_type (string, required): Tipo de catálogo
  - property_status: Estados de propiedad
  - country: Países
  - city: Ciudades
  - vehicle_brand: Marcas de vehículos
  - vehicle_type: Tipos de vehículos
  - vehicle_model: Modelos de vehículos
  - fuel_type: Tipos de combustible
  - equipment: Equipos
  - equipment_type: Tipos de equipos
  - emission_factor: Factores de emisión

*Response:*

json
{
  "success": true,
  "message": "Se obtuvieron 10 registros para 'country' exitosamente",
  "timestamp": "2023-11-04T12:00:00",
  "data": [
    {
      "id": 1,
      "name": "México",
      "code": "MX"
    }
  ]
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/catalogs/country"


---

#### GET /api/catalogs/country/{country}/cities

Obtiene las ciudades de un país específico.

*Autenticación:* No requerida

*Path Parameters:*

- country (string, required): ID o código del país

*Response:*

json
{
  "success": true,
  "message": "Se obtuvieron 50 ciudades para el país seleccionado",
  "timestamp": "2023-11-04T12:00:00",
  "data": [
    {
      "id": 1,
      "name": "Ciudad de México",
      "state_name": "Ciudad de México",
      "country_name": "México"
    }
  ]
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/catalogs/country/MX/cities"


---

#### GET /api/catalogs/vehicle-brand/{brand_id}/models

Obtiene los modelos de vehículos de una marca específica.

*Autenticación:* No requerida

*Path Parameters:*

- brand_id (integer, required): ID de la marca

*Response:*

json
{
  "success": true,
  "message": "Se obtuvieron 15 modelos para la marca seleccionada",
  "timestamp": "2023-11-04T12:00:00",
  "data": [
    {
      "id": 1,
      "name": "Civic",
      "brand_name": "Honda",
      "type_name": "Sedán",
      "year": 2023
    }
  ]
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/catalogs/vehicle-brand/1/models"


---

#### GET /api/catalogs/vehicle-type/{type_id}/models

Obtiene los modelos de vehículos de un tipo específico.

*Autenticación:* No requerida

*Path Parameters:*

- type_id (integer, required): ID del tipo de vehículo

*Response:*

json
{
  "success": true,
  "message": "Se obtuvieron 20 modelos para el tipo seleccionado",
  "timestamp": "2023-11-04T12:00:00",
  "data": [
    {
      "id": 1,
      "name": "Civic",
      "brand_name": "Honda",
      "type_name": "Sedán",
      "year": 2023
    }
  ]
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/catalogs/vehicle-type/1/models"


---

#### GET /api/catalogs/vehicle-brand/{brand_id}/vehicle-type/{type_id}/models

Obtiene los modelos de vehículos de una marca y tipo específicos.

*Autenticación:* No requerida

*Path Parameters:*

- brand_id (integer, required): ID de la marca
- type_id (integer, required): ID del tipo de vehículo

*Response:*

json
{
  "success": true,
  "message": "Se obtuvieron 5 modelos para la marca y tipo seleccionados",
  "timestamp": "2023-11-04T12:00:00",
  "data": [
    {
      "id": 1,
      "name": "Civic",
      "brand_name": "Honda",
      "type_name": "Sedán",
      "year": 2023
    }
  ]
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/catalogs/vehicle-brand/1/vehicle-type/2/models"


---

#### GET /api/catalogs/equipment/type/{type_id}

Obtiene los equipos de un tipo específico.

*Autenticación:* No requerida

*Path Parameters:*

- type_id (integer, required): ID del tipo de equipo

*Response:*

json
{
  "success": true,
  "message": "Se obtuvieron 10 equipos para el tipo seleccionado",
  "timestamp": "2023-11-04T12:00:00",
  "data": [
    {
      "id": 1,
      "name": "Caldera Industrial",
      "type_name": "Calefacción",
      "power": "100 kW"
    }
  ]
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/catalogs/equipment/type/1"


---

#### GET /api/catalogs/emission-factor-types

Obtiene todos los tipos de factores de emisión.

*Autenticación:* No requerida

*Response:*

json
{
  "success": true,
  "message": "Se obtuvieron 5 tipos de factores de emisión",
  "timestamp": "2023-11-04T12:00:00",
  "data": [
    {
      "id": 1,
      "name": "Combustión Estacionaria",
      "scope": 1
    }
  ]
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/catalogs/emission-factor-types"


---

#### GET /api/catalogs/emission-factor-subtypes

Obtiene todos los subtipos de factores de emisión.

*Autenticación:* No requerida

*Response:*

json
{
  "success": true,
  "message": "Se obtuvieron 15 subtipos de factores de emisión",
  "timestamp": "2023-11-04T12:00:00",
  "data": [
    {
      "id": 1,
      "name": "Gas Natural",
      "type_id": 1,
      "type_name": "Combustión Estacionaria"
    }
  ]
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/catalogs/emission-factor-subtypes"


---

#### GET /api/catalogs/emission-factor/id/{factor_id}

Obtiene un factor de emisión específico por ID.

*Autenticación:* No requerida

*Path Parameters:*

- factor_id (integer, required): ID del factor de emisión

*Response:*

json
{
  "success": true,
  "message": "Factor de emisión obtenido exitosamente",
  "timestamp": "2023-11-04T12:00:00",
  "data": {
    "id": 1,
    "name": "Gas Natural - Combustión",
    "co2": 2.75,
    "ch4": 0.001,
    "n2o": 0.0001,
    "unit": "kg CO2e/m³"
  }
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/catalogs/emission-factor/id/1"


---

#### GET /api/catalogs/emission-factor/type/{type_id}

Obtiene los factores de emisión de un tipo específico.

*Autenticación:* No requerida

*Path Parameters:*

- type_id (integer, required): ID del tipo de factor de emisión

*Response:*

json
{
  "success": true,
  "message": "Se obtuvieron 10 factores de emisión para el tipo seleccionado",
  "timestamp": "2023-11-04T12:00:00",
  "data": [
    {
      "id": 1,
      "name": "Gas Natural - Combustión",
      "co2": 2.75,
      "ch4": 0.001,
      "n2o": 0.0001,
      "unit": "kg CO2e/m³"
    }
  ]
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/catalogs/emission-factor/type/1"


---

#### GET /api/catalogs/emission-factor/subtype/{subtype_id}

Obtiene los factores de emisión de un subtipo específico.

*Autenticación:* No requerida

*Path Parameters:*

- subtype_id (integer, required): ID del subtipo de factor de emisión

*Response:*

json
{
  "success": true,
  "message": "Se obtuvieron 5 factores de emisión para el subtipo seleccionado",
  "timestamp": "2023-11-04T12:00:00",
  "data": [
    {
      "id": 1,
      "name": "Gas Natural - Combustión",
      "co2": 2.75,
      "ch4": 0.001,
      "n2o": 0.0001,
      "unit": "kg CO2e/m³"
    }
  ]
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/catalogs/emission-factor/subtype/1"


---

#### GET /api/catalogs/emission-factor/type/{type_id}/subtype/{subtype_id}

Obtiene los factores de emisión por tipo y subtipo específicos.

*Autenticación:* No requerida

*Path Parameters:*

- type_id (integer, required): ID del tipo de factor de emisión
- subtype_id (integer, required): ID del subtipo de factor de emisión

*Response:*

json
{
  "success": true,
  "message": "Se obtuvieron 3 factores de emisión para el tipo y subtipo seleccionados",
  "timestamp": "2023-11-04T12:00:00",
  "data": [
    {
      "id": 1,
      "name": "Gas Natural - Combustión",
      "co2": 2.75,
      "ch4": 0.001,
      "n2o": 0.0001,
      "unit": "kg CO2e/m³"
    }
  ]
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/catalogs/emission-factor/type/1/subtype/1"


---

#### GET /api/catalogs/measure-units

Obtiene todas las unidades de medida.

*Autenticación:* Requerida

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Response:*

json
{
  "success": true,
  "message": "Se obtuvieron 20 unidades de medida",
  "timestamp": "2023-11-04T12:00:00",
  "data": [
    {
      "id": 1,
      "name": "Kilogramos",
      "symbol": "kg",
      "category": "Masa"
    }
  ]
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/catalogs/measure-units?api_key=your-api-key-here"


---

### 🏭 Instalaciones (Facilities)

#### POST /api/facilities

Crea una nueva instalación.

*Autenticación:* Requerida

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Request Body:*

json
{
  "name": "Planta de Producción Norte",
  "description": "Instalación principal de manufactura",
  "country_id": 1,
  "city_id": 100,
  "property_status_id": 1
}


*Response:*

json
{
  "success": true,
  "message": "Facility 'Planta de Producción Norte' creado exitosamente",
  "timestamp": "2023-11-04T12:00:00",
  "data": {
    "id": 1,
    "name": "Planta de Producción Norte",
    "description": "Instalación principal de manufactura",
    "organization_emitter_id": 123,
    "location_id": 456,
    "property_status_id": 1
  }
}


*Ejemplo cURL:*

bash
curl -X POST "http://localhost:8000/api/facilities?api_key=your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Planta de Producción Norte",
    "description": "Instalación principal de manufactura",
    "country_id": 1,
    "city_id": 100,
    "property_status_id": 1
  }'


---

#### GET /api/facilities

Obtiene todas las instalaciones de la organización.

*Autenticación:* Requerida

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Response:*

json
{
  "success": true,
  "message": "Se obtuvieron 5 facilities para la organización",
  "timestamp": "2023-11-04T12:00:00",
  "data": [
    {
      "id": 1,
      "name": "Planta de Producción Norte",
      "description": "Instalación principal de manufactura",
      "city_name": "Monterrey",
      "country_name": "México",
      "property_status": "Propiedad"
    }
  ]
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/facilities?api_key=your-api-key-here"


---

#### GET /api/facilities/{facility_id}

Obtiene una instalación específica por ID.

*Autenticación:* Requerida

*Path Parameters:*

- facility_id (integer, required): ID de la instalación

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Response:*

json
{
  "success": true,
  "message": "Facility obtenido exitosamente",
  "timestamp": "2023-11-04T12:00:00",
  "data": {
    "id": 1,
    "name": "Planta de Producción Norte",
    "description": "Instalación principal de manufactura",
    "city_name": "Monterrey",
    "country_name": "México",
    "property_status": "Propiedad"
  }
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/facilities/1?api_key=your-api-key-here"


---

### 🚗 Vehículos (Vehicles)

#### POST /api/vehicles

Crea un nuevo vehículo.

*Autenticación:* Requerida

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Request Body:*

json
{
  "name": "Camioneta de Reparto 1",
  "description": "Vehículo para entregas locales",
  "vehicle_model": 45,
  "property_status_id": 1,
  "licence_plate": "ABC-123",
  "quantity": 1
}


*Response:*

json
{
  "success": true,
  "message": "Vehicle 'Camioneta de Reparto 1' creado exitosamente",
  "timestamp": "2023-11-04T12:00:00",
  "data": {
    "id": 1,
    "name": "Camioneta de Reparto 1",
    "description": "Vehículo para entregas locales",
    "organization_emitter_id": 124,
    "model_id": 45,
    "property_status_id": 1,
    "licence_plate": "ABC-123",
    "quantity": 1
  }
}


*Ejemplo cURL:*

bash
curl -X POST "http://localhost:8000/api/vehicles?api_key=your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Camioneta de Reparto 1",
    "description": "Vehículo para entregas locales",
    "vehicle_model": 45,
    "property_status_id": 1,
    "licence_plate": "ABC-123",
    "quantity": 1
  }'


---

#### GET /api/vehicles

Obtiene todos los vehículos de la organización.

*Autenticación:* Requerida

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Response:*

json
{
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
    }
  ]
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/vehicles?api_key=your-api-key-here"


---

#### GET /api/vehicles/{vehicle_id}

Obtiene un vehículo específico por ID.

*Autenticación:* Requerida

*Path Parameters:*

- vehicle_id (integer, required): ID del vehículo

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Response:*

json
{
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


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/vehicles/1?api_key=your-api-key-here"


---

### ✈️ Viajes (Travels)

#### POST /api/travels

Crea un nuevo viaje.

*Autenticación:* Requerida

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Request Body:*

json
{
  "name": "Viaje a conferencia anual",
  "description": "Viaje de negocios a Ciudad de México"
}


*Response:*

json
{
  "success": true,
  "message": "Travel 'Viaje a conferencia anual' creado exitosamente",
  "timestamp": "2023-11-04T12:00:00",
  "data": {
    "id": 1,
    "name": "Viaje a conferencia anual",
    "organization_emitter_id": 125
  }
}


*Ejemplo cURL:*

bash
curl -X POST "http://localhost:8000/api/travels?api_key=your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Viaje a conferencia anual",
    "description": "Viaje de negocios a Ciudad de México"
  }'


---

#### GET /api/travels

Obtiene todos los viajes de la organización.

*Autenticación:* Requerida

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Response:*

json
{
  "success": true,
  "message": "Se obtuvieron 8 travels para la organización",
  "timestamp": "2023-11-04T12:00:00",
  "data": [
    {
      "id": 1,
      "name": "Viaje a conferencia anual",
      "description": "Viaje de negocios a Ciudad de México"
    }
  ]
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/travels?api_key=your-api-key-here"


---

#### GET /api/travels/{travel_id}

Obtiene un viaje específico por ID.

*Autenticación:* Requerida

*Path Parameters:*

- travel_id (integer, required): ID del viaje

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Response:*

json
{
  "success": true,
  "message": "Travel obtenido exitosamente",
  "timestamp": "2023-11-04T12:00:00",
  "data": {
    "id": 1,
    "name": "Viaje a conferencia anual",
    "description": "Viaje de negocios a Ciudad de México"
  }
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/travels/1?api_key=your-api-key-here"


---

### 🚚 Logística (Logistics)

#### POST /api/logistics

Crea un nuevo registro de logística.

*Autenticación:* Requerida

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Request Body:*

json
{
  "name": "Ruta Monterrey-CDMX",
  "property_status_id": 1,
  "origin_id": 10,
  "destination_id": 20,
  "description": "Ruta de distribución principal",
  "vehicle_model": 45,
  "client_id": 5,
  "load": "Productos electrónicos"
}


*Response:*

json
{
  "success": true,
  "message": "Logistics 'Ruta Monterrey-CDMX' creado exitosamente",
  "timestamp": "2023-11-04T12:00:00",
  "data": {
    "id": 1,
    "name": "Ruta Monterrey-CDMX",
    "description": "Ruta de distribución principal",
    "organization_emitter_id": 126,
    "property_status_id": 1,
    "origin_id": 10,
    "destination_id": 20,
    "vehicle_id": 45,
    "client_id": 5,
    "load": "Productos electrónicos"
  }
}


*Ejemplo cURL:*

bash
curl -X POST "http://localhost:8000/api/logistics?api_key=your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ruta Monterrey-CDMX",
    "property_status_id": 1,
    "origin_id": 10,
    "destination_id": 20,
    "description": "Ruta de distribución principal",
    "vehicle_model": 45,
    "client_id": 5,
    "load": "Productos electrónicos"
  }'


---

#### GET /api/logistics

Obtiene todos los registros de logística de la organización.

*Autenticación:* Requerida

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Response:*

json
{
  "success": true,
  "message": "Se obtuvieron 12 logistics para la organización",
  "timestamp": "2023-11-04T12:00:00",
  "data": [
    {
      "id": 1,
      "name": "Ruta Monterrey-CDMX",
      "description": "Ruta de distribución principal",
      "property_status": "Propiedad",
      "origin_name": "Monterrey",
      "destination_name": "Ciudad de México",
      "vehicle_model_name": "Honda Civic 2023",
      "client_name": "Cliente ABC",
      "load": "Productos electrónicos"
    }
  ]
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/logistics?api_key=your-api-key-here"


---

#### GET /api/logistics/{logistics_id}

Obtiene un registro de logística específico por ID.

*Autenticación:* Requerida

*Path Parameters:*

- logistics_id (integer, required): ID del registro de logística

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Response:*

json
{
  "success": true,
  "message": "Logistics obtenido exitosamente",
  "timestamp": "2023-11-04T12:00:00",
  "data": {
    "id": 1,
    "name": "Ruta Monterrey-CDMX",
    "description": "Ruta de distribución principal",
    "property_status": "Propiedad",
    "origin_name": "Monterrey",
    "destination_name": "Ciudad de México",
    "vehicle_model_name": "Honda Civic 2023",
    "client_name": "Cliente ABC",
    "load": "Productos electrónicos"
  }
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/logistics/1?api_key=your-api-key-here"


---

### 🏗️ Manufactura (Manufacturing)

#### POST /api/manufacturing

Crea un nuevo proceso de manufactura.

*Autenticación:* Requerida

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Request Body:*

json
{
  "name": "Proceso de Fundición",
  "facility_id": 1,
  "equipment_id": 10,
  "emission_factor_id": 25
}


*Response:*

json
{
  "success": true,
  "message": "Manufacturing 'Proceso de Fundición' creado exitosamente",
  "timestamp": "2023-11-04T12:00:00",
  "data": {
    "id": 1,
    "process_name": "Proceso de Fundición",
    "organization_emitter_id": 127,
    "facility_id": 1,
    "equipment_id": 10,
    "emission_factor_id": 25
  }
}


*Ejemplo cURL:*

bash
curl -X POST "http://localhost:8000/api/manufacturing?api_key=your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Proceso de Fundición",
    "facility_id": 1,
    "equipment_id": 10,
    "emission_factor_id": 25
  }'


---

#### GET /api/manufacturing

Obtiene todos los procesos de manufactura de la organización.

*Autenticación:* Requerida

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Response:*

json
{
  "success": true,
  "message": "Se obtuvieron 7 manufacturing para la organización",
  "timestamp": "2023-11-04T12:00:00",
  "data": [
    {
      "id": 1,
      "process_name": "Proceso de Fundición",
      "facility_name": "Planta de Producción Norte",
      "equipment_name": "Caldera Industrial",
      "emission_factor_name": "Gas Natural - Combustión"
    }
  ]
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/manufacturing?api_key=your-api-key-here"


---

#### GET /api/manufacturing/{manufacturing_id}

Obtiene un proceso de manufactura específico por ID.

*Autenticación:* Requerida

*Path Parameters:*

- manufacturing_id (integer, required): ID del proceso de manufactura

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Response:*

json
{
  "success": true,
  "message": "Manufacturing obtenido exitosamente",
  "timestamp": "2023-11-04T12:00:00",
  "data": {
    "id": 1,
    "process_name": "Proceso de Fundición",
    "facility_name": "Planta de Producción Norte",
    "equipment_name": "Caldera Industrial",
    "emission_factor_name": "Gas Natural - Combustión"
  }
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/manufacturing/1?api_key=your-api-key-here"


---

### 🏠 Commuting

#### POST /api/commuting

Crea un nuevo registro de commuting.

*Autenticación:* Requerida

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Request Body:*

json
{
  "name": "Transporte de Empleados - Planta Norte",
  "facility_id": 1,
  "description": "Desplazamiento diario de empleados"
}


*Response:*

json
{
  "success": true,
  "message": "Commuting creado exitosamente",
  "timestamp": "2023-11-04T12:00:00",
  "data": {
    "id": 1,
    "organization_emitter_id": 128,
    "facility_id": 1
  }
}


*Ejemplo cURL:*

bash
curl -X POST "http://localhost:8000/api/commuting?api_key=your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Transporte de Empleados - Planta Norte",
    "facility_id": 1,
    "description": "Desplazamiento diario de empleados"
  }'


---

#### GET /api/commuting

Obtiene todos los registros de commuting de la organización.

*Autenticación:* Requerida

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Response:*

json
{
  "success": true,
  "message": "Se obtuvieron 4 commuting para la organización",
  "timestamp": "2023-11-04T12:00:00",
  "data": [
    {
      "id": 1,
      "name": "Transporte de Empleados - Planta Norte",
      "description": "Desplazamiento diario de empleados",
      "facility_name": "Planta de Producción Norte"
    }
  ]
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/commuting?api_key=your-api-key-here"


---

#### GET /api/commuting/{commuting_id}

Obtiene un registro de commuting específico por ID.

*Autenticación:* Requerida

*Path Parameters:*

- commuting_id (integer, required): ID del registro de commuting

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Response:*

json
{
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


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/commuting/1?api_key=your-api-key-here"


---

### 📍 Ubicaciones (Locations)

#### POST /api/organization/location

Crea una nueva ubicación para la organización.

*Autenticación:* Requerida

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Request Body:*

json
{
  "city_id": 100,
  "country_id": 1,
  "address": "Av. Insurgentes Sur 1234",
  "postal_code": "03100"
}


*Response:*

json
{
  "success": true,
  "message": "Ubicación creada exitosamente",
  "timestamp": "2023-11-04T12:00:00",
  "data": {
    "id": 1,
    "organization_id": 10,
    "city_id": 100,
    "country_id": 1,
    "address": "Av. Insurgentes Sur 1234",
    "postal_code": "03100"
  }
}


*Ejemplo cURL:*

bash
curl -X POST "http://localhost:8000/api/organization/location?api_key=your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "city_id": 100,
    "country_id": 1,
    "address": "Av. Insurgentes Sur 1234",
    "postal_code": "03100"
  }'


---

#### GET /api/organization/locations

Obtiene todas las ubicaciones de la organización.

*Autenticación:* Requerida

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Response:*

json
{
  "success": true,
  "message": "Se obtuvieron 6 ubicaciones para la organización",
  "timestamp": "2023-11-04T12:00:00",
  "data": [
    {
      "id": 1,
      "address": "Av. Insurgentes Sur 1234",
      "postal_code": "03100",
      "city_name": "Ciudad de México",
      "state_name": "Ciudad de México",
      "country_name": "México",
      "country_code": "MX"
    }
  ]
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/organization/locations?api_key=your-api-key-here"


---

#### GET /api/organization/location/{location_id}

Obtiene una ubicación específica por ID.

*Autenticación:* Requerida

*Path Parameters:*

- location_id (integer, required): ID de la ubicación

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Response:*

json
{
  "success": true,
  "message": "Ubicación obtenida exitosamente",
  "timestamp": "2023-11-04T12:00:00",
  "data": {
    "id": 1,
    "address": "Av. Insurgentes Sur 1234",
    "postal_code": "03100",
    "city_name": "Ciudad de México",
    "state_name": "Ciudad de México",
    "country_name": "México",
    "country_code": "MX"
  }
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/organization/location/1?api_key=your-api-key-here"


---

### 👥 Clientes (Organization Clients)

#### POST /api/organization/client

Crea un nuevo cliente de organización.

*Autenticación:* Requerida

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Request Body:*

json
{
  "name": "Cliente ABC S.A. de C.V."
}


*Response:*

json
{
  "success": true,
  "message": "Cliente 'Cliente ABC S.A. de C.V.' creado exitosamente",
  "timestamp": "2023-11-04T12:00:00",
  "data": {
    "id": 1,
    "name": "Cliente ABC S.A. de C.V."
  }
}


*Ejemplo cURL:*

bash
curl -X POST "http://localhost:8000/api/organization/client?api_key=your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cliente ABC S.A. de C.V."
  }'


---

#### GET /api/organization/clients

Obtiene todos los clientes de la organización.

*Autenticación:* Requerida

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Response:*

json
{
  "success": true,
  "message": "Se obtuvieron 15 clientes",
  "timestamp": "2023-11-04T12:00:00",
  "data": [
    {
      "id": 1,
      "name": "Cliente ABC S.A. de C.V."
    }
  ]
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/organization/clients?api_key=your-api-key-here"


---

#### GET /api/organization/client/{client_id}

Obtiene un cliente específico por ID.

*Autenticación:* Requerida

*Path Parameters:*

- client_id (integer, required): ID del cliente

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Response:*

json
{
  "success": true,
  "message": "Cliente obtenido exitosamente",
  "timestamp": "2023-11-04T12:00:00",
  "data": {
    "id": 1,
    "name": "Cliente ABC S.A. de C.V."
  }
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/organization/client/1?api_key=your-api-key-here"


---

### 🌍 Actividades de Emisión (Emission Activities)

#### POST /api/organization/emission-activity

Crea una nueva actividad de emisión.

*Autenticación:* Requerida

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Request Body (con período de rango):*

json
{
  "emission_factor_id": 25,
  "organization_emitter_id": 123,
  "amount": "1500.50",
  "unit_id": 5,
  "period": {
    "start_date": "2023-01-01",
    "end_date": "2023-01-31"
  }
}


*Request Body (con fecha de evento único):*

json
{
  "emission_factor_id": 25,
  "organization_emitter_id": 123,
  "amount": "1500.50",
  "unit_id": 5,
  "period": {
    "event_date": "2023-01-15"
  }
}


*Response:*

json
{
  "success": true,
  "message": "Actividad de emisión creada exitosamente",
  "timestamp": "2023-11-04T12:00:00",
  "data": {
    "id": 1,
    "inventory_period_id": 50,
    "emission_factor_id": 25,
    "quantity": 1500.5,
    "unit_id": 5,
    "co2": 4126.375,
    "ch4": 1.5005,
    "n2o": 0.15005,
    "created_at": "2023-11-04T12:00:00"
  }
}


*Ejemplo cURL:*

bash
curl -X POST "http://localhost:8000/api/organization/emission-activity?api_key=your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "emission_factor_id": 25,
    "organization_emitter_id": 123,
    "amount": "1500.50",
    "unit_id": 5,
    "period": {
      "start_date": "2023-01-01",
      "end_date": "2023-01-31"
    }
  }'


---

#### GET /api/organization/emission-activity/{activity_id}

Obtiene una actividad de emisión por ID.

*Autenticación:* Requerida

*Path Parameters:*

- activity_id (integer, required): ID de la actividad de emisión

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Response:*

json
{
  "success": true,
  "message": "Actividad de emisión obtenida exitosamente",
  "timestamp": "2023-11-04T12:00:00",
  "data": {
    "id": 1,
    "inventory_period_id": 50,
    "emission_factor_id": 25,
    "quantity": 1500.5,
    "unit_id": 5,
    "co2": 4126.375,
    "ch4": 1.5005,
    "n2o": 0.15005,
    "created_at": "2023-11-04T12:00:00"
  }
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/organization/emission-activity/1?api_key=your-api-key-here"


---

#### GET /api/organization/emission-activity/emitter/{organization_emitter_id}

Obtiene todas las actividades de emisión de un emisor específico.

*Autenticación:* Requerida

*Path Parameters:*

- organization_emitter_id (integer, required): ID del emisor de la organización

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Response:*

json
{
  "success": true,
  "message": "Se obtuvieron 20 actividades de emisión para el emisor",
  "timestamp": "2023-11-04T12:00:00",
  "data": [
    {
      "id": 1,
      "inventory_period_id": 50,
      "emission_factor_id": 25,
      "quantity": 1500.5,
      "unit_id": 5,
      "co2": 4126.375,
      "ch4": 1.5005,
      "n2o": 0.15005,
      "created_at": "2023-11-04T12:00:00"
    }
  ]
}


*Ejemplo cURL:*

bash
curl -X GET "http://localhost:8000/api/organization/emission-activity/emitter/123?api_key=your-api-key-here"


---

#### POST /api/organization/emission-activity/report

Genera un reporte de emisiones agrupado por scope.

*Autenticación:* Requerida

*Query Parameters:*

- api_key (string, required): API Key de autenticación

*Request Body:*

json
{
  "start_date": "2023-01-01",
  "end_date": "2023-12-31",
  "format": "json",
  "emission_factor_type_id": 1
}


*Parámetros opcionales:*

- format: "json" (default), "csv", o "pdf"
- emission_factor_type_id: Opcional para filtrar por tipo de factor de emisión

*Response (formato JSON):*

json
{
  "success": true,
  "message": "Reporte de emisiones generado exitosamente",
  "timestamp": "2023-11-04T12:00:00",
  "data": {
    "scopes": [
      {
        "scope": 1,
        "co2": 12500.5,
        "ch4": 45.2,
        "n2o": 3.5,
        "biofuel_co2": 0.0,
        "total_co2e": 13250.75,
        "emission_factor_types": [
          {
            "emission_factor_type_id": 1,
            "emission_factor_type_name": "Combustión Estacionaria",
            "co2": 8500.5,
            "ch4": 30.2,
            "n2o": 2.5,
            "biofuel_co2": 0.0,
            "total_co2e": 9020.5
          }
        ]
      },
      {
        "scope": 2,
        "co2": 8500.0,
        "ch4": 0.0,
        "n2o": 0.0,
        "biofuel_co2": 0.0,
        "total_co2e": 8500.0,
        "emission_factor_types": []
      },
      {
        "scope": 3,
        "co2": 5200.0,
        "ch4": 15.0,
        "n2o": 1.2,
        "biofuel_co2": 100.0,
        "total_co2e": 5650.0,
        "emission_factor_types": []
      }
    ],
    "total": {
      "scope": null,
      "co2": 26200.5,
      "ch4": 60.2,
      "n2o": 4.7,
      "biofuel_co2": 100.0,
      "total_co2e": 27400.75,
      "emission_factor_types": []
    },
    "emitters": [
      {
        "emission_source_id": 123,
        "emission_source_name": "Planta de Producción Norte",
        "scope_1_total": 5000.0,
        "scope_2_total": 3000.0,
        "scope_3_total": 2000.0,
        "total_co2e": 10000.0
      }
    ],
    "created_by": {
      "id": 1,
      "email": "usuario@example.com",
      "first_name": "Juan",
      "last_name": "Pérez"
    }
  }
}


*Response (formato CSV o PDF):*

- Para CSV: Descarga un archivo CSV con el reporte
- Para PDF: Descarga un archivo PDF con el reporte

*Ejemplo cURL (JSON):*

bash
curl -X POST "http://localhost:8000/api/organization/emission-activity/report?api_key=your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "start_date": "2023-01-01",
    "end_date": "2023-12-31",
    "format": "json",
    "emission_factor_type_id": 1
  }'


*Ejemplo cURL (CSV):*

bash
curl -X POST "http://localhost:8000/api/organization/emission-activity/report?api_key=your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "start_date": "2023-01-01",
    "end_date": "2023-12-31",
    "format": "csv"
  }' \
  --output emission_report.csv


*Ejemplo cURL (PDF):*

bash
curl -X POST "http://localhost:8000/api/organization/emission-activity/report?api_key=your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "start_date": "2023-01-01",
    "end_date": "2023-12-31",
    "format": "pdf"
  }' \
  --output emission_report.pdf


---

## Respuestas de Error

Todas las respuestas de error siguen el siguiente formato:

json
{
  "success": false,
  "message": "Descripción del error",
  "timestamp": "2023-11-04T12:00:00",
  "error": {
    "code": "ERROR_CODE",
    "message": "Detalles específicos del error"
  }
}


### Códigos de Estado HTTP Comunes

- *200 OK*: La solicitud fue exitosa
- *201 Created*: El recurso fue creado exitosamente
- *400 Bad Request*: Datos de entrada inválidos
- *401 Unauthorized*: API Key inválida o ausente
- *404 Not Found*: Recurso no encontrado
- *500 Internal Server Error*: Error del servidor

---

## Notas Adicionales

### Formato de Fechas

Las fechas deben enviarse en formato ISO 8601: YYYY-MM-DD

Ejemplo: 2023-11-04

### Formato de Timestamps

Los timestamps en las respuestas usan formato ISO 8601: YYYY-MM-DDTHH:MM:SS

Ejemplo: 2023-11-04T12:00:00

### Paginación

Actualmente la API no implementa paginación. Todos los endpoints de listado retornan todos los registros disponibles.

### Rate Limiting

No hay límites de tasa implementados actualmente.

---

## Documentación Interactiva

La API proporciona documentación interactiva en los siguientes endpoints:

- *Swagger UI*: http://localhost:8000/docs
- *ReDoc*: http://localhost:8000/redoc

Estas interfaces permiten probar los endpoints directamente desde el navegador.