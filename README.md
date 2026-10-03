# FIRST FLUKE

Company website built with Next.js 16, React 19, and Tailwind CSS 4.

## Getting Started

First, install dependencies and run the development server:

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The shared homepage is in `components/site/home-page.tsx`. Korean routes are in `app/(default)/`, and English/Japanese routes are in `app/(localized)/[locale]/`.

The site uses Next.js 16 static export and is deployed to GitHub Pages by `.github/workflows/deploy.yml`. Directory URLs with a trailing slash allow direct navigation on the static host.

## Search engine optimization

- Korean `/`, English `/en/`, and Japanese `/ja/` each export translated HTML, page titles, descriptions, canonical URLs, and reciprocal `hreflang` links. The URL determines the language; browser language and saved preferences do not replace page content after hydration.
- Metadata is defined in `lib/site-seo.ts`; company information is in `lib/site.ts`. Organization and WebSite JSON-LD are rendered by `components/site/site-document.tsx`.
- `/sitemap.xml` includes the three indexable homepages and their language alternates. It omits `lastmod` until a reliable content modification date is available.
- The three privacy pages use their own canonical URLs and `noindex, follow`. They remain crawlable so search engines can read `noindex`.
- Main content is visible in the exported HTML without JavaScript. Language links in the footer also work without JavaScript.
- Product selection and usage questions are answered in all three languages. Business information uses a native disclosure so it remains available without JavaScript; Organization JSON-LD uses the same localized team and business details.
- See the [SEO, AEO, and GEO audit](docs/seo/optimization-audit.md) for documentation scope and public implementation evidence.

Verify the actual deployment artifacts:

```bash
bun run build
bun run test:seo
```

GitHub Pages deployment runs these SEO checks after the build. After publishing, verify ownership in [Google Search Console](https://search.google.com/search-console), submit `https://firstfluke.com/sitemap.xml`, and inspect `/`, `/en/`, and `/ja/` with URL Inspection. Account ownership verification and sitemap submission are external setup steps; they are not performed by the build. See Google's guides for [localized pages](https://developers.google.com/search/docs/specialty/international/localized-versions), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), and [noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

Keep account reports, analytics, credentials, and internal operator notes out of commits, PR descriptions, comments, and attachments. Store private verification records only in the Git-ignored `.local/` directory.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

Push to `main` or run the Deploy to GitHub Pages workflow manually. The workflow builds and verifies the `out/` export, adds `.nojekyll`, and publishes to the custom domain configured in `public/CNAME`.
