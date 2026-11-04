// Render Lingdong Huang's MIT-licensed Shan, Shui generator ahead of time.
// The browser only receives compressed artwork, with no generator or iframe.
import fs from "node:fs/promises";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const original = await fs.readFile(path.join(root, "vendor/shan-shui/index.html"), "utf8");
// Use the drawing functions; omit the original site's DOM, UI and scroll loop.
const scripts = [...original.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(match => match[1]);
const source = scripts.slice(0, 6).join("\n").split('document.addEventListener("mousemove"')[0];
const output = path.join(root, "public/landscapes");
await fs.mkdir(output, { recursive: true });
await fs.copyFile(path.join(root, "vendor/shan-shui/LICENSE.txt"), path.join(output, "LICENSE.txt"));

for (const [name, seed] of [[`footer-sea-${process.argv[2] || "1793758157519"}`, process.argv[2] || "1793758157519"]]) {
  const context = vm.createContext({
    window: { btoa: value => Buffer.from(value).toString("base64"), location: { href: `https://local/?seed=${seed}` } },
    console: { log() {} },
  });
  vm.runInContext(source, context, { timeout: 10_000 });
  const drawing = vm.runInContext('MEM.windx = 4600; chunkloader(0, 4600); MEM.chunks = MEM.chunks.filter(c => c.tag !== "flatmount"); chunkrender(0, 4300); MEM.canv;', context, { timeout: 60_000 });
  // Composite the white mountain fills first to preserve occlusion, then
  // convert inverse luminance into ink opacity. White paper becomes clear.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="5897" height="1100" viewBox="0 0 4300 800"><defs><filter id="ink" x="0" y="0" width="4300" height="800" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -0.2126 -0.7152 -0.0722 0 1"/></filter></defs><g filter="url(#ink)"><rect x="0" y="0" width="4300" height="800" fill="white"/>${drawing}</g></svg>`;
  // Reserve the open right side directly in the exported alpha channel. This
  // avoids differences in SVG mask handling between rasterizer versions.
  const { data, info } = await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const alpha = (y * info.width + x) * info.channels + 3;
      const originalX = x / info.width * 4300 - 2900;
      const fade = Math.max(0, Math.min(1, (1400 * .86 - originalX) / (1400 * .19)));
      data[alpha] = Math.round(data[alpha] * fade);
    }
  }
  await sharp(data, { raw: info }).webp({ quality: 88, alphaQuality: 100 }).toFile(path.join(output, `${name}-wide-ink.webp`));
  // Mobile retains the selected close view; desktop gets the extra scenery
  // to its left. Both exports share the same scale and right-hand edge.
  await sharp(data, { raw: info }).extract({ left: info.width - 1920, top: 0, width: 1920, height: info.height })
    .webp({ quality: 88, alphaQuality: 100 }).toFile(path.join(output, `${name}-ink.webp`));
  console.log(`Generated ${name} landscape`);
}
