import { defineCollection, z } from "astro:content";

/**
 * Fecha tolerante a errores de escritura.
 *
 * Cuando la fecha está bien escrita (`2026-08-25`), YAML ya entrega un
 * `Date` y esto no hace nada. Si alguien edita el fichero a mano en el
 * repositorio y escribe `25/08/2026`, `próximamente` o deja el campo vacío,
 * la entrada se queda sin fecha en lugar de tumbar el build: las páginas
 * muestran «Sin fecha» y la entrada se ordena la última. El aviso queda en
 * el registro del build para poder corregirla.
 *
 * Desde el CMS esto no debería ocurrir: el widget de fecha tiene formato
 * fijo `YYYY-MM-DD` y no deja escribir a mano.
 */
const fechaTolerante = z.preprocess((valor) => {
  if (valor instanceof Date) {
    return Number.isNaN(valor.getTime()) ? undefined : valor;
  }
  if (typeof valor === "string" && valor.trim() !== "") {
    const interpretada = new Date(valor.trim());
    if (!Number.isNaN(interpretada.getTime())) return interpretada;
  }
  if (valor !== undefined && valor !== null && valor !== "") {
    console.warn(
      `[contenido] Fecha no reconocida: ${JSON.stringify(valor)}. ` +
        "La entrada se publica sin fecha. Usa el formato YYYY-MM-DD.",
    );
  }
  return undefined;
}, z.date().optional());

/**
 * Casillas de publicación, comunes a las cuatro colecciones.
 * `isPublish: false` retira el contenido del sitio sin borrarlo;
 * `isDraft: true` lo deja a medias sin que aparezca.
 * Las aplica src/utils/contenido.ts.
 */
const publicacion = {
  isPublish: z.boolean().default(true),
  isDraft: z.boolean().default(false),
};

const postsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    publishedAt: fechaTolerante,
    description: z.string(),
    ...publicacion,
    image: z.string().optional(),
  }),
});

const projectsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    publishedAt: fechaTolerante,
    description: z.string(),
    ...publicacion,
    areas: z.array(z.string()).optional(),
    isComingSoon: z.boolean().optional(),
    // Añade al final de la página del proyecto la llamada a colaborar.
    showDonate: z.boolean().default(false),
    image: z.string().optional(),
  }),
});

const artCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    artist: z.string(),
    image: z.string(),
    description: z.string().optional(),
    category: z.enum([
      "pintura",
      "fotografía",
      "escultura",
      "digital",
      "artesanía",
    ]),
    year: z.number().optional(),
    ...publicacion,
  }),
});

const videoCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    youtubeId: z.string(),
    featured: z.boolean().default(false),
    category: z.enum([
      "entrevistas",
      "talleres",
      "documentales",
      "eventos",
      "educación",
      "video arte",
    ]),
    duration: z.string(),
    thumbnail: z.string().optional(),
    publishedAt: fechaTolerante,
    ...publicacion,
  }),
});

/**
 * Textos de las páginas fijas (/about, /donate, /podcasts).
 *
 * Es una colección de datos, no de contenido: cada página es un JSON que el
 * CMS edita campo a campo, y la maqueta vive en el `.astro` correspondiente.
 * Los campos son opcionales porque no todas las páginas usan todas las
 * piezas; cada plantilla pinta solo lo que encuentra.
 *
 * En los textos, `**así**` se convierte en negrita.
 */
const pagesCollection = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    seoDescription: z.string(),
    heading: z.string(),
    // Parte final del titular, que se pinta subrayada en mostaza.
    headingHighlight: z.string().optional(),
    intro: z.array(z.string()).default([]),
    sections: z
      .array(
        z.object({
          heading: z.string().optional(),
          paragraphs: z.array(z.string()).default([]),
          cards: z
            .array(
              z.object({
                // Nombre del icono en Material Symbols, p. ej. «handshake».
                icon: z.string(),
                text: z.string(),
              }),
            )
            .default([]),
        }),
      )
      .default([]),
    // Recuadro destacado al final del bloque principal.
    aside: z
      .object({
        title: z.string().optional(),
        text: z.string().optional(),
        showEmail: z.boolean().default(false),
      })
      .optional(),
    closing: z.array(z.string()).default([]),
  }),
});

export const collections = {
  posts: postsCollection,
  projects: projectsCollection,
  art: artCollection,
  videos: videoCollection,
  pages: pagesCollection,
};
