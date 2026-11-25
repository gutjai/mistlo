# Measurement & Portfolio Reporting Playbook

How to combine **Google Search Console (GSC)** and **GoatCounter** (both 100% free, cookieless) to report the headline portfolio metric cleanly and honestly:

> **Headline Stat:** `X search impressions → Y site visitors → Z clicked Buy (C% conversion)`

---

## 1. GoatCounter Setup & Event Tracking Spec

### Setup Hygiene (Do Before Launch)
1. Create a free GoatCounter site (e.g., `mistlo.goatcounter.com`).
2. Add the GoatCounter script with `async` in the base HTML layout:
   ```html
   <script data-goatcounter="https://mistlo.goatcounter.com/count"
           async src="//gc.zgo.at/count.js"></script>
   ```
3. **Exclude Gavin's own visits** immediately: open GoatCounter → *Settings* → enable **Ignore my visits** (or visit `https://<site>/#toggle-goatcounter` in every browser you test on) so QA clicks never inflate `buy-click`.

### Exact Event Names (Matches `PROJECT.md`)

> **Important GoatCounter API Rule:** Custom event `path` values **must NOT start with `/`** (regular pageviews start with `/`; custom events omit the leading slash and set `event: true`).

| Event (`path`) | Trigger Condition | Example `window.goatcounter.count(...)` Call |
|---|---|---|
| *(auto pageview)* | Every page load | Automatic via `count.js` (records URL path + `Referrer`). |
| `product-view` | Visitor loads `/` (or scrolls to the product hero/price block) | `window.goatcounter?.count({ path: 'product-view', title: 'Viewed Mistlo product page', event: true })` |
| `buy-click` | Visitor clicks any **Buy ($44)** button (**headline "got tricked" event**) | `window.goatcounter?.count({ path: 'buy-click', title: 'Clicked Buy (Gotcha)', event: true })` |
| `reveal-complete` | Reveal modal/view stays open ≥ 3 seconds or visitor clicks "See how it was built" | `window.goatcounter?.count({ path: 'reveal-complete', title: 'Viewed Gotcha reveal', event: true })` |
| `share-click` | Visitor clicks the Copy Link / Share button on the reveal screen | `window.goatcounter?.count({ path: 'share-click', title: 'Shared the prank', event: true })` |
| `portfolio-click` | Visitor clicks Gavin's portfolio / LinkedIn / contact link on reveal or `/about/` | `window.goatcounter?.count({ path: 'portfolio-click', title: 'Clicked through to Gavin', event: true })` |

*(Guard every call with `window.goatcounter && window.goatcounter.count` so adblockers that block `count.js` never break the Buy → Reveal UX!)*

---

## 2. Funnel Math & Separating Organic SEO vs. Total Traffic

Report **two cleanly labeled funnels** so technical reviewers trust your numbers immediately:
1. **Pure Organic Search Funnel** (proves SEO reach)
2. **All-Traffic Persuasion Funnel** (proves landing-page conversion across Search + Pinterest + Social)

| Metric | Formula / Source | What It Proves |
|---|---|---|
| **Search Impressions** | GSC → *Performance* → Total Impressions | How often Mistlo appeared in Google Search results. |
| **Search Clicks & CTR** | GSC → *Performance* → Total Clicks & Average CTR | How compelling our titles/meta descriptions were in SERPs. |
| **Avg. Search Position** | GSC → *Performance* → Average Position (plus top-10 query breakdown) | Ranking velocity of a brand-new free subdomain. |
| **Total Visitors (Pageviews)** | GoatCounter → Top-line count (filter out `event: true` rows when reading pageviews) | Total human visits reaching the site. |
| **Search-Referred Visits** | GoatCounter → *Referrers* matching `google.*`, `bing.com`, `duckduckgo.com`, `ecosia.org`, `search.yahoo.com` | Verified cookieless arrivals from search engines. |
| **Product-Page Reach %** | `product-view ÷ total pageviews × 100` *(or `/ pageviews`)* | How well guide articles funnel readers to the product page. |
| **Buy Conversion Rate %** | `buy-click ÷ product-view × 100` | **Headline persuasion metric:** % of product-page viewers convinced enough to click Buy. |
| **Overall Site Buy Rate %** | `buy-click ÷ total visits × 100` | End-to-end conversion across all landing pages. |
| **Reveal-to-Portfolio Rate %** | `portfolio-click ÷ reveal-complete × 100` | How many "tricked" visitors appreciated the joke enough to check out Gavin. |

### Why GSC Clicks and GoatCounter Visits Won't Match 1:1 (Normal!)
- **Adblockers / Privacy Browsers** block `count.js` (~10–25% undercounting in GoatCounter).
- **Non-Google Traffic** (Bing, DuckDuckGo, Pinterest, Reddit, Direct) appears in GoatCounter but not in GSC.
- **Reporting Rule:** Always cite GSC for **Impressions / Search Clicks / Queries** and GoatCounter for **On-Site Visitors / Buy Clicks / Funnel %**. Never mix a GSC denominator with a GoatCounter numerator without noting it.

---

## 3. Weekly Screenshot & Tracking Cadence

Capture the same **5 screenshots** every week (e.g., Sunday evening) and save them in a dated folder (`metrics/week-01/`, `metrics/week-02/`, etc.).

| # | Tool & Screen | Date Range | What to Capture |
|---|---|---|---|
| 1 | **GSC → Performance → Search Results** | Full project-to-date + Last 7 days | Impressions, Clicks, CTR, Avg Position trendline graph. |
| 2 | **GSC → Performance → Queries tab** | Project-to-date | Top 10–15 real search queries bringing impressions & clicks (great proof that non-branded long-tail queries ranked). |
| 3 | **GSC → Indexing → Pages** | Current snapshot | Indexed page count (target: **11 / 11** indexable pages green, 0 server errors). |
| 4 | **GoatCounter → Dashboard (Pages + Events)** | Project-to-date | Total pageviews alongside exact counts for `product-view`, `buy-click`, `reveal-complete`, `share-click`, `portfolio-click`. |
| 5 | **GoatCounter → Top Referrers** | Project-to-date | Breakdown proving real organic search (`google.com`, `bing.com`, etc.) vs. Pinterest / Reddit / Direct. |

### Expected Timeline Benchmarks (Estimates for a New Free Subdomain)

| Window | Realistic Milestone (Estimate) |
|---|---|
| **Week 1** | GSC & Bing verified; IndexNow pinged; 8–11 pages indexed on Bing, 3–11 on Google; first long-tail impressions appear. |
| **Weeks 2–4** | Care & troubleshooting guides (`not dripping`, `how to clean`, `tap water`) start earning impressions and first organic clicks (positions 10–30 → climbing). |
| **Weeks 5–8** | Top long-tail guides reach Page 1 (positions 3–10); steady organic clicks flowing to `/` via internal links; statistically meaningful `buy-click` conversion rate emerges. |

---

## 4. Portfolio Case-Study Headline Card (Fill-In Template)

Use this exact summary block in Gavin's portfolio once 4–8 weeks of data are in:

```markdown
### Mistlo — AI-Built SEO & Persuasion Experiment (Weeks 1–8)
- **Cost:** $0 (free static hosting, free analytics, free search console)
- **Team:** 3 AI agents (Gemini research · Claude strategy & copy · Codex build)
- **SEO Reach (Google Search Console):** [X] impressions · [Y] organic clicks · [N] ranking queries
- **Persuasion Funnel (GoatCounter):** [P] product-page views → [B] clicked Buy (**[C]% conversion**)
- **Portfolio Impact:** [R] viewed the reveal → [S] shared · [G] clicked through to my portfolio
```
