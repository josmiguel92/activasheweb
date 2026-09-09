/**
 * Fecha legible en español.
 *
 * Se formatea en UTC a propósito: en el frontmatter las fechas son días
 * (`2026-08-25`), no instantes, y YAML las interpreta como medianoche UTC.
 * Formatearlas en la zona horaria del visitante adelantaría o atrasaría un
 * día a quien lee desde América.
 *
 * Acepta `undefined` porque el esquema deja sin fecha las entradas cuya
 * fecha no se pudo interpretar, en lugar de romper el build.
 */
export default function formatDate(date?: Date | null) {
  if (!date || Number.isNaN(date.getTime())) return "Sin fecha";
  return new Intl.DateTimeFormat("es-ES", { timeZone: "UTC" }).format(date);
}

/** Fecha en formato ISO para el atributo `datetime`, o `undefined`. */
export function fechaISO(date?: Date | null) {
  if (!date || Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

/** Milisegundos para ordenar. Las entradas sin fecha quedan las últimas. */
export function marcaTemporal(date?: Date | null) {
  if (!date || Number.isNaN(date.getTime())) return 0;
  return date.getTime();
}
