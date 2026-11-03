import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { createHash } from "node:crypto";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "app", "generated-images");
const scriptTime = (await fs.stat(fileURLToPath(import.meta.url))).mtimeMs;
await fs.mkdir(output, { recursive: true });

async function generate(source, filename, options) {
  const destination = path.join(output, filename);
  const sourceTime = (await fs.stat(source)).mtimeMs;
  const existing = await fs.stat(destination).catch(() => null);
  if (existing && existing.mtimeMs >= Math.max(sourceTime, scriptTime)) return;
  let image = sharp(source).rotate();
  if (options.width) image = image.resize({ width: options.width, withoutEnlargement: true });
  if (options.format === "avif") {
    await image.avif({ quality: options.quality ?? 52, effort: 4 }).toFile(destination);
  } else {
    await image.webp(options.lossless ? { lossless: true } : { quality: options.quality ?? 85 }).toFile(destination);
  }
}

const portrait = path.join(root, "app", "image-sources", "rhema.jpg");
for (const width of [480, 960, 1440]) {
  await generate(portrait, `rhema-${width}.webp`, { width, quality: 80 });
  await generate(portrait, `rhema-${width}.avif`, { width, format: "avif" });
}

// Turbopack cannot read AVIF dimensions in this Next.js version. Serve these
// pre-encoded files directly, with content hashes and explicit metadata.
const publicOutput = path.join(root, "public", "generated-images");
await fs.mkdir(publicOutput, { recursive: true });
const avifManifest = {};
for (const [name, width] of [["small", 480], ["medium", 960], ["large", 1440]]) {
  const bytes = await fs.readFile(path.join(output, `rhema-${width}.avif`));
  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 12);
  const filename = `rhema-${width}-${hash}.avif`;
  const destination = path.join(publicOutput, filename);
  if (!await fs.stat(destination).catch(() => null)) await fs.writeFile(destination, bytes);
  const metadata = await sharp(bytes).metadata();
  avifManifest[name] = { src: `/generated-images/${filename}`, width: metadata.width, height: metadata.height };
}
const expected = new Set(Object.values(avifManifest).map(image => path.basename(image.src)));
for (const filename of await fs.readdir(publicOutput)) {
  if (/^rhema-(480|960|1440)-[a-f0-9]{12}\.avif$/.test(filename) && !expected.has(filename)) {
    await fs.unlink(path.join(publicOutput, filename));
  }
}
const manifestPath = path.join(output, "portrait-avif.json");
const manifestText = JSON.stringify(avifManifest, null, 2) + "\n";
if (await fs.readFile(manifestPath, "utf8").catch(() => null) !== manifestText) {
  await fs.writeFile(manifestPath, manifestText);
}

const assets = path.join(root, "app", "project-assets");
for (const filename of [
  "MePad_Layout.jpg", "MePad_Matrix.jpg", "MePad_Schematic.png",
  "MePad_PCB_Day2.png", "MePad_PCB_Day3.png", "MePad_PCB_Day4.png",
  "Website_Main.png", "Website_Wongmjane.png", "Website_Apple.png",
]) {
  const name = path.parse(filename).name;
  await generate(path.join(assets, filename), `${name}.webp`, { lossless: filename.endsWith(".png") });
  if (filename === "MePad_PCB_Day3.png" || filename === "Website_Main.png") {
    for (const width of [420, 840]) {
      await generate(path.join(assets, filename), `${name}-${width}.webp`, { width });
    }
  }
}
console.log("Static images ready: AVIF/WebP portraits, responsive thumbnails, full-resolution project images.");
