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
 * Ruta de imagen tolerante.
 *
 * El panel guarda siempre rutas absolutas (`/images/foto.jpg`). Si un fichero
 * editado a mano trae `foto.jpg`, el navegador la resuelve contra la página
 * que la muestra —`/posts/mi-articulo/foto.jpg`— y la imagen sale rota tanto
 * en el sitio como en el editor del CMS, que la busca dentro de `/admin/`.
 * Aquí se le añade la barra inicial y se avisa. Las direcciones completas se
 * dejan como están.
 */
function normalizarRuta(valor: unknown) {
  if (typeof valor !== "string") return valor;
  const ruta = valor.trim();
  if (ruta === "") return undefined;
  if (/^(https?:)?\/\//.test(ruta) || ruta.startsWith("/") || ruta.startsWith("data:")) {
    return ruta;
  }
  console.warn(
    `[contenido] Ruta de imagen relativa: "${ruta}". Se corrige a "/${ruta}", ` +
      "pero conviene arreglarla en el fichero: las rutas empiezan por «/».",
  );
  return `/${ruta}`;
}

const imagen = z.preprocess(normalizarRuta, z.string());
const imagenOpcional = z.preprocess(normalizarRuta, z.string().optional());

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

/**
 * Proyecto al que pertenece una publicación.
 *
 * Guarda la dirección (slug) de una entrada de `projects`, por ejemplo
 * `informe-doble-carga`. Sirve para que un proyecto de larga duración
 * reúna en su página los artículos que va publicando, y para que cada
 * artículo enlace de vuelta al proyecto del que forma parte.
 *
 * Es un texto suelto y no una referencia estricta a propósito: si alguien
 * escribe un slug que no existe, o retira el proyecto del sitio, el
 * artículo se publica igual —sin la cinta del proyecto— en lugar de tumbar
 * el build. src/utils/series.ts avisa en el registro cuando no cuadra.
 */
const proyectoOpcional = z.preprocess((valor) => {
  if (typeof valor !== "string") return undefined;
  const slug = valor.trim();
  return slug === "" ? undefined : slug;
}, z.string().optional());

const postsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    publishedAt: fechaTolerante,
    description: z.string(),
    ...publicacion,
    image: imagenOpcional,
    project: proyectoOpcional,
  }),
});

/**
 * Galería de recuerdos de un proyecto.
 *
 * Fotografías de las actividades, al final de la página del proyecto. Es una
 * lista opcional: los proyectos que no la tienen no pintan la sección.
 *
 * `alt` describe la escena para quien no ve la imagen y es obligatorio;
 * `caption` es el pie visible, opcional. No es lo mismo: repetir el pie en el
 * alt hace que un lector de pantalla lea dos veces la misma frase.
 */
const galeriaOpcional = z
  .array(
    z.object({
      image: imagen,
      alt: z.string(),
      caption: z.string().optional(),
    }),
  )
  .optional();

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
    image: imagenOpcional,
    gallery: galeriaOpcional,
  }),
});

const artCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    // Autoría de la obra. Muchas de las piezas de la galería llegaron sin
    // crédito, así que no se exige.
    artist: z.string().optional(),
    image: imagen,
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
    thumbnail: imagenOpcional,
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
