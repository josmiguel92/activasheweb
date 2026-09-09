/**
 * Resumen en texto plano de un contenido en Markdown.
 *
 * Se usa para las descripciones que ven los buscadores cuando la del
 * frontmatter falta o es demasiado corta. No inventa nada: recorta el propio
 * cuerpo de la entrada por el último espacio que quepa.
 */
export default function resumen(texto: string, maximo = 155): string {
  const plano = texto
    .replace(/<[^>]+>/g, " ") // HTML incrustado (figuras, vídeos)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // imágenes
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // enlaces: se queda el texto
    .replace(/^#{1,6}\s+/gm, "") // encabezados
    .replace(/^>\s?/gm, "") // citas
    .replace(/[*_`]/g, "") // negrita y cursiva
    .replace(/\s+/g, " ")
    .trim();

  if (plano.length <= maximo) return plano;
  const corte = plano.slice(0, maximo);
  const ultimoEspacio = corte.lastIndexOf(" ");
  const recortado = ultimoEspacio > maximo * 0.5 ? corte.slice(0, ultimoEspacio) : corte;
  return recortado.replace(/[\s,;:.\-—]+$/, "") + "…";
}

/**
 * Descripción para buscadores de una entrada.
 *
 * Google enseña alrededor de 155 caracteres. Una descripción de dos palabras
 * desaprovecha ese espacio, así que cuando la del frontmatter se queda corta
 * se completa con el principio del cuerpo. La descripción que se ve en la
 * página no cambia: esto solo afecta a la etiqueta `meta`.
 */
export function descripcionSeo(
  descripcion: string | undefined,
  cuerpo: string,
  minimo = 70,
): string {
  const propia = (descripcion ?? "").trim();
  if (propia.length >= minimo) return resumen(propia);
  const partes = [propia, cuerpo.trim()].filter(Boolean);
  return resumen(partes.join(" — "));
}
