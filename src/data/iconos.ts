/**
 * Iconos de Material Symbols que usa el sitio.
 *
 * Esta lista es la fuente única: con ella se pide a Google Fonts un
 * subconjunto que contiene solo estos dibujos. La diferencia no es pequeña:
 * el fichero con todos los iconos pesa 1,13 MB y el subconjunto 3,4 KB.
 *
 * Es también la lista de opciones del campo «Icono» en /admin, en
 * public/admin/config.yml. Para usar un icono nuevo hay que añadirlo en los
 * dos sitios; si falta aquí, en la página aparecería el nombre escrito en
 * lugar del dibujo.
 *
 * Catálogo completo: https://fonts.google.com/icons
 */
export const ICONOS = [
  "arrow_back",
  "arrow_forward",
  "arrow_upward",
  "balance",
  "brush",
  "close",
  "error",
  "folder_open",
  "handshake",
  "home",
  "link",
  "mail",
  "more_horiz",
  "movie",
  "north_east",
  "palette",
  "play_circle",
  "restaurant",
  "school",
  "stars",
  "zoom_in",
] as const;

/**
 * Dirección de la hoja de estilos con solo esos iconos.
 *
 * `display=block` evita que se vea el nombre del icono escrito mientras la
 * fuente llega: el hueco queda en blanco un instante y luego aparece el
 * dibujo. Con `swap` se leía «restaurant» durante unos milisegundos y al
 * cambiar por el icono se movía la página entera.
 */
export const URL_ICONOS =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" +
  `&icon_names=${ICONOS.join(",")}` +
  "&display=block";
