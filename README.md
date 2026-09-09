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
