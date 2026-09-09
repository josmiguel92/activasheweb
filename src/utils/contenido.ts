import { marcaTemporal } from "./formatDate";

/**
 * Reglas de visibilidad comunes a las cuatro colecciones.
 *
 * Una entrada aparece en el sitio si está marcada como publicada y no está
 * marcada como borrador. Las dos casillas están en el CMS. El flujo
 * editorial de Decap decide qué llega a la rama `main`; estas casillas
 * deciden qué se muestra una vez ahí, y permiten retirar algo sin borrarlo.
 */
type Publicable = {
  data: {
    isPublish?: boolean;
    isDraft?: boolean;
    publishedAt?: Date;
  };
};

export function esVisible<T extends Publicable>(entrada: T): boolean {
  return entrada.data.isPublish !== false && entrada.data.isDraft !== true;
}

/** De más reciente a más antigua; las entradas sin fecha, al final. */
export function ordenarPorFecha<T extends Publicable>(entradas: T[]): T[] {
  return [...entradas].sort(
    (a, b) => marcaTemporal(b.data.publishedAt) - marcaTemporal(a.data.publishedAt),
  );
}

/** Entradas visibles, ya ordenadas. */
export function publicadas<T extends Publicable>(entradas: T[]): T[] {
  return ordenarPorFecha(entradas.filter(esVisible));
}
