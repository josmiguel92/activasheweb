/**
 * Convierte `**texto**` en `<strong>texto</strong>`.
 *
 * Se usa en los textos de las páginas fijas, que llegan del CMS como cadenas
 * sueltas y se pintan con `set:html`. El resto se escapa: así una comilla o
 * un signo `<` en un texto editado desde el panel no puede inyectar HTML.
 */
export default function negritas(texto: string): string {
  const escapado = texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escapado.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}
