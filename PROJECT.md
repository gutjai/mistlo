# SEO Trick Store — Project Brief

**Owner:** Gavin (portfolio project)
**Manager:** Claude (orchestrates all agents, integrates, reviews)
**Location:** `D:\Projects\seo-trick-store\`

## Goal
A believable one-product online store for a product that does not exist. When a visitor
clicks **Buy**, no order is taken: the page shows Gavin's face with a "Gotcha — this store
was built by AI to prove a point" message.

It is a portfolio piece that proves, with real numbers:
1. **SEO reach** — how many people found the site from search (impressions, clicks, queries).
2. **Persuasion** — how many visitors were convinced enough to click Buy.
3. **AI workflow** — the whole thing was researched, written and built by Claude, ChatGPT (Codex) and Gemini.

## The product (working choice)
**"Drizzle" — a rain-cloud humidifier & night light** (a trending, searchable product type,
so real search demand exists). The name is provisional: Gemini checks it doesn't clash with a
real brand. If it does, Gemini proposes a replacement and writes it to `research/product-name.md`.
All code reads brand/product details from ONE config file so the name can be swapped.

## Hard rules (non-negotiable)
- **Free only.** No paid services, domains, APIs or plugins. Hosting: GitHub Pages or Cloudflare Pages free tier.
- **Never collect money, card details, addresses, emails or passwords.** There is no checkout form. Buy → reveal, immediately.
- **No fake reviews, testimonials or ratings presented as real customers.** No fake "as seen on" press logos. No `AggregateRating`/`Review` schema.
- **Do not impersonate or name real brands/people** as endorsers. Competitor comparison only in generic terms.
- **No health/medical claims** (e.g. "cures allergies", "improves breathing").
- **White-hat SEO only:** useful original content, proper metadata, schema, speed, internal links. No keyword stuffing, cloaking, doorway pages, link spam, or hidden text.
- **Privacy-friendly tracking:** no cookies, no personal data. Analytics = GoatCounter (free, cookieless, custom events). Search data = Google Search Console (free).
- Reveal page is friendly, not mocking, and links to a short "how this was built" page + Gavin's contact.
- Footer carries a small, honest "Portfolio experiment — no products are sold" note on the About/How-it-was-built page and the reveal (so it's discoverable, not hidden).

## Metrics to track (funnel)
| Event | Meaning | Source |
|---|---|---|
| impressions / clicks / queries / avg position | SEO reach | Google Search Console |
| `pageview` (+ referrer) | visitors & where they came from | GoatCounter |
| `product-view` | reached the product page | GoatCounter event |
| `buy-click` | **got tricked** (the headline number) | GoatCounter event |
| `reveal-complete` | watched the reveal | GoatCounter event |
| `share-click` | shared the prank | GoatCounter event |
| `portfolio-click` | clicked through to Gavin | GoatCounter event |

Headline portfolio stats: **X impressions → Y visitors → Z clicked Buy (conversion %).**

## Team & lanes (each agent owns ONE folder — do not edit others' folders)
| Agent | Strength used | Owns | Delivers |
|---|---|---|---|
| **Gemini** (Antigravity) | Search/Google ecosystem knowledge | `research/` | name check, keyword research, SEO strategy, page/article plan, metadata |
| **ChatGPT / Codex** | Engineering | `site/` | static site, tracking, schema, sitemap, performance, deploy setup |
| **Claude** (writer sub-agent) | Long-form writing & brand voice | `content/` | product copy, blog/guide articles, reveal & about copy |
| **Claude** (manager) | Orchestration & review | `PROJECT.md`, `docs/` | plan, integration, QA, launch checklist, results dashboard guide |

## Status
See `docs/STATUS.md`.
