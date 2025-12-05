/**
 * Configuración común para la nueva API
 * TODO: Reemplazar con variables de entorno cuando esté disponible
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

/**
 * Obtiene el JWT access token de la sesión actual.
 *
 * @deprecated Use getAccessToken from utils/auth-helpers.ts instead
 * @returns Access token string or null if not authenticated
 */
export async function getAccessToken(): Promise<string | null> {
  const { getAccessToken: getToken } = await import("./auth-helpers");
  return getToken();
}

/**
 * Mapea property_status string a número
 */
export function mapPropertyStatusToNumber(status: string | number): number {
  if (typeof status === "number") return status;

  const statusMap: Record<string, number> = {
    Propiedad: 1,
    Owned: 1,
    Arrendada: 2,
    Rented: 2,
    Alquilada: 3,
    Leased: 3,
  };

  return statusMap[status] || 1;
}
