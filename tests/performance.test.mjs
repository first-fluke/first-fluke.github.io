import { expect, test } from "bun:test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { createHash } from "node:crypto";
import { DICTIONARIES } from "../lib/i18n/dictionaries.ts";

const assetSize = (url) => url.startsWith("data:image/")
  ? Buffer.from(url.split(",")[1], "base64").length
  : statSync(join("out", new URL(url, "https://example.test").pathname)).size;

test.each(["/", "/en/", "/ja/"])("%s renders without waiting for an external stylesheet", (pathname) => {
  const html = readFileSync(join("out", pathname, "index.html"), "utf8");
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1];
  expect(head).toContain("<style");
  expect(head).not.toMatch(/<link\b[^>]*rel="stylesheet"/);
  const preloads = [...head.matchAll(/<link\b[^>]*rel="preload"[^>]*>/g)].map(([tag]) => tag);
  expect(preloads.filter((tag) => tag.includes('as="font"'))).toHaveLength(1);
  const cover = [...html.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag)
    .find((tag) => tag.includes('src="data:image/webp;base64,'));
  expect(cover).toMatch(/fetchpriority="high"/i);
  expect(cover).toContain('decoding="async"');
  expect(assetSize(cover.match(/src="([^"]*)"/)[1])).toBeLessThan(10 * 1024);
  const initialImageBytes = preloads.filter((tag) => tag.includes('as="image"'))
    .reduce((sum, tag) => sum + assetSize(tag.match(/href="([^"]*)"/)[1]), 0);
  expect(initialImageBytes).toBeLessThan(32 * 1024);
});

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

test.each(["/", "/en/", "/ja/"])("%s stays within the initial JavaScript budget", (pathname) => {
  const html = readFileSync(join("out", pathname, "index.html"), "utf8");
  const scripts = [...html.matchAll(/<script\b[^>]*src="([^"]+)"[^>]*>/g)]
    .filter(([tag]) => !/nomodule/i.test(tag));
  const urls = [...new Set(scripts.map(([, url]) => url))];
  const initialBytes = urls.reduce((total, url) => total + gzipSync(
    readFileSync(join("out", new URL(url, "https://example.test").pathname)),
  ).length, 0);
  expect(initialBytes).toBeLessThan(265 * 1024);
  const initialCode = urls.map((url) => readFileSync(join("out", new URL(url, "https://example.test").pathname), "utf8")).join("\n");
  expect(initialCode).not.toContain("contact-email");
});

test("each exported font request stays within the mobile font budget", () => {
  const fonts = readdirSync("out/_next/static/media").filter((name) => name.endsWith(".woff2"));
  expect(fonts.length).toBeGreaterThan(0);
  for (const font of fonts) {
    expect(statSync(join("out/_next/static/media", font)).size, font).toBeLessThan(128 * 1024);
  }
});

test("the primary font covers the current translated copy", () => {
  const coverage = JSON.parse(readFileSync("lib/site-font-codepoints.json", "utf8"));
  const known = new Set([...coverage.included, ...coverage.unsupported]);
  const missing = [...new Set(JSON.stringify(DICTIONARIES))].filter((character) => !known.has(character.codePointAt(0)));
  expect(missing, "Regenerate the font with scripts/subset-site-font.py after changing copy").toEqual([]);
});

test("responsive image variants match their source and export every candidate", () => {
  const variants = JSON.parse(readFileSync("lib/responsive-image-variants.json", "utf8"));
  expect(Object.keys(variants)).toHaveLength(9);
  for (const [src, entry] of Object.entries(variants)) {
    expect(createHash("sha256").update(readFileSync(join("public", src))).digest("hex"), src)
      .toBe(entry.sourceHash);
    for (const candidate of entry.srcSet.split(", ")) {
      const [url] = candidate.split(" ");
      expect(statSync(join("out", url)).size, url).toBeGreaterThan(0);
    }
  }
});

test.each(["/", "/en/", "/ja/"])("%s exports responsive screenshots and plain readable paragraphs", (pathname) => {
  const html = readFileSync(join("out", pathname, "index.html"), "utf8");
  const screenshots = [...html.matchAll(/<picture><source\b[^>]*srcSet="[^"]*\/optimized\/[^>]*>[\s\S]*?<\/picture>/g)];
  expect(screenshots.length).toBeGreaterThanOrEqual(9);
  expect(html).not.toContain('src="/_next/image');
  const locale = pathname === "/" ? "ko" : pathname.split("/")[1];
  for (const paragraph of DICTIONARIES[locale].about.paragraphs) {
    expect(html).toContain(paragraph.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
  }
});
