# Storefront

This static site runs on HTML, CSS and browser JavaScript. Build and preview with Node 26. No packages are required.

```sh
cd site
node build.mjs
node preview.mjs
```

Open the localhost address printed by the preview server. An optional port can be supplied as `node preview.mjs 8081`. The server also serves a configured GitHub Pages project path, such as `/seo-trick-store/`.

## Configuration

Edit [src/config.json](src/config.json). Leave `brandName` blank to use `productName` everywhere the brand appears. Set `ownerContactUrl` to a public portfolio or profile URL. The default example URL and blank analytics code allow local preview. Set the real deployment URL and GoatCounter code before launch. The [deployment guide](DEPLOY.md) covers analytics, verification and indexing.

Replace the reveal portrait using the [media instructions](src/assets/reveal/README.md). The product illustrations and social image live in `src/assets/`.

## Content

Default storefront copy is in `src/partials/`, with edit points marked by HTML comments. The builder reads these optional overrides from the sibling `content/` directory.

- `product.md` supplies homepage sections and product FAQ from the named sections and fields in the content draft. Price, name and tagline come from config.
- `home-hero.md` replaces the product introduction under the main headline.
- `about.md` and `reveal.md` replace the corresponding body copy. Start either with a single level-one heading to replace its default heading. The build adds the contact and share actions.
- `faq.md` supplies the FAQ page intro and questions in front matter. The home page uses the product FAQ or an optional `faq.json` override containing pairs such as `["Question?", "Answer."]`.
- `guides-hub.md` supplies the guide index title, description and intro. Article cards are generated from the articles on disk.
- `meta.md` supplies optional social card copy using the writer’s front-matter fields.
- `articles/*.md` builds pages at `/guides/<slug>/`. The first article also enables indexing of the guides directory. Add articles with front matter like this.

```markdown
---
title: Choosing a nightstand humidifier
description: A guide to footprint, controls and care.
slug: nightstand-humidifier
date: 2026-11-26
keyword: nightstand humidifier
---

## Start with the footprint

Leave enough room to reach the controls and refill the reservoir.
```

The Markdown renderer supports headings, paragraphs, emphasis, links, images, simple lists, tables, blockquotes and fenced code. Use single-line front matter, with optional `author` and `seoTitle` fields. For FAQ, add a `faq:` field with entries indented as `- q: "Question?"` and `a: "Answer."` on the following line. Start article sections at level two since the title becomes the page heading. Root-relative links are prefixed with the deployment path. Use `{{brandName}}`, `{{productName}}`, `{{tagline}}`, `{{price}}`, `{{currency}}` or `{{ownerName}}` in Markdown and FAQ copy that should follow config.

`dist/` is generated and ignored by Git. Edit the sources and rebuild.


