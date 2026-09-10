import type { CollectionEntry } from "astro:content";
import { publicadas } from "./contenido";

/**
 * Relación entre publicaciones y proyectos.
 *
 * Un proyecto de los que duran meses —«La Doble Carga», por ejemplo— no se
 * cuenta de una sola vez: se va publicando en artículos sueltos. El campo
 * `project` del frontmatter de cada publicación guarda la dirección (slug)
 * del proyecto al que pertenece, y estas dos funciones leen esa relación en
 * los dos sentidos: desde el proyecto, para listar sus artículos; desde el
 * artículo, para enlazar de vuelta.
 *
 * Un artículo sin `project` sigue siendo un artículo suelto y no aparece en
 * ninguna página de proyecto.
 */

type Post = CollectionEntry<"posts">;
type Project = CollectionEntry<"projects">;

/**
 * Artículos publicados que pertenecen a un proyecto, del más reciente al
 * más antiguo.
 */
export function publicacionesDeProyecto(posts: Post[], slug: string): Post[] {
  return publicadas(posts.filter((post) => post.data.project === slug));
}

/**
 * Proyecto al que pertenece un artículo, si existe y está publicado.
 *
 * Devuelve `undefined` cuando el artículo no declara proyecto, cuando el
 * slug no corresponde a ninguno (una errata, o el proyecto se renombró) y
 * cuando el proyecto está retirado del sitio: en los tres casos el artículo
 * se muestra sin la cinta, sin romper el build. Los dos últimos casos
 * quedan avisados en el registro para poder corregirlos.
 */
export function proyectoDePublicacion(
  post: Post,
  projects: Project[],
): Project | undefined {
  const slug = post.data.project;
  if (!slug) return undefined;

  const proyecto = projects.find((p) => p.slug === slug);
  if (!proyecto) {
    console.warn(
      `[contenido] La publicación "${post.slug}" apunta al proyecto ` +
        `"${slug}", que no existe. Se publica sin enlace al proyecto.`,
    );
    return undefined;
  }

  const [visible] = publicadas([proyecto]);
  if (!visible) {
    console.warn(
      `[contenido] La publicación "${post.slug}" apunta al proyecto ` +
        `"${slug}", que está retirado del sitio. Se publica sin enlace.`,
    );
    return undefined;
  }

  return visible;
}
