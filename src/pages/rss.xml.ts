import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_URL } from "@/data/config";
import { publicadas } from "@/utils/contenido";
import { descripcionSeo } from "@/utils/resumen";

/**
 * Canal RSS de las publicaciones.
 *
 * Sirve para que lectores, agregadores y boletines sigan el sitio sin
 * depender de que una red social decida enseñar las entradas. Es también lo
 * que piden plataformas como Feedly o Mailchimp para republicar contenido de
 * forma automática.
 */
export async function get() {
  const posts = publicadas(await getCollection("posts"));

  return rss({
    title: "ActivaShe · Publicaciones",
    description:
      "Artículos, convocatorias y voces de la comunidad afrocubana: historias, análisis y memoria contadas por mujeres negras.",
    site: SITE_URL,
    customData: "<language>es</language>",
    items: posts.map((post) => ({
      title: post.data.title,
      description: descripcionSeo(post.data.description, post.body),
      link: `/posts/${post.slug}/`,
      pubDate: post.data.publishedAt,
    })),
  });
}
