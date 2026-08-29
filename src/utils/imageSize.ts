import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export type ImageSize = { width: number; height: number };

/**
 * Lee las dimensiones (px) de una imagen local de `public/` en tiempo de build.
 * Soporta JPEG, PNG y WebP. Devuelve undefined si no es local o no se reconoce.
 */
export default function imageSize(publicPath?: string): ImageSize | undefined {
  if (!publicPath || /^https?:\/\//.test(publicPath)) return undefined;
  const rel = publicPath.replace(/^\//, "").split("?")[0];
  const file = join(process.cwd(), "public", decodeURIComponent(rel));
  if (!existsSync(file)) return undefined;

  let buf: Buffer;
  try {
    buf = readFileSync(file);
  } catch {
    return undefined;
  }

  // PNG: firma + IHDR
  if (buf.length > 24 && buf.toString("ascii", 1, 4) === "PNG") {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }

  // WebP: RIFF....WEBP + VP8 / VP8L / VP8X
  if (buf.length > 30 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8X") {
      return {
        width: 1 + buf.readUIntLE(24, 3),
        height: 1 + buf.readUIntLE(27, 3),
      };
    }
    if (chunk === "VP8 ") {
      return {
        width: buf.readUInt16LE(26) & 0x3fff,
        height: buf.readUInt16LE(28) & 0x3fff,
      };
    }
    if (chunk === "VP8L") {
      const b0 = buf[21], b1 = buf[22], b2 = buf[23], b3 = buf[24];
      return {
        width: 1 + (((b1 & 0x3f) << 8) | b0),
        height: 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)),
      };
    }
    return undefined;
  }

  // JPEG: recorrer marcadores hasta un SOFn
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01 || marker === 0xff) { i += 2; continue; }
      const len = buf.readUInt16BE(i + 2);
      const isSOF = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
      if (isSOF) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + len;
    }
  }
  return undefined;
}
