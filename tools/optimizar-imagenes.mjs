#!/usr/bin/env node
/*
 * Reduce el peso de las imágenes de `public/` sin cambiarles el nombre ni el
 * formato, para que las rutas guardadas en el contenido sigan siendo válidas.
 *
 * Hace dos cosas: recorta la resolución a la máxima que el sitio llega a
 * mostrar (ANCHO_MAXIMO) y vuelve a codificar el fichero. Solo sobrescribe
 * cuando el resultado pesa menos, así ejecutarlo dos veces no degrada nada.
 *
 *   node tools/optimizar-imagenes.mjs            # aplica los cambios
 *   node tools/optimizar-imagenes.mjs --simular  # solo enseña el cálculo
 *
 * Las imágenes que se sirven al visitante las vuelve a optimizar jampack en
 * cada build (ver el script `build` de package.json), que además genera
 * versiones webp y avif. Este script es para el peso del repositorio y para
 * las que se suben desde el CMS.
 */
import { readdir, stat, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import sharp from "sharp";

const RAIZ = "public";
const ANCHO_MAXIMO = 1920;
const CALIDAD_JPEG = 82;
const CALIDAD_WEBP = 82;
// No se reescribe por una diferencia trivial.
const AHORRO_MINIMO = 0.03;

const simular = process.argv.includes("--simular");

async function ficheros(directorio) {
  const encontrados = [];
  for (const entrada of await readdir(directorio, { withFileTypes: true })) {
    const ruta = join(directorio, entrada.name);
    if (entrada.isDirectory()) encontrados.push(...(await ficheros(ruta)));
    else if (/\.(png|jpe?g|webp)$/i.test(entrada.name)) encontrados.push(ruta);
  }
  return encontrados;
}

async function recodificar(ruta) {
  const original = await sharp(ruta).rotate();
  const meta = await original.metadata();
  let cadena = original;
  if (meta.width && meta.width > ANCHO_MAXIMO) {
    cadena = cadena.resize({ width: ANCHO_MAXIMO, withoutEnlargement: true });
  }
  switch (extname(ruta).toLowerCase()) {
    case ".png":
      return cadena.png({ compressionLevel: 9, effort: 10 }).toBuffer();
    case ".webp":
      return cadena.webp({ quality: CALIDAD_WEBP, effort: 6 }).toBuffer();
    default:
      return cadena
        .jpeg({ quality: CALIDAD_JPEG, mozjpeg: true, progressive: true })
        .toBuffer();
  }
}

const mb = (bytes) => (bytes / 1_000_000).toFixed(2).padStart(7);

let antes = 0;
let despues = 0;
let cambiadas = 0;

for (const ruta of (await ficheros(RAIZ)).sort()) {
  const pesoOriginal = (await stat(ruta)).size;
  antes += pesoOriginal;
  let nuevo;
  try {
    nuevo = await recodificar(ruta);
  } catch (error) {
    console.warn(`  saltada  ${ruta}: ${error.message}`);
    despues += pesoOriginal;
    continue;
  }
  const ahorro = (pesoOriginal - nuevo.length) / pesoOriginal;
  if (ahorro < AHORRO_MINIMO) {
    despues += pesoOriginal;
    continue;
  }
  despues += nuevo.length;
  cambiadas += 1;
  console.log(
    `${mb(pesoOriginal)} MB -> ${mb(nuevo.length)} MB  (-${(ahorro * 100)
      .toFixed(0)
      .padStart(2)} %)  ${ruta}`,
  );
  if (!simular) await writeFile(ruta, nuevo);
}

console.log(
  `\n${cambiadas} imagen(es) ${simular ? "se reducirían" : "reducidas"}: ` +
    `${(antes / 1_000_000).toFixed(1)} MB -> ${(despues / 1_000_000).toFixed(1)} MB`,
);
if (simular) console.log("Simulación: no se ha escrito nada.");
