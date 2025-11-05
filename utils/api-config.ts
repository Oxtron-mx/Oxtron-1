/**
 * Configuración común para la nueva API
 * TODO: Reemplazar con variables de entorno cuando esté disponible
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false'; // Por defecto usa mock data

/**
 * Obtiene el API key para autenticación
 * TODO: Implementar cuando esté disponible el sistema de API keys
 */
export async function getApiKey(): Promise<string> {
  // Por ahora retornamos un placeholder, cuando esté listo se debe obtener del sistema
  return process.env.NEXT_PUBLIC_API_KEY || 'your-api-key-here';
}

/**
 * Mapea property_status string a número
 */
export function mapPropertyStatusToNumber(status: string | number): number {
  if (typeof status === 'number') return status;
  
  const statusMap: Record<string, number> = {
    'Propiedad': 1,
    'Arrendada': 2,
    'Alquilada': 3,
  };
  
  return statusMap[status] || 1;
}

