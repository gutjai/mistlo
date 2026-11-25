# Site Architecture & Content Plan — Mistlo

All URLs use lowercase kebab-case with a consistent trailing slash (`/`). Every title tag is **≤60 characters** and every meta description is **≤155 characters**.

---

## 1. Master Page List (11 Indexable Pages + Reveal State)

| Page | URL Slug | Search Intent | Primary Keyword | Secondary Keywords | Title Tag (≤60 chars) | Meta Description (≤155 chars) | H1 |
|---|---|---|---|---|---|---|---|
| **Home / Product** | `/` | Commercial | `rain cloud humidifier and night light` | `rain cloud humidifier`, `usb c rain cloud night light`, `matte rain cloud lamp` | `Mistlo Rain Cloud Humidifier & Night Light — Ambient Glow` *(57)* | `Meet Mistlo ($44): a matte rain-cloud desk humidifier and 7-color USB-C night light with gentle falling-drop sound. Specs, sizing, and care details.` *(148)* | `Mistlo Rain Cloud Humidifier & Night Light` |
| **Guides Hub** | `/guides/` | Navigational / Info | `rain cloud humidifier guides` | `cloud humidifier care`, `rain lamp tips` | `Rain Cloud Humidifier Guides: Care, Fixes & Tips \| Mistlo` *(57)* | `Practical, honest guides to rain cloud humidifiers: how they work, noise levels, cleaning steps, distilled water, essential oils, and gift ideas.` *(145)* | `Rain Cloud Humidifier Guides` |
| **Guide 1** | `/guides/do-rain-cloud-humidifiers-work/` | Info (Buy Eval) | `do rain cloud humidifiers actually work` | `are rain cloud humidifiers worth it`, `how does a rain cloud humidifier work`, `pros and cons` | `Do Rain Cloud Humidifiers Actually Work? Honest Guide` *(53)* | `Wondering if rain cloud humidifiers actually humidify a room? Learn what 300ml drip diffusers do well, their limits, and who should buy one.` *(140)* | `Do Rain Cloud Humidifiers Actually Work?` |
| **Guide 2** | `/guides/are-rain-cloud-humidifiers-noisy/` | Info (Buy Eval) | `are rain cloud humidifiers loud` | `what does a rain cloud humidifier sound like`, `can you sleep with a rain cloud humidifier on` | `Are Rain Cloud Humidifiers Loud? Sound & Sleep Guide` *(52)* | `Do rain cloud humidifiers sound like real rain or a dripping tap? Learn about motor hum, drip volume, placement tips, and bedtime noise setup.` *(142)* | `Are Rain Cloud Humidifiers Loud? What They Actually Sound Like` |
| **Guide 3** | `/guides/how-to-clean-rain-cloud-humidifier/` | Info (Care) | `how to clean a rain cloud humidifier` | `prevent mold in rain cloud humidifier`, `descale with vinegar`, `pink slime cleanup` | `How to Clean a Rain Cloud Humidifier (Prevent Mold)` *(51)* | `Step-by-step cleaning routine for rain cloud humidifiers: daily emptying, weekly white vinegar descaling, clearing tiny drip holes, and preventing slime.` *(153)* | `How to Clean a Rain Cloud Humidifier Step by Step` |
| **Guide 4** | `/guides/rain-cloud-humidifier-not-dripping-fix/` | Info (Fix) | `rain cloud humidifier not dripping` | `stopped making mist`, `unclog drip holes`, `splashing water fix`, `motor buzzing fix` | `Rain Cloud Humidifier Not Dripping? 7 Easy Fixes` *(48)* | `Rain cloud humidifier stopped dripping, splashing, or making no mist? Follow 7 simple checks for clogged nozzles, air locks, water level, and seals.` *(148)* | `Rain Cloud Humidifier Not Dripping? 7 Quick Fixes` |
| **Guide 5** | `/guides/distilled-water-and-essential-oils/` | Info (Care) | `can you put essential oils in a rain cloud humidifier` | `can you use tap water in a rain cloud humidifier`, `do essential oils ruin cloud diffusers` | `Distilled Water & Essential Oils in Cloud Humidifiers` *(53)* | `Can you use tap water or essential oils in a rain cloud humidifier? See how minerals clog drip holes, which oils harm plastic, and safer habits.` *(144)* | `Distilled Water and Essential Oils in Rain Cloud Humidifiers` |
| **Guide 6** | `/guides/rain-cloud-vs-regular-humidifier/` | Info (Compare) | `rain cloud humidifier vs regular humidifier` | `is a rain cloud diffuser a real humidifier`, `desk diffuser vs bedroom humidifier` | `Rain Cloud Humidifier vs. Regular Humidifier Compared` *(53)* | `Compare rain cloud drip diffusers and standard room humidifiers on tank size, mist output, upkeep, lighting, and desk vs. bedroom fit.` *(134)* | `Rain Cloud Humidifier vs. Regular Humidifier: Which Fits Your Space?` |
| **Guide 7** | `/guides/aesthetic-cozy-gifts-under-50/` | Gift / Comm. | `cozy desk accessories under 50` | `aesthetic gifts for her under 50`, `gifts for people who love rain`, `unique nightstand lamp gift ideas` | `Cozy Desk & Bedside Gift Ideas Under $50 \| Mistlo` *(49)* | `Looking for aesthetic gifts under $50? Explore cozy desk and nightstand ideas—from warm ambient lamps and cloud diffusers to tactile desk organizers.` *(149)* | `Cozy Desk & Bedside Gift Ideas Under $50` |
| **FAQ** | `/faq/` | Commercial / Info | `mistlo rain cloud humidifier faq` | `rain cloud humidifier tank size how long does it last`, `usb-c power`, `water type` | `Mistlo FAQ: Specs, Water, Noise & Care Questions` *(48)* | `Answers to common questions about the Mistlo rain cloud humidifier and night light: tank size, USB-C power, sound level, cleaning, and water type.` *(146)* | `Frequently Asked Questions` |
| **About / Meta** | `/about/` | Portfolio / Trust | `ai built seo store experiment` | `how this store was built`, `portfolio seo experiment` | `About Mistlo: How 3 AI Agents Built This SEO Store` *(50)* | `Mistlo is a portfolio SEO experiment by Gavin—no products are sold. See how Claude, Codex, and Gemini researched, wrote, and built this site.` *(141)* | `About Mistlo: How This AI Portfolio Store Was Built` |

