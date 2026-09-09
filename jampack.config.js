/**
 * Ajustes de jampack, que se ejecuta sobre `dist/` al final de `npm run build`.
 *
 * Lo que hace por defecto ya vale: recomprime las imágenes, genera versiones
 * webp y avif, añade `width`/`height` y `loading="lazy"`, y reescribe el HTML
 * para servirlas. Aquí solo se limita la resolución máxima: la maqueta nunca
 * enseña una imagen a más de ~1600 px, así que generar variantes de 3840 px
 * era peso muerto en el despliegue.
 */
export default {
  image: {
    max_width: 1920,
    srcset_max_width: 1920,
  },
};
