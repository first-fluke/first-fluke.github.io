import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import sharp from "sharp";

const screenshots = (await readdir("public/screenshots"))
  .filter((name) => name.endsWith(".webp"))
  .map((name) => ({ src: `/screenshots/${name}`, widths: [320, 640, 960, 1200] }));
const sources = [
  ...screenshots,
  { src: "/logo-background.webp", widths: [360, 640, 720] },
  { src: "/moduecangup-logo.webp", widths: [84, 132, 198] },
];

await mkdir("public/optimized", { recursive: true });
const manifest: Record<string, { sourceHash: string; srcSet: string }> = {};
for (const { src, widths } of sources) {
  const input = await readFile(join("public", src));
  const sourceHash = createHash("sha256").update(input).digest("hex");
  const entries: string[] = [];
  for (const width of widths) {
    const output = await sharp(input).resize({ width }).avif({ quality: 60, effort: 6 }).toBuffer();
    const hash = createHash("sha256").update(output).digest("hex").slice(0, 12);
    const name = `${basename(src, ".webp")}-${width}.${hash}.avif`;
    await writeFile(join("public/optimized", name), output);
    entries.push(`/optimized/${name} ${width}w`);
  }
  manifest[src] = { sourceHash, srcSet: entries.join(", ") };
}
await writeFile("lib/responsive-image-variants.json", `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Generated responsive variants for ${sources.length} public images.`);
