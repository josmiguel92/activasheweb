/** Minutos de lectura estimados a partir del cuerpo Markdown (≈200 palabras/min). */
export default function readingTime(body: string = ""): number {
  const text = body
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // imágenes
    .replace(/[#>*_`\-]+/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
