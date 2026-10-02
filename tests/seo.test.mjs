import { describe, expect, test } from "bun:test";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { localizedPath } from "../lib/i18n/locale-routing.ts";
import { createPageMetadata } from "../lib/site-seo.ts";
import { DICTIONARIES } from "../lib/i18n/dictionaries.ts";

const origin = "https://firstfluke.com";
const homePaths = { ko: "/", en: "/en/", ja: "/ja/" };
const headings = {
  ko: ["당신의 첫 번째", "행운을 함께 만듭니다"],
  en: ["Crafting your first", "stroke of luck, together"],
  ja: ["最初の幸運を、", "ともにつくります"],
};

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map((match) => [match[1].toLowerCase(), match[2]]));
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "g"))].map((match) => attributes(match[0]));
}

function meta(html, name) {
  return tags(html, "meta").find((tag) => tag.name === name || tag.property === name)?.content;
}

function htmlFor(pathname) {
  return readFileSync(join("out", pathname, "index.html"), "utf8");
}

describe("locale URLs", () => {
  test.each([
    ["ko", "/", "/"],
    ["en", "/", "/en/"],
    ["ja", "/", "/ja/"],
    ["ko", "/en/privacy/", "/privacy/"],
    ["en", "/ja/privacy", "/en/privacy/"],
    ["ja", "/en", "/ja/"],
    ["en", "/en/", "/en/"],
    ["ja", "/enlarged", "/ja/enlarged/"],
  ])("%s from %s resolves to %s", (locale, pathname, expected) => {
    expect(localizedPath(locale, pathname)).toBe(expected);
  });
  test("defaults to the homepage", () => expect(localizedPath("en")).toBe("/en/"));
});

describe("exported SEO", () => {
  for (const [locale, homePath] of Object.entries(homePaths)) {
    for (const page of ["home", "privacy"]) {
      const pathname = page === "home" ? homePath : `${homePath}privacy/`;
      test(`${pathname} includes localized content and metadata before JavaScript`, () => {
        const html = htmlFor(pathname);
        const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1];
        expect(head).toBeDefined();
        expect(tags(html, "html")[0].lang).toBe(locale);
        expect(html.match(/<h1\b/g)).toHaveLength(1);
        expect(head).not.toContain("localhost");
        const metadata = createPageMetadata(locale, page);
        const canonical = tags(head, "link").filter((tag) => tag.rel === "canonical");
        expect(canonical).toHaveLength(1);
        expect(new URL(canonical[0].href).href).toBe(`${origin}${pathname}`);
        expect(head).toContain(metadata.title.absolute);
        expect(meta(head, "description")).toBe(metadata.description);
        expect(new URL(meta(head, "og:url")).href).toBe(`${origin}${pathname}`);
        expect(meta(head, "og:title")).toBe(metadata.title.absolute);
        expect(meta(head, "twitter:title")).toBe(metadata.title.absolute);

        const alternates = tags(head, "link").filter((tag) => tag.rel === "alternate" && tag.hreflang);
        expect(alternates).toHaveLength(4);
        for (const [code, path] of Object.entries(homePaths)) {
          const target = page === "home" ? path : `${path}privacy/`;
          expect(new URL(alternates.find((tag) => tag.hreflang === code).href).href).toBe(`${origin}${target}`);
          expect(existsSync(join("out", target, "index.html"))).toBe(true);
        }
        expect(new URL(alternates.find((tag) => tag.hreflang === "x-default").href).href).toBe(`${origin}${page === "home" ? "/" : "/privacy/"}`);

        for (const name of ["og:image", "twitter:image"]) {
          const image = new URL(meta(head, name));
          expect(image.origin).toBe(origin);
          expect(existsSync(join("out", image.pathname))).toBe(true);
          expect(image.pathname.endsWith(".png")).toBe(true);
          expect(readFileSync(join("out", image.pathname)).subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
        }
        expect(meta(head, "robots")).toBe(page === "home" ? "index, follow" : "noindex, follow");
        const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1];
        if (page === "home") {
          for (const text of headings[locale]) expect(h1).toContain(text);
          const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
          expect(main).not.toMatch(/style="[^"]*opacity:0(?:;|")/);
          expect(main).not.toContain("opacity:0.14");
          for (const path of Object.values(homePaths)) expect(html).toContain(`href="${path}"`);
          expect(html).toContain(`href="${homePath}privacy/"`);
          const bodyWithoutScripts = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
          const guide = bodyWithoutScripts.match(/<section id="product-guide"[^>]*>([\s\S]*?)<\/section>/)?.[1];
          expect(guide).toBeDefined();
          for (const item of DICTIONARIES[locale].faq.items) {
            expect(guide).toContain(item.question);
            expect(guide).toContain(item.answer);
            expect(bodyWithoutScripts).toContain(`id="${item.href.slice(1)}"`);
          }
          // Company facts must be in the initial HTML, not only in JSON-LD or a client popup.
          for (const row of DICTIONARIES[locale].footer.business.rows) {
            expect(bodyWithoutScripts).toContain(row.value);
          }
          expect(bodyWithoutScripts).toContain("mailto:hello@firstfluke.com");
          expect(html).not.toContain("/_vercel/insights/script.js");
        } else {
          expect(h1).toContain(metadata.title.absolute.split(" · ")[0]);
          expect(html).toContain(`href="${homePath}"`);
        }

        const structuredData = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
        const organization = structuredData.find((data) => data["@type"] === "Organization");
        const website = structuredData.find((data) => data["@type"] === "WebSite");
        expect(organization.alternateName).toContain("퍼스트플루크");
        expect(website.publisher["@id"]).toBe(organization["@id"]);
        expect(organization.identifier.value).toBe("711-23-02368");
        expect(organization.address.addressCountry).toBe("KR");
        expect(organization.makesOffer).toBeUndefined();
        for (const founder of organization.founder) {
          expect(Object.values(DICTIONARIES[locale].team.members).some((member) => member.name === founder.name)).toBe(true);
        }
        expect(existsSync(join("out", new URL(organization.logo).pathname))).toBe(true);
        expect(existsSync(join("out", new URL(organization.image).pathname))).toBe(true);
      });
    }
  }

  test("sitemap contains only indexable canonical homepages with reciprocal language links", () => {
    const xml = readFileSync("out/sitemap.xml", "utf8");
    const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]);
    expect(entries).toHaveLength(3);
    expect(xml).not.toContain("privacy");
    expect(xml).not.toContain("<lastmod>");
    for (const path of Object.values(homePaths)) {
      expect(xml).toContain(`<loc>${origin}${path}</loc>`);
      for (const entry of entries) expect(entry).toContain(`href="${origin}${path}"`);
    }
  });

  test("privacy can be crawled to read noindex and 404s are excluded from search", () => {
    const robots = readFileSync("out/robots.txt", "utf8");
    expect(robots).toContain("Allow: /");
    expect(robots).toContain(`Sitemap: ${origin}/sitemap.xml`);
    expect(robots).not.toContain("privacy");
    expect(meta(readFileSync("out/404.html", "utf8"), "robots")).toContain("noindex");
  });
});
