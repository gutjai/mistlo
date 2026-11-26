# Status

| # | Phase | Agent | Status |
|---|---|---|---|
| 1 | SEO research: name check, keywords, site plan, technical SEO, measurement | Gemini | ✅ done — product renamed **Mistlo**, $44 |
| 2 | Site engine, reveal, tracking, schema, deploy setup | Codex (ChatGPT) | 🔄 running |
| 3 | Product copy, 7 guides, reveal/about copy (uses Gemini's keywords) | Claude writer | ✅ done — ~13k words; integration notes for #4 (config→Mistlo/$44, builder to read faq.md/guides-hub.md/meta.md, links in FAQ answers, {{siteUrl}} in share text, Product offers schema) |
| 4 | Integrate content into site, QA, Lighthouse, rule check | Claude manager | ✅ done (face, LinkedIn, share→storefront with ?ref=share) |
| 5 | Launch: deploy | Claude | ✅ LIVE at https://gutjai.github.io/mistlo/ (repo github.com/gutjai/mistlo, auto-deploys on push to main) |
| 5a | Redesign: Gemini photoreal photos (8 shots, prompts in site/src/assets/photos/PROMPTS.md), new night/amber identity, glow picker | Gemini + Claude | ✅ live |
| 5c | Redesign v3 "impact": research of award-winning interactive product sites | Gemini | ✅ `research/interactive-redesign.md`; hero = "Living Nightstand" (canvas rain + masked glow + opt-in sound), + day/night slider, sound lab, scroll anatomy, in-box hotspots + scale, state-synced buy pill, view transitions |
| 5d | Realism pass on photos + AI video loops | Gemini | ⏸ pack-shot v2 done; other 9 shots blocked by Gemini image quota until 03:27 UTC (13:27 local). Auto-resume scheduled 13:35 local. No video tool available (ffmpeg present). |
| 5e | Live interactive demo: real-time rain, light colors, mist, opt-in rain sound | Codex | ✅ `site/src/demo/` |
| 5f | v3 live: demo as hero, scroll-drawn anatomy, view transitions, buy bar mirrors choices; reveal = Gavin's AI marketing services + teaching pitch (LinkedIn CTA) | Claude | ✅ deployed; photo swap pending 5d |
| 5b | GoatCounter code, Search Console + Bing verification, sitemap submit | Gavin + Claude | ⏳ |
| 6 | Weekly results snapshot for portfolio | Claude | ⏳ |

# What Gavin needs to supply (only these)
1. ✅ **Face photo** saved: `docs/owner-assets/face.jpg` (a larger version or a short "Gotcha!" selfie video is optional).
2. ✅ **Contact link**: LinkedIn, saved in `docs/owner-assets/owner.md`.
3. ⏳ **Free accounts, signed up by Gavin** (Claude can't create accounts or store passwords): GitHub, GoatCounter, Google Search Console, Bing Webmaster Tools. Needed only at launch; Claude walks through each one.