> **Reveal Handling (Non-Indexed):** Clicking **Buy ($44)** opens an immediate client-side reveal modal (or navigates to `/gotcha/` with `<meta name="robots" content="noindex, nofollow">`). Keeping the reveal out of the search index prevents spoiling search snippets without any cloaking. Never add a checkout form or collect personal info.

---

## 2. Article Outlines & "People Also Ask" Questions (Guides 1–7)

> **Writer Guardrail:** Be genuinely helpful and honest (e.g., admit that 300 ml rain-cloud units are ambient desk objects rather than whole-room winter humidifiers). Honest content earns real trust, ranks better against thin dropship copy, and makes Mistlo's product page far more believable. Zero health claims; zero fake customer quotes.

### Guide 1: `/guides/do-rain-cloud-humidifiers-work/`
- **H2 Outline:**
  1. Quick Answer: What a Rain Cloud Humidifier Actually Does
  2. How the Rain-Drop & Mist Mechanism Works Inside
  3. Where They Shine (Desk Ambiance, Visual Calm, Warm Night Light)
  4. Where They Fall Short (Whole-Room Humidity & Large Bedrooms)
  5. Honest Pros and Cons Checklist
  6. Who Should (and Shouldn't) Buy One
- **Must-Answer PAA Questions:**
  - *Do rain cloud humidifiers actually humidify a room?*
  - *How long does a 300 ml rain cloud humidifier run on one fill?*
  - *Are viral rain cloud diffusers worth buying or just a gimmick?*

### Guide 2: `/guides/are-rain-cloud-humidifiers-noisy/`
- **H2 Outline:**
  1. What a Rain Cloud Humidifier Really Sounds Like (Drops vs. Real Rain)
  2. Two Sound Sources: Water Droplets vs. Internal Pump Hum
  3. How Surface Placement Changes the Volume (Wood, Felt Pad, Glass)
  4. Adjustable Rain Settings: Light Drizzle vs. Heavy Drop Mode
  5. Tips for Bedside & Desk Use Without Distraction
- **Must-Answer PAA Questions:**
  - *Are rain cloud humidifiers too loud to sleep next to?*
  - *Why does my rain cloud humidifier sound like a dripping faucet?*
  - *How do you make a rain cloud humidifier quieter?* (Mention placing a silicone/felt coaster underneath to dampen desk resonance.)

### Guide 3: `/guides/how-to-clean-rain-cloud-humidifier/`
- **H2 Outline:**
  1. Why Open-Drip Cloud Humidifiers Need Regular Cleaning
  2. The 60-Second Daily Habit (Empty, Rinse, Air-Dry)
  3. Weekly Deep Clean Using White Vinegar (Step-by-Step)
  4. How to Clear Clogged Rain Holes Without Scratching Plastic
  5. Dealing With Pink Film or Cloudy Buildup Safely
  6. What Never to Use (Dish Soap, Bleach, Boiling Water)
- **Must-Answer PAA Questions:**
  - *How often should you clean a rain cloud humidifier?*
  - *Can you use white vinegar in a rain cloud humidifier?*
  - *How do you stop mold or pink slime from forming in a cloud diffuser?*

### Guide 4: `/guides/rain-cloud-humidifier-not-dripping-fix/`
- **H2 Outline:**
  1. Quick Diagnostic Table (Symptom → Likely Cause → First Fix)
  2. Fix 1–2: Check Water Level & Clear Air Locks in the Tube
  3. Fix 3–4: Unclog Mineral-Blocked Drip Holes & Check Top Alignment
  4. Fix 5: Stop Water From Splashing Outside the Basin
  5. Fix 6: Mist Plate Stopped Working (Gentle Swab Reset)
  6. Fix 7: Quiet a Buzzing Pump or Check USB-C Power Output (5V/2A)
- **Must-Answer PAA Questions:**
  - *Why did my rain cloud humidifier stop dripping?*
  - *Why is my rain cloud humidifier splashing water on my desk?*
  - *Why does my cloud humidifier light turn on but no mist comes out?*

### Guide 5: `/guides/distilled-water-and-essential-oils/`
- **H2 Outline:**
  1. Tap Water vs. Filtered vs. Distilled Water (Comparison Table)
  2. Why Hard Water Causes White Dust and Clogged Rain Nozzles
  3. Can You Put Essential Oils in a Rain Cloud Humidifier?
  4. Why Citrus and Thick Oils Degrade Plastic and Gum Up Pumps
  5. Safer Ways to Pair Scent With a Rain Cloud Lamp
- **Must-Answer PAA Questions:**
  - *Do you have to use distilled water in a rain cloud humidifier?*
  - *Will essential oils break a rain cloud humidifier?*
  - *How many drops of oil are safe if a model supports aromatherapy?*

### Guide 6: `/guides/rain-cloud-vs-regular-humidifier/`
- **H2 Outline:**
  1. Side-by-Side Comparison Table (Tank Size, Output, Lighting, Sound, Maintenance, Price)
  2. Choose a Rain Cloud Diffuser When… (Desk, Reading Nook, Nightstand Mood)
  3. Choose a Standard Room Humidifier When… (Large Rooms, Dry Seasons, Multi-Liter Output)
  4. Can You Use Both in the Same Home?
- **Must-Answer PAA Questions:**
  - *Is a rain cloud humidifier the same as an ultrasonic humidifier?*
  - *How much space can a tabletop cloud humidifier cover?*
  - *Which uses more electricity: a USB-C cloud diffuser or a plug-in humidifier?*

### Guide 7: `/guides/aesthetic-cozy-gifts-under-50/`
- **H2 Outline:**
  1. What Makes a Cozy Desk or Nightstand Gift Actually Get Used
  2. 7 Cozy Gift Archetypes Under $50 (Warm Ambient Lamps, Rain Cloud Diffusers like Mistlo at $44, Tactile Felt Desk Mats, Ceramic Mug Warmers, Linen Bookmarks/Journals, Soft-Glow Clocks, Weighted Cord Organizers — generic categories only, no named third-party brands!)
  3. Matching the Gift to the Recipient (Work-From-Home, Book Lover, Rain Lover, Minimalist)
  4. Quick Checklist Before Buying Ambient Tech as a Gift (USB-C, Auto-Off Timer, Easy Cleaning)
- **Must-Answer PAA Questions:**
  - *What is a good aesthetic gift under $50 for someone who loves rain?*
  - *What cozy desk accessories make a small workspace feel calmer?*
  - *Are ambient night lights good gifts for adults?*

---

## 3. Home / Product Page (`/`) & Supporting Pages Brief

- **Home / Product Page (`/`):** Hero with Mistlo product visual, `$44` price, tagline, primary **Buy Mistlo — $44** CTA (triggers reveal), clean spec grid (300 ml tank, 7-color warm/cool LED, 3 rain speeds, 4/6/8 hr auto-off timer, USB-C 5V/2A, matte BPA-free ABS), "How it works" 3-step visual strip, "Honest fit" section (positions Mistlo clearly as an ambient desk/bedside object), links to top 3 guides + `/faq/`. Footer includes `/about/` link.
- **FAQ (`/faq/`):** 10–12 concise Q&As matching `FAQPage` schema (specs, runtime, water type, essential oils, noise level, cleaning, USB-C cable, and one honest closing Q&A linking to `/about/`).
- **About (`/about/`):** Explicitly states: *"Portfolio experiment — no products are sold."* Explains Gavin's goal, the 3-AI workflow (Gemini research, Claude copy/management, Codex build), privacy-friendly measurement (GSC + GoatCounter), and links to Gavin's contact/portfolio.

---

## 4. Internal-Linking Map

Every page stays within **2 clicks of `/`**. Use varied, natural descriptive anchor text (never repetitive exact-match spam).

| From Page | Links To | Anchor Text | Placement |
|---|---|---|---|
| **Global Header Nav** | `/`, `/guides/`, `/faq/`, `/about/` | `Mistlo`, `Guides`, `FAQ`, `About` | Top navigation |
| **Global Footer** | `/`, `/guides/`, `/faq/`, `/about/` | `Product`, `All Guides`, `FAQ`, `How This Was Built` | Footer |
| `/` (Product) | `/guides/do-rain-cloud-humidifiers-work/` | `what a tabletop rain cloud actually does` | "Honest Fit" section |
| `/` (Product) | `/guides/how-to-clean-rain-cloud-humidifier/` | `2-minute cleaning & care guide` | Care & Specs section |
| `/` (Product) | `/guides/are-rain-cloud-humidifiers-noisy/` | `what the rain-drop sound is really like` | Sound & Light section |
| `/` (Product) | `/faq/` | `read all product FAQs` | Above footer |
| `/guides/` (Hub) | All 7 `/guides/*` articles + `/` | Article titles + `see Mistlo ($44)` | Cards + subtle sidebar/banner |
| Guide 1 (`do-rain-cloud-humidifiers-work`) | `/`, Guide 2, Guide 6 | `Mistlo rain cloud humidifier`, `how loud rain cloud humidifiers are`, `rain cloud vs. regular humidifier` | Contextual body + end CTA card |
| Guide 2 (`are-rain-cloud-humidifiers-noisy`) | `/`, Guide 1, Guide 4 | `Mistlo's 3-speed drip lamp`, `whether cloud humidifiers are worth it`, `fix a buzzing pump or splashing` | Contextual body + end CTA card |
| Guide 3 (`how-to-clean-rain-cloud-humidifier`) | `/`, Guide 4, Guide 5 | `Mistlo Cloud Lamp`, `troubleshoot clogged drip holes`, `distilled water vs. tap water guide` | Contextual body + end CTA card |
| Guide 4 (`rain-cloud-humidifier-not-dripping-fix`) | `/`, Guide 3, Guide 5 | `Mistlo rain cloud night light`, `weekly vinegar cleaning steps`, `avoiding mineral and oil buildup` | Contextual body + end CTA card |
| Guide 5 (`distilled-water-and-essential-oils`) | `/`, Guide 3, Guide 4 | `Mistlo ($44)`, `full cleaning routine`, `unclogging a stopped drip nozzle` | Contextual body + end CTA card |
| Guide 6 (`rain-cloud-vs-regular-humidifier`) | `/`, Guide 1, Guide 7 | `explore the Mistlo rain cloud lamp`, `honest pros and cons of cloud diffusers`, `cozy bedside gift ideas under $50` | Contextual body + end CTA card |
| Guide 7 (`aesthetic-cozy-gifts-under-50`) | `/`, Guide 1, `/faq/` | `Mistlo Rain Cloud Humidifier ($44)`, `what a rain cloud humidifier actually does`, `Mistlo specs and FAQ` | Featured item #1 + end CTA card |
| `/faq/` | `/`, Guide 3, Guide 5, `/about/` | `Mistlo product page`, `step-by-step cleaning guide`, `water and oil guide`, `how this portfolio store was built` | Inline inside relevant answers |
| `/about/` | `/`, `/guides/` | `visit the Mistlo storefront`, `read the original SEO guides` | Project overview section |
