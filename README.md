# ActivaShe

Sitio de ActivaShe: [activashecuba.org](https://activashecuba.org). Astro 2 con
contenido en Markdown y un panel de edición en `/admin` (Decap CMS) que escribe
en este mismo repositorio.

[![Netlify Status](https://api.netlify.com/api/v1/badges/b0f3d132-781b-4ced-8438-4e496dedea5e/deploy-status)](https://app.netlify.com/projects/activashecuba/deploys)

## Órdenes

```bash
npm install
npm run dev                  # servidor de desarrollo en localhost:3000
npm run build                # compila y optimiza las imágenes de dist/
npm run build:sin-optimizar  # solo compila, para depurar más rápido
npm run optimizar-imagenes   # reduce el peso de las imágenes de public/
```

## Editar contenido

En producción se edita en <https://activashecuba.org/admin/>, con cuenta de
GitHub. El panel usa el flujo editorial: cada cambio abre una rama `cms/…` y una
propuesta de cambios, y no llega al sitio hasta que se publica.

Para probar el panel en local sin tocar GitHub hacen falta dos terminales:

```bash
npm run cms   # proxy del CMS sobre el repositorio local, en el puerto 8081
npm run dev   # y abrir http://localhost:3000/admin/index.html
```

El proxy arranca en modo `git`: guardar crea una rama `cms/…` local, igual que
en producción. Las ramas de prueba se borran con `git branch -D cms/...`.

## Cómo está organizado

| Dónde | Qué hay |
| --- | --- |
| `src/content/posts`, `projects`, `art`, `videos` | Las cuatro colecciones de contenido, en Markdown |
| `src/content/pages/*.json` | Los textos de las páginas fijas (`/about`, `/donate`, `/podcasts`) |
| `src/content/config.ts` | Los campos que admite cada colección |
| `public/admin/config.yml` | Qué campos enseña el panel. Tiene que ir a la par del fichero anterior |
| `public/admin/editor-components.js` | Bloques insertables en el cuerpo: imagen con pie, vídeo, botón |
| `public/images` | Las imágenes que sube el panel |
| `tools/optimizar-imagenes.mjs` | Reduce el peso de `public/` sin cambiar nombres ni formatos |

Dos casillas deciden si algo se ve: **Publicado** retira el contenido del sitio
sin borrarlo, y **Borrador** lo esconde mientras se termina. Las aplica
`src/utils/contenido.ts` en los cuatro tipos de contenido.

Las fechas se guardan como `YYYY-MM-DD`. Si alguien edita un fichero a mano y
escribe otra cosa, el build no se rompe: avisa por consola y la entrada se
publica sin fecha, ordenada la última.

## Recuerdos: la galería de un proyecto

Un proyecto puede llevar al final una sección **Recuerdos** con fotos de las
actividades. Se rellena desde el panel, en el campo del mismo nombre: cada foto
pide una imagen, un texto alternativo (obligatorio: lo leen los lectores de
pantalla) y un pie opcional. Si la lista está vacía, la sección no aparece.

Las fotos se pintan en columnas tipo mosaico y cada una conserva su proporción,
porque muchas vienen con marco dibujado y recortarlas a una cuadrícula lo
cortaría. Al tocar una se abre a tamaño completo, con flechas y teclado para
pasar de una a otra. Las medidas se leen del fichero al compilar
(`src/utils/imageSize.ts`) para que el navegador reserve el hueco y la maqueta
no salte al cargar.

## Publicaciones dentro de un proyecto

Un proyecto largo —«La Doble Carga»— no se cuenta de una vez: se va publicando
en artículos sueltos. El campo **Proyecto** de una publicación guarda la
dirección (slug) del proyecto al que pertenece, y con eso el sitio ata las dos
puntas: el proyecto lista sus artículos al final de su página, y cada artículo
enlaza de vuelta al proyecto bajo el titular. En «Seguir leyendo» salen primero
los artículos del mismo proyecto.

El campo es opcional: sin él, la publicación es un artículo suelto y todo
funciona como antes. La relación la leen las dos funciones de
`src/utils/series.ts`. Si el slug tiene una errata o el proyecto se retira del
sitio, el artículo se publica igual —sin el enlace— y queda el aviso en el
registro del build.
