# Technical SEO & White-Hat Launch Checklist (For Codex)

Actionable engineering checklist for a static site hosted free on **Cloudflare Pages (`*.pages.dev`)** or **GitHub Pages (`*.github.io`)**.

---

## 1. Structured Data (JSON-LD)

Validate every page in **Google Rich Results Test** and **Schema.org Validator** before launch.

| Schema Type | Pages | Required / Recommended Properties | Strict Rules |
|---|---|---|---|
| `Organization` | `/` (and site-wide via `@id` reference) | `@type`, `name` (`Mistlo`), `url`, `logo` | No fake street address, phone, or `sameAs` links that don't exist. |
| `Product` | `/` ONLY | `name`, `image` (array of 1–3 absolute URLs), `description`, `sku` (`MST-CLD-01`), `brand` (`{"@type":"Brand","name":"Mistlo"}`), `offers` (`@type: "Offer"`, `url`, `priceCurrency: "USD"`, `price: "44.00"`, `availability: "https://schema.org/InStock"`) | **NEVER** include `review` or `aggregateRating` (violates `PROJECT.md` & Google review spam policy). Note: `Product` with `offers` alone is 100% valid for Google Product Snippets. |
| `Article` | All 7 `/guides/*/` pages | `headline`, `description`, `image`, `datePublished`, `dateModified`, `author` (`{"@type":"Person","name":"Gavin"}` or `{"@type":"Organization","name":"Mistlo"}`), `publisher`, `mainEntityOfPage` | `headline` must match visible `<h1>`; dates must reflect real publish/update dates. |
| `FAQPage` | `/faq/` | `mainEntity` array of `Question` + `acceptedAnswer` (`Answer.text`) | Every question & answer in JSON-LD **must appear verbatim** in visible HTML on `/faq/`. |
| `BreadcrumbList` | All subpages (`/guides/`, `/guides/*/`, `/faq/`, `/about/`) | `itemListElement` with `position`, `name`, absolute `item` URL | Matches visible breadcrumb links on the page. |

---

## 2. Crawlability, Canonicals, Sitemap & Robots

| Item | Requirement |
|---|---|
| **Canonical Tag** | Self-referencing `<link rel="canonical" href="https://<host><path>/">` on every indexable page. Pull `<host>` from one config variable. |
| **Trailing Slashes** | Pick trailing slash (`/guides/how-to-clean-rain-cloud-humidifier/`) everywhere—internal links, canonicals, and `sitemap.xml` must match 100% to avoid duplicate-URL splits. |
| **`sitemap.xml`** | Generate at build time in site root (`/sitemap.xml`). Include all **11 indexable URLs** with ISO `<lastmod>` dates. Omit `/gotcha/` or `/reveal/` if implemented as a route. |
| **`robots.txt`** | Place at site root (`/robots.txt`): `User-agent: *`, `Allow: /`, optional `Disallow: /gotcha/` (only if separate route; better yet, handle reveal in a client-side modal on `/` or keep `/gotcha/` with `noindex` meta tag instead of `Disallow` so bots can see the `noindex`), plus `Sitemap: https://<host>/sitemap.xml`. |
| **404 Page** | Custom `404.html` returning HTTP 404 status (automatic on Cloudflare Pages & GitHub Pages) with clean navigation back to `/` and `/guides/`. |
| **HTML Semantics** | One `<h1>` per page, logical `<h2>`/`<h3>` nesting, semantic `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`, `lang="en"` on `<html>`, `<meta name="viewport" content="width=device-width, initial-scale=1">`. |

---

## 3. Open Graph & Twitter Cards

Include on every page inside `<head>`:
- `og:type` (`product` or `website` on `/`; `article` on `/guides/*/`)
- `og:site_name` (`Mistlo`)
- `og:title` (matches `<title>` or concise variant)
- `og:description` (matches meta description)
- `og:url` (exact canonical URL)
- `og:image` (absolute URL, **1200×630 px** PNG/WebP, <200 KB) + `og:image:alt`
- `twitter:card` (`summary_large_image`), `twitter:title`, `twitter:description`, `twitter:image`

---

## 4. Core Web Vitals & Performance Targets

Static HTML/CSS with minimal JS should easily clear "Good" thresholds on mobile and desktop:

| Metric | Google "Good" Threshold | Our Target | Engineering Checklist |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | ≤ 2.5 s | **< 1.2 s** | Preload or set `fetchpriority="high"` on hero image; serve `.webp`/`.avif`; inline critical CSS or keep single tiny stylesheet (<15 KB gzipped). |
| **INP** (Interaction to Next Paint) | ≤ 200 ms | **< 50 ms** | Vanilla JS only for Buy→Reveal modal, FAQ accordions, and GoatCounter events. Zero client-side SPA hydration bloat. |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | **0.00** | Explicit `width` & `height` attributes on every `<img>` and `<svg>`; use system font stack or self-hosted WOFF2 with `font-display: swap` + size-adjusted fallback. |
| **Page Weight** | — | **< 350 KB** | Compress images, lazy-load (`loading="lazy"`) below-the-fold images, load GoatCounter script with `async`. |

---

## 5. Image Naming & Alt Text

