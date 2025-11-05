/**
 * Configuración común para la nueva API
 * TODO: Reemplazar con variables de entorno cuando esté disponible
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

/**
 * Obtiene el API key para autenticación
 */
export async function getApiKey(): Promise<string> {
  return (
    process.env.NEXT_PUBLIC_X_API_KEY ||
    "5bb186bae06a2fd28eddb6a512f43dd2a3e62440d2242f9bda7bbbffa7f1ac11"
  );
}

/**
 * Mapea property_status string a número
 */
export function mapPropertyStatusToNumber(status: string | number): number {
  if (typeof status === "number") return status;

  const statusMap: Record<string, number> = {
    Propiedad: 1,
    Arrendada: 2,
    Alquilada: 3,
  };

  return statusMap[status] || 1;
}
