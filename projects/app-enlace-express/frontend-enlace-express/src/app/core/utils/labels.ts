/** Convierte valores como `con_novedad` en etiquetas legibles. */
export function humanize(value: string | null | undefined): string {
  const text = (value ?? '').replaceAll('_', ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}