- **Filenames:** Lowercase kebab-case describing the visual subject, e.g.:
  - `mistlo-rain-cloud-humidifier-warm-glow.webp`
  - `mistlo-cloud-lamp-bedside-table.webp`
  - `rain-cloud-humidifier-vinegar-cleaning-diagram.webp`
- **Alt Text:** Describe what is literally depicted in 8–16 words (accessible, natural, zero keyword stuffing). Decorative icons/dividers get `alt=""` and `aria-hidden="true"`.
- **Responsive Images:** Provide `srcset` / `sizes` (e.g., `480w`, `800w`, `1200w`) for hero and product visuals.

---

## 6. Free Search Engine Submission (Step-by-Step)

### Google Search Console (Free)
1. Open [Google Search Console](https://search.google.com/search-console) → **Add Property** → choose **URL prefix** *(DNS Domain verification is unavailable on shared `pages.dev` / `github.io` subdomains)*.
2. Enter the exact canonical root URL (e.g., `https://mistlo.pages.dev/`).
3. Choose **HTML tag** verification → copy `<meta name="google-site-verification" content="...">` into the root `<head>` template (configurable via build env/config) → deploy → click **Verify**.
4. Go to **Indexing → Sitemaps** → submit `sitemap.xml`.
5. Use **URL Inspection → Request Indexing** on `/` and the 7 guide URLs right after launch (respects Google's daily inspection quota).

### Bing Webmaster Tools + IndexNow (Free)
1. Open [Bing Webmaster Tools](https://www.bing.com/webmasters) → **Import from Google Search Console** (instant 1-click verification for the same URL prefix).
2. Submit `sitemap.xml` under **Sitemaps**.
3. **IndexNow Setup** (fast indexing for Bing, DuckDuckGo, Ecosia, Yandex):
   - Generate a 32-character hex key (e.g., `a1b2c3...`).
   - Host `<key>.txt` at the site root containing only the key string (`https://<host>/<key>.txt`).
   - After deploy, send a single POST request to `https://api.indexnow.org/indexnow` with JSON payload `{ "host": "<host>", "key": "<key>", "keyLocation": "https://<host>/<key>.txt", "urlList": [ ...all 11 URLs... ] }`.

---

## 7. Free, Legitimate First Backlinks & Discovery Traffic

> **Baseline Tip:** If Gavin wants clean "pure organic SEO" metrics first, wait 1–2 weeks after GSC/IndexNow submission—or segment all social/referral traffic cleanly using GoatCounter's Referrers view so search traffic stays separate.

| Channel | Honest, White-Hat Approach | Expected Value |
|---|---|---|
| **Pinterest** | Publish 5–7 genuinely useful visual pins linking to the guides (e.g., *"How to Clean a Rain Cloud Humidifier in 5 Steps"*, *"Cozy Desk Ideas Under $50"*). | High-intent decor/DIY traffic + early crawl discovery. |
| **GitHub Repo** | If source is public, link the live URL in the repo `README.md` and repository "Website" field. | Clean discovery signal & portfolio credibility. |
| **Dev.to / Hashnode / Personal Blog** | Write an honest technical post: *"How 3 AI Agents Built a Fake One-Product SEO Store (With Live Metrics)"* linking to `/about/` and `/`. | Real maker backlinks + high-relevance portfolio eyeballs. |
| **Reddit / Hacker News (`Show HN`)** | Share **strictly as an AI/SEO portfolio experiment** in builder communities (`r/SideProject`, `r/webdev`, `Show HN`) following each community's self-promo rules. **Never** pretend to be a customer asking about Mistlo. | Referral burst + genuine shares + portfolio leads. |
| **Gavin's Portfolio & LinkedIn** | Feature the project card linking to `/` or `/about/`. | Direct career impact & clean referrer attribution. |

---

## 8. Google Spam Policies — Red Flags to Avoid

| Google Spam Policy | Risk in This Project | How We Stay 100% White-Hat |
|---|---|---|
| **Cloaking** | Showing a "real store" to Googlebot and a "prank page" to humans on the same URL. | **Never do this.** Bots and humans see the exact same HTML on every URL. The reveal triggers only on an explicit human **Buy** click, and `/about/` is publicly indexed and linked in the footer. |
| **Scaled Content Abuse** | Mass-generating thin, repetitive AI articles for dozens of near-duplicate keywords. | Limit to **7 focused, genuinely helpful, non-overlapping guides** that solve real user problems (cleaning, fixing clogs, honest pros/cons) with original structure and clear tables. |
| **Fake Reviews / Structured Data Spam** | Adding `AggregateRating` or `Review` schema with fabricated stars/quotes. | **Strictly forbidden.** Use `Product` + `Offer` only; zero star ratings or fake testimonials anywhere. |
| **Doorway Pages** | Publishing multiple near-identical landing pages targeting slight keyword variations (e.g., `/rain-lamp-bedroom/`, `/rain-lamp-desk/`). | One single product page (`/`). Every other URL serves a distinct informational or utility intent. |
| **Deceptive Functionality / Phishing** | Fake checkout forms, collecting emails, addresses, or payment details. | **Zero forms, zero data collection.** Clicking Buy immediately reveals the friendly portfolio message. |
| **Hidden Text / Link Spam** | Hiding disclosures in white-on-white text, buying links, or spamming Reddit/blog comments as fake buyers. | Keep the `/about/` disclosure visible in the footer and reveal screen; only do honest maker promotion. |
