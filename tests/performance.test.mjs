import { expect, test } from "bun:test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const assetSize = (url) => statSync(join("out", new URL(url, "https://example.test").pathname)).size;

test("small visible logos do not ship full-resolution originals", () => {
  const html = readFileSync("out/index.html", "utf8");
  const images = [...html.matchAll(/<img\b[^>]*>/g)].map(([tag]) =>
    Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, key, value]) => [key, value])),
  );
  const smallImages = images.filter((image) => Number(image.width) > 0 && Number(image.width) <= 80);
  expect(smallImages.length).toBeGreaterThan(5);
  for (const image of smallImages) {
    expect(assetSize(image.src), image.src).toBeLessThan(20 * 1024);
  }
});

test("each exported font request stays within the mobile font budget", () => {
  const fonts = readdirSync("out/_next/static/media").filter((name) => name.endsWith(".woff2"));
  expect(fonts.length).toBeGreaterThan(0);
  for (const font of fonts) {
    expect(statSync(join("out/_next/static/media", font)).size, font).toBeLessThan(64 * 1024);
  }
});
