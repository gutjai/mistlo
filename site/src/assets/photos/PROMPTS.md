# Mistlo Product Photography — AI Workflow & Final Prompts

## Tooling, Model & Current Pass Status (v2 Realism Pass — 2026-11-26)

- **Image generation tool/model**: Antigravity `generate_image` (`gemini-3.1-flash-image`) via the `image-generator` subagent.
- **Video generation tool (Part B)**: **Not available** in this environment (no Veo or other video-generation tool/MCP server is present; `ffmpeg` is installed, so compression/poster extraction would be possible once raw video exists, but video generation itself cannot be run here).
- **Backup**: All original v1 images (`desk-day.jpg`, `evening-shelf.jpg`, `glow-studio.jpg`, `hero-night.jpg`, `in-the-box.jpg`, `og.jpg`, `pack-shot.jpg`, `rain-macro.jpg`) remain untouched in `photos/_v1/`.
- **v2 Completion & Blocker (Pass 2 — 2026-11-26 13:45+10:00)**:
  - **Completed & LIVE (8 of 12 files — all existing site photos upgraded to v2)**:
    - `pack-shot.jpg` (1600×1600, 238,800 B / 233.2 KiB) — canonical v2 product anchor.
    - `glow-studio.jpg` (1600×1600, 272,579 B / 266.2 KiB) — anchored on BOTH `_v1/glow-studio.jpg` (framing lock) and `pack-shot.jpg` (v2 design/realism); verified ≤0.06% max bounding-box delta across cloud/underside/basin against `_v1/glow-studio.jpg` for the interactive canvas overlay.
    - `hero-night.jpg` (2400×1350, 292,257 B / 285.4 KiB) — anchored on v2 `pack-shot.jpg`.
    - `og.jpg` (1200×630, 210,268 B / 205.3 KiB) — bottom-weighted (`bias = 0.72`) 1.905:1 crop of v2 `hero-night.jpg`.
    - `desk-day.jpg` (1600×1200, 292,414 B / 285.6 KiB) — anchored on v2 `pack-shot.jpg`.
    - `rain-macro.jpg` (1200×1500, 289,276 B / 282.5 KiB) — generated 3:4 portrait, cropped (`v_bias = 0.58`) to 4:5 and Lanczos-upscaled to 1200×1500.
    - `evening-shelf.jpg` (1600×1200, 286,920 B / 280.2 KiB) — anchored on v2 `pack-shot.jpg`.
    - `in-the-box.jpg` (1600×1200, 292,996 B / 286.1 KiB) — anchored on v2 `pack-shot.jpg`, showing the 4 blank flush buttons on the frosted basin rim and 100% blank card.
  - **Still Missing — Blocked by Image Quota (4 NEW shots)**:
    - `hand-button.jpg` (1600×1200)
    - `detail-stem.jpg` (1200×1500)
    - `packaging.jpg` (1600×1200)
    - `scale-hand.jpg` (1600×1200)
    - All 4 returned `429 Too Many Requests / RESOURCE_EXHAUSTED` (`QUOTA_EXHAUSTED`) on `gemini-3.1-flash-image`. Reported quota reset timestamp: **`2026-11-26T08:27:02Z`** (**`18:27:02+10:00`** local time).

---

## v2 Realism Pass — Final Prompts (Completed & LIVE)

### `pack-shot.jpg` (1600×1600 — v2 LIVE)

- **Tool/model**: `generate_image` (`gemini-3.1-flash-image`), anchored on `_v1/pack-shot.jpg`; post-processed with Pillow Lanczos resize to 1600×1600, progressive sRGB JPEG under 300 KB.

> Use `_v1/pack-shot.jpg` as the visual reference for exact product geometry and proportions, and transform it from a clean CGI-looking render into an authentic, unmistakably real photograph taken by a skilled product photographer with a real camera.
> - Top: Soft 3-puff minimalist cumulus cloud (~18 cm wide) with flat underside, bead-blasted matte warm-ivory ABS plastic (subtle real micro-grain texture, NOT smooth CG clay), realistic hairline manufacturing seam around the lower edge where the underside plate meets the cloud shell.
> - Stem: ONE single slim brushed-champagne anodized aluminum stem at the back-right (~10 cm open gap) with a tiny machined collar/seam where it enters the frosted basin and faint natural specular highlight and subtle fingerprint sheen.
> - Base: Shallow round translucent frosted warm-ivory polycarbonate basin (~14 cm diameter, ~3.5 cm tall) filled with real clear water, curved meniscus along inner frosted wall, soft rectangular softbox reflection, 2–3 tiny stray water droplets on the inner rim, faint mineral trace.
> - Front controls (consistent across v2): Centered low along the front face of the base, a subtle minimalist horizontal row of 4 small flush circular matte warm-ivory tactile buttons (~5 mm diameter each, tiny hairline gaps, completely blank — NO icons, NO text, NO symbols).
> - Cable: Thin matte off-white USB-C power cable plugged into the back-right with a small white strain-relief collar, trailing rightward with realistic slight wave/memory bends from having been coiled.
> - Camera & lighting: 35mm full-frame camera, 90mm f/5.6 macro lens, asymmetric diffused softbox from upper-left with gentle right fill bounce, subtle caustic light transmission and layered contact shadow on matte light-grey paper sweep with faint paper tooth, subtle organic film grain, LED OFF, no droplets/mist, strictly NO text/logos/icons/watermarks.

### `glow-studio.jpg` (1600×1600 — v2 LIVE)

- **Reference images**: `_v1/glow-studio.jpg` (primary framing/geometry lock) + `pack-shot.jpg` (v2 materials & 4 front buttons).
- **Post-processing**: Lanczos 1024×1024 → 1600×1600, progressive sRGB JPEG (`q=90, subsampling=0`, 272,579 B).
- **Alignment check**: Max delta 0.06% across cloud, underside LED strip, and basin bounds vs `_v1/glow-studio.jpg`; light pool RGB `[96.4, 96.1, 96.5]` (neutral white), top-left background RGB `[20.5, 20.5, 20.5]`.

> Generate a photorealistic 1:1 square studio product photograph transforming `_v1/glow-studio.jpg` while matching the exact product design and materials of v2 `pack-shot.jpg`. Preserve the EXACT camera angle, product scale, silhouette, and pixel position of `_v1/glow-studio.jpg` (cloud underside spanning x ≈ 27%–76% at y ≈ 44%, basin water surface at y ≈ 67%, single stem at back-right, white USB-C cable exiting right). Keep the exact 3-puff bead-blasted matte warm-ivory ABS cloud with hairline underside seam, single brushed-champagne stem with machined collar, frosted polycarbonate basin with curved meniscus, stray rim droplets, and centered row of 4 blank flush circular matte warm-ivory buttons on the front edge, plus white USB-C cable with strain-relief boot. Underside LED glow is ON in PURE NEUTRAL WHITE (4800K–5000K, zero warm/cool cast for CSS tinting). Replace v1's uniform vertical bead strings with only 5–7 sparse, irregular, separate clear water droplets falling naturally with subtle ~1/125s vertical motion blur and organic ripples. Replace v1's smoke plume with barely visible ultra-subtle cool vapor haze. Real matte near-black studio paper sweep (#0C0D10-ish) with soft circular neutral white light pool and subtle rim kickers, 90mm f/4 macro lens, organic sensor grain, strictly NO text/logos/watermarks/props.

### `hero-night.jpg` (2400×1350 — v2 LIVE) & `og.jpg` (1200×630 — v2 LIVE)

- **Reference image**: v2 `pack-shot.jpg`.
- **Post-processing**: `hero-night.jpg` Lanczos 1376×768 → 2400×1350 (`q=88, subsampling=2`, 292,257 B); `og.jpg` bottom-weighted (`v_bias=0.72`) 1.905:1 crop from raw v2 hero → 1200×630 (`q=96, subsampling=0`, 210,268 B).

> Photorealistic 16:9 widescreen nighttime bedroom hero photograph anchored on v2 `pack-shot.jpg` (exact 3-puff bead-blasted matte warm-ivory cloud + hairline seam, single back-right brushed-champagne stem + collar, shallow frosted basin with 4 blank flush circular front buttons, white USB-C cable with strain-relief boot). Product in the RIGHT third on a real open-pore dark walnut nightstand at compact bedside scale, beside a simple half-full clear water glass and soft out-of-focus plain paperback book corner (zero legible text) on the far right. ENTIRE LEFT HALF is deep, dark, cool charcoal/blue-grey shadowed roller-stippled bedroom wall completely uncluttered for headline typography. Warm ~2400K amber underside LED glow with natural inverse-square falloff, 4–7 sparse irregular separate clear water droplets with subtle ~1/125s vertical motion blur, organic concentric ripples, tiny rim droplets, faint dust on wood, ultra-subtle barely visible vapor haze (NO cigarette-smoke plume). 35mm full-frame 50mm f/1.8 ISO 1600, shallow DOF, organic low-light grain, strictly NO text/logos/people.

### `desk-day.jpg` (1600×1200 — v2 LIVE)

- **Reference image**: v2 `pack-shot.jpg`.
- **Post-processing**: Lanczos 1200×896 → 1600×1200 (`q=90, subsampling=0`, 292,414 B).

> Photorealistic 4:3 morning window-daylight lifestyle photograph anchored on v2 `pack-shot.jpg` (exact 3-puff bead-blasted matte warm-ivory cloud + hairline seam, single back-right brushed-champagne stem + collar, frosted basin with 4 blank flush circular front buttons, white USB-C cable). LED completely OFF; 5–7 sparse irregular separate falling clear water droplets with subtle ~1/125s vertical motion blur, organic ripples, tiny rim droplets and faint mineral line, barely visible backlit diffuse vapor haze (NO smoke plume). Natural lived-in apartment light-oak desk beside softly wrinkled sheer off-white linen window curtains, handmade stoneware coffee mug, unbranded closed silver-aluminum laptop edge (no logo), woven oatmeal linen notebook, and imperfect potted houseplant in matte pot. 35mm full-frame 50mm f/2.0, shallow DOF, organic film grain, strictly NO text/logos/people.

### `rain-macro.jpg` (1200×1500 — v2 LIVE)

- **Reference image**: v2 `pack-shot.jpg`.
- **Post-processing**: Generated at 3:4 portrait (896×1200), vertically cropped (`v_bias=0.58`) to 4:5 and Lanczos-upscaled to 1200×1500 (`q=91, subsampling=0`, 289,276 B).

> Photorealistic vertical portrait macro close-up anchored on v2 `pack-shot.jpg` framing the ~10 cm open space between the matte warm-ivory bead-blasted 3-puff cloud underside (fine micro-grain plastic + hairline seam + pinhole outlets) and the frosted polycarbonate basin rim (tiny stray water beads, faint mineral line). Soft-bokeh single brushed-champagne stem with collar at back-right. Sparse irregular separate clear water droplets mid-fall plus 1–2 clinging droplets detaching from the underside, organic concentric ripples and small realistic rebounding micro-splash (no sculptural CGI crown, no rigid pearl-necklace chains). Soft warm ~2400K amber underside LED glow against dark-warm creamy bokeh, whisper-faint vapor haze (NO smoke tendrils), 90mm f/2.8 macro, organic film grain, strictly NO text/logos/people.

### `evening-shelf.jpg` (1600×1200 — v2 LIVE)

- **Reference image**: v2 `pack-shot.jpg`.
- **Post-processing**: Lanczos 1200×896 → 1600×1200 (`q=90, subsampling=0`, 286,920 B).

> Photorealistic 4:3 candid dusk/blue-hour living-room lifestyle photograph anchored on v2 `pack-shot.jpg` on a floating solid-oak shelf mounted on a textured warm-grey lime/plaster wall beside a cool deep-twilight window on the left. Exact 3-puff matte ivory cloud + hairline seam, single back-right champagne stem + collar, frosted basin with 4 blank flush front buttons, white USB-C cable tucked back-right. Muted realistic pastel lavender underside LED glow (not neon purple) with natural inverse-square falloff onto the plaster wall, sparse separate falling clear water droplets with subtle ~1/125s motion blur, delicate organic ripples, tiny rim droplets, ultra-subtle vapor haze (NO smoke plume). Styled on right with handmade speckled matte stoneware cup and worn blank cloth-bound hardcover books (zero text/letters). 50mm f/2.0, authentic high-ISO dusk grain, strictly NO text/logos/people.

### `in-the-box.jpg` (1600×1200 — v2 LIVE)

- **Reference image**: v2 `pack-shot.jpg`.
- **Post-processing**: Lanczos 1200×896 → 1600×1200 (`q=71, subsampling=2`, 292,996 B).

> Photorealistic 4:3 overhead 90-degree flat-lay knolling photograph anchored on v2 `pack-shot.jpg` on flat softly creased pale cool-grey woven natural linen. Disassembled Mistlo components: (1) blank matte warm-ivory bead-blasted 3-puff cumulus cloud top, (2) empty dry frosted warm-ivory polycarbonate basin showing both the rear-right stem socket and the subtle row of 4 blank flush circular buttons along the front rim edge, (3) ONE single slim brushed-champagne anodized aluminum support stem with machined collar, (4) neatly coiled matte off-white USB-C cable with white plugs, (5) solid round heather-grey wool felt coaster with NO center hole, (6) slender wooden cleaning brush with fine white bristles, (7) 100% BLANK crisp off-white heavyweight matte folded paper card (zero printed text, letters, numbers, icons, or logos). Soft directional overhead studio daylight, realistic contact shadows, 50mm f/5.6, organic grain, strictly NO text/logos/watermarks.

---

## v2 Realism Pass — Pending Prompts (Blocked Until Quota Reset at `2026-11-26T08:27:02Z` / `18:27:02+10:00`)

All 4 remaining NEW shots anchor on v2 `pack-shot.jpg`:

1. **`hand-button.jpg` (1600×1200, 4:3 — NEW, PENDING)** — Close-up 50mm f/2.0 lifestyle shot in warm late-afternoon window light + soft ~2400K amber LED glow: anatomically accurate natural adult human hand (5 normal fingers, real skin pores/knuckles/cuticles/unadorned nails) entering from lower-left foreground with index fingertip gently pressing one of the 4 small blank flush circular matte warm-ivory buttons centered low on the front edge of the frosted basin (remaining 3 buttons clearly visible in their horizontal row) on an open-pore dark walnut nightstand; 4–6 sparse motion-blurred droplets, tiny rim beads, no smoke, no text/icons.
2. **`detail-stem.jpg` (1200×1500, 4:5 — NEW, PENDING)** — 90mm f/3.2 macro detail photograph from rear-right 3/4 angle in soft side window daylight (LED OFF): fine brushed-champagne anodized aluminum stem with subtle fingerprint sheen seating cleanly into its machined collar on the frosted basin, curved clear water meniscus + 3–4 stray rim droplets + faint mineral waterline, and matte white USB-C plug/strain-relief boot seated in the recessed rear-right port with off-white cable curving naturally across walnut/oak wood grain; no text/logos/specs.
3. **`packaging.jpg` (1600×1200, 4:3 — NEW, PENDING)** — 35mm f/2.8 sunlit tabletop unboxing photograph (~38° angle) on warm solid oak: plain 100% UNBRANDED raw recycled-kraft corrugated tuck-top box flipped open (strictly ZERO text/logos/labels/barcodes/recycling icons anywhere) with fibrous raw grey-beige moulded paper-pulp protective tray holding the Mistlo 3-puff cloud, frosted basin (4 blank buttons visible), single brushed-champagne stem, and kraft-paper-tied white USB-C cable cleanly in custom molded cavities.
4. **`scale-hand.jpg` (1600×1200, 4:3 — NEW, PENDING)** — 35mm f/2.8 candid bright morning window-light bedroom nightstand shot showing Mistlo (~22 cm tall, ~18 cm cloud, ~14 cm basin, 4 blank front buttons, LED OFF) on open-pore dark walnut directly beside a standard ~15 cm black-glass smartphone (blank off screen with subtle reflection/smudge, zero logos/UI) and a handmade ~9.5 cm matte stoneware coffee mug for accurate real-world scale, with softly rumpled oatmeal linen bedding blurred behind; no smoke, no text/logos.

---

## Original v1 Archive (`photos/_v1/` — Legacy Reference)

All original v1 photographs (preserved in `photos/_v1/`) were generated using the earlier two-stage workflow below:

1. **Canonical Studio Reference (`pack-shot.jpg`)**: Generated first on a clean seamless studio sweep to lock down exact geometry, proportions, and materials (3-puff matte warm-ivory velvety cumulus cloud ~18 cm wide with flat underside, ONE single slim brushed-champagne rear metal stem leaving a ~10 cm gap, shallow ~14 cm translucent frosted warm-ivory circular basin, thin off-white rear USB-C cable, zero logos/text).
2. **Reference-Anchored Scene Generation**: Every subsequent scene (`hero-night.jpg`, `desk-day.jpg`, `rain-macro.jpg`, `glow-studio.jpg`, `in-the-box.jpg`, `evening-shelf.jpg`) was generated using the canonical `pack-shot` image as a visual product reference so the physical silhouette, stem placement, and material finishes stay consistent across studio, lifestyle, macro, and unboxed flat-lay shots.
3. **Post-Processing**: Each selected take was resized with high-quality bicubic filtering to its exact target dimensions, saved as sRGB JPEG, and quality-tuned to stay under 300 KB.

---

## 1. `hero-night.jpg` (2400×1350)

**Reference image:** Canonical `pack-shot` studio photo.

> Using the exact product design shown in the reference image, generate a photorealistic 16:9 widescreen hero product photograph (`hero-night`) for a calm nighttime bedroom scene.
>
> CRITICAL PRODUCT CONSISTENCY — keep the humidifier IDENTICAL to the reference image:
> - Same soft, rounded 3-puff cumulus cloud (~18 cm wide), matte warm-ivory slightly velvety finish, flat underside, zero logos/text.
> - Same ONE single slim brushed-champagne metal stem rising vertically from the rear edge of the basin up to the back underside of the cloud (~10 cm open gap).
> - Same round shallow translucent frosted warm-ivory plastic basin (~14 cm diameter) holding clear water.
> - Thin off-white USB-C cable running subtly off the back of the basin.
> - Small nightstand-object scale.
>
> ACTIVE STATE IN THIS SHOT:
> - Soft warm amber LED glow emanating from the flat underside of the cloud, casting warm golden-amber light downward onto the water and softly illuminating the bedroom wall behind it.
> - Thin, realistic clear water droplets falling from the flat underside of the cloud into the basin, creating delicate concentric ripples on the water surface.
> - A faint, wispy curl of cool mist drifting gently upward from the top of the cloud.
>
> SCENE & COMPOSITION (16:9 landscape):
> - Dark, calm, peaceful minimalist bedroom at night.
> - The Mistlo humidifier sits on a rich dark walnut wood nightstand positioned firmly in the RIGHT third of the frame.
> - Nearby on the walnut nightstand (still on the right side): an open paperback book lying face-up with soft blurred unreadable pages (NO legible text!) and a simple clear drinking glass half-filled with water catching subtle amber reflections.
> - The LEFT half of the frame MUST be dark, deep blue-grey shadowed bedroom wall/space, calm, smooth, and completely uncluttered (headline typography will be placed over the left half).
> - Deep cool blue-grey night shadows contrasting beautifully with the warm amber glow of the Mistlo.
> - Cinematic editorial photography, full-frame 50mm f/1.8 lens, shallow depth of field, natural filmic grain, authentic low-light dynamic range.
> - Strictly NO text, NO watermarks, NO logos, NO brand names, NO people.

---

## 2. `desk-day.jpg` (1600×1200)

**Reference image:** Canonical `pack-shot` studio photo.

> Using the exact product design shown in the reference image, generate a photorealistic 4:3 landscape lifestyle product photograph (`desk-day`) on a bright sunlit desk by a window.
>
> CRITICAL PRODUCT CONSISTENCY — keep the humidifier IDENTICAL to the reference image:
> - Same soft, rounded 3-puff cumulus cloud (~18 cm wide), matte warm-ivory slightly velvety finish, flat underside, zero logos/text.
> - Same ONE single slim brushed-champagne metal stem rising vertically from the rear edge of the basin up to the back underside of the cloud (~10 cm open gap).
> - Same round shallow translucent frosted warm-ivory plastic basin (~14 cm diameter) holding clear water.
> - Thin off-white USB-C cable running neatly off the back of the basin.
> - Compact desk-object scale.
>
> ACTIVE STATE IN THIS SHOT:
> - Internal LED light is COMPLETELY OFF (no glow at all).
> - Rain is ON: thin, real, delicate clear water droplets falling from the flat underside of the cloud into the clear water in the frosted basin, creating subtle tiny ripples on the surface.
> - A faint, wispy curl of cool mist drifting softly from the top of the cloud, softly backlit by window daylight.
>
> SCENE & COMPOSITION (4:3 landscape):
> - Bright, airy Scandinavian-inspired workspace desk next to a sunlit window with soft sheer white linen curtains diffusing natural morning daylight.
> - The Mistlo sits naturally on a warm light-oak wooden desk surface.
> - Thoughtful minimalist desk props around it: a small trailing green potted plant (like string of pearls or small pothos in a plain matte ceramic pot), the sleek silver-aluminum corner edge of a closed laptop (strictly NO logo or apple icon!), and natural woven beige linen texture (such as a plain fabric-covered notebook or coaster).
> - Bright, airy natural daylight, soft gentle directional shadows, clean editorial interior/product photography, 50mm lens, shallow natural depth of field.
> - Strictly NO text, NO watermarks, NO logos, NO brand names, NO people.

---

## 3. `rain-macro.jpg` (1200×1500)

**Reference image:** Canonical `pack-shot` studio photo (generated at 3:4 portrait and center-weighted cropped to exact 4:5 1200×1500).

> Using the exact product design shown in the reference image, generate a photorealistic vertical portrait macro close-up photograph (`rain-macro`) focusing on the falling water droplets and ripples.
>
> CRITICAL PRODUCT CONSISTENCY — keep every visible part of the humidifier IDENTICAL to the reference image:
> - Same matte warm-ivory slightly velvety 3-puff cumulus cloud with a clean flat underside (visible across the upper portion of the portrait frame, no logos or text).
> - Same ONE slim brushed-champagne metal stem visible in soft focus at the rear right edge of the basin.
> - Same round shallow translucent frosted warm-ivory plastic basin holding clear water (visible across the lower portion of the portrait frame).
>
> ACTIVE STATE & MACRO DETAILS:
> - Intimate macro close-up framing the ~10 cm open space between the cloud's flat underside and the water surface in the shallow frosted basin.
> - Thin, crisp, glistening real water droplets detaching from the underside of the matte ivory cloud and falling mid-air into the clear water below, frozen with crisp high-shutter-speed macro clarity.
> - Delicate concentric ripples and tiny translucent splash crowns forming where droplets strike the clear water in the frosted ivory basin.
> - A soft warm amber LED backlight glowing from the underside of the cloud, illuminating each falling droplet and the translucent rim of the basin with warm golden highlights.
> - Subtle wisps of cool delicate mist catching the warm amber glow.
> - Deep moody dark-warm out-of-focus background with creamy circular bokeh.
> - Shot on a 100mm f/2.8 macro lens, ultra-detailed optical refraction in water droplets, photorealistic commercial cinematography.
> - Strictly NO text, NO watermarks, NO logos, NO people.

---

## 4. `glow-studio.jpg` (1600×1600)

**Reference image:** Canonical `pack-shot` studio photo.

> Using the exact product design shown in the reference image, generate a photorealistic 1:1 square studio product photograph (`glow-studio`) on a seamless near-black studio background with NEUTRAL WHITE LED light ON and rain ON.
>
> CRITICAL PRODUCT CONSISTENCY — match the exact silhouette, proportions, angle, and materials of the reference image:
> - Same soft, rounded 3-puff cumulus cloud (~18 cm wide), matte warm-ivory velvety finish, flat underside, zero logos/text.
> - Same ONE single slim brushed-champagne metal stem rising vertically from the rear right edge of the basin up to the back underside of the cloud (~10 cm gap).
> - Same round shallow translucent frosted warm-ivory plastic basin (~14 cm diameter) holding clear water.
> - Thin off-white USB-C cable running subtly off the back right edge.
> - Same centered straight-on slight 3/4 camera angle with comfortable dark studio margin on all sides.
>
> LIGHTING & ACTIVE STATE (CRITICAL FOR CSS COLOR TINTING):
> - LED glow from the flat underside of the cloud is ON in PURE NEUTRAL WHITE (clean balanced 4800K neutral white light — NO warm yellow/orange tint, NO blue tint, pure neutral white light so it can be cleanly color-tinted in CSS later).
> - Thin, real clear water droplets falling from the cloud's flat underside into the water in the frosted basin, creating delicate ripples lit crisply by the neutral white underside glow.
> - A faint, wispy curl of cool mist drifting softly upward from the top of the cloud.
> - The neutral white glow illuminates the frosted translucent basin from within and casts a soft, smooth, circular pool of neutral white light onto the matte near-black studio tabletop around the base.
> - Seamless, uniform near-black matte studio sweep background (#0C0D10-ish) with clean, crisp edges around the cloud silhouette and subtle studio rim lighting so the top contour of the ivory cloud separates cleanly from the dark background.
> - Strictly NO text, NO watermarks, NO logos, NO props, NO color cast.

---

## 5. `pack-shot.jpg` (1600×1600)

**Canonical base generation (no prior reference image).**

> Generate a photorealistic 1:1 square studio product photograph (e-commerce pack shot) of an original invented modern tabletop humidifier and night light called Mistlo (do NOT put any brand name, text, or logo on the product or image).
>
> Exact product design (must be clean, iconic, and realistic industrial design):
> - Top piece: A soft, rounded minimalist cumulus cloud about 18 cm wide composed of 3 gentle rounded puffs (one larger centered puff flanked by two slightly smaller rounded side puffs), with a flat underside. Material is a matte warm-ivory slightly velvety soft-touch finish. Completely smooth and blank — NO logos, NO text, NO buttons, NO icons.
> - Support stem: The cloud is suspended about 10 cm above the base by ONE single slim brushed-champagne metal stem rising vertically from the rear edge of the basin up into the back underside of the cloud. Only one stem, positioned at the back edge, leaving an open airy 10 cm gap underneath the cloud.
> - Base: A round, shallow minimalist basin about 14 cm in diameter and ~3.5 cm tall, made of translucent frosted warm-ivory plastic, filled with clear water visible from the slight elevation angle.
> - Cable: A thin, neat matte off-white USB-C power cable extending from the back edge of the base and trailing softly backward.
> - State: Internal LED light is completely OFF. No mist or water droplets needed in this clean dry/still pack shot (just clear still water in the shallow basin).
> - Scale: Looks like a compact, refined bedside/desk object.
>
> Composition & Photography:
> - Centered in a 1:1 square frame with comfortable pale grey margin all around so nothing is cropped.
> - Slightly elevated eye-level camera angle (about 12 degrees above horizontal) and subtly turned (~15 degrees off front-center) so the 3-puff cloud silhouette, the single rear brushed-champagne stem, the 10 cm gap, and the shallow water-filled frosted basin are all unmistakably clear.
> - Seamless pale cool-grey (#E6E9EC) studio sweep background and surface.
> - Soft diffused studio softbox lighting from upper left, subtle realistic soft contact shadow under the basin.
> - Photorealistic commercial product photography, medium-format camera, 90mm macro/portrait lens, crisp focus front to back, authentic matte ceramic-like soft plastic, frosted translucent polymer, and fine brushed champagne metal grain.
> - Strictly NO text, NO watermarks, NO logos, NO labels, NO props, NO people.

---

## 6. `in-the-box.jpg` (1600×1200)

**Reference image:** Canonical `pack-shot` studio photo (regenerated on second take to ensure a solid circular felt coaster with no center hole).

> Using the exact product design shown in the reference image, generate a photorealistic 4:3 landscape top-down flat-lay ("in the box") photograph (`in-the-box`) on pale grey linen.
>
> CRITICAL PRODUCT CONSISTENCY — the disassembled Mistlo components must EXACTLY match the reference product:
> 1. The matte warm-ivory slightly velvety 3-puff rounded cumulus cloud top (~18 cm wide, completely blank, no logos/text) laid cleanly on the linen.
> 2. The round, shallow translucent frosted warm-ivory plastic basin (~14 cm diameter), empty and dry, laid cleanly beside it.
> 3. The ONE single slim brushed-champagne metal support stem (~10 cm slim anodized metal rod) placed neatly parallel next to the cloud and basin so it clearly matches the reference assembly.
> 4. A neatly coiled thin matte white USB-C cable with clean minimalist white USB-C connectors.
> 5. A solid round pale-to-medium heather-grey wool felt coaster (~15 cm diameter, clean circular disc with no hole).
> 6. A small minimalist cleaning brush (slender pale wood handle with soft fine white nylon bristles).
> 7. A completely BLANK crisp off-white heavyweight matte folded paper card (simple minimalist booklet/card folded in half — 100% BLANK paper surface with ZERO printed text, ZERO letters, ZERO icons, ZERO logos).
>
> COMPOSITION & PHOTOGRAPHY (4:3 landscape):
> - True 90-degree overhead bird's-eye flat-lay (knolling grid arrangement), neatly aligned with balanced negative space and breathing room around every object.
> - Background is a flat, softly textured pale cool-grey woven natural linen cloth filling the entire frame edge to edge.
> - Soft, even, diffused overhead daylight studio lighting with gentle natural contact shadows beneath each item.
> - Ultra-sharp medium-format commercial product photography, realistic textures of velvety matte plastic, frosted translucent polymer, brushed champagne metal, wool felt, woven linen, and matte paper.
> - Strictly NO text, NO letters, NO numbers, NO watermarks, NO logos, NO brand names anywhere (especially keep the folded card 100% blank).

---

## 7. `evening-shelf.jpg` (1600×1200)

**Reference image:** Canonical `pack-shot` studio photo.

> Using the exact product design shown in the reference image, generate a photorealistic 4:3 landscape lifestyle photograph (`evening-shelf`) of the Mistlo humidifier on a cozy living-room shelf at dusk.
>
> CRITICAL PRODUCT CONSISTENCY — keep the humidifier IDENTICAL to the reference image:
> - Same soft, rounded 3-puff cumulus cloud (~18 cm wide), matte warm-ivory slightly velvety finish, flat underside, zero logos/text.
> - Same ONE single slim brushed-champagne metal stem rising vertically from the rear edge of the basin up to the back underside of the cloud (~10 cm open gap).
> - Same round shallow translucent frosted warm-ivory plastic basin (~14 cm diameter) holding clear water.
> - Thin off-white USB-C cable tucked discreetly off the back edge of the shelf.
> - Realistic small shelf-object scale relative to books and ceramics.
>
> ACTIVE STATE IN THIS SHOT:
> - Internal LED glow from the flat underside of the cloud is ON in a SOFT LAVENDER hue (gentle, calming pastel lavender/lilac glow — not harsh neon purple — casting a dreamy soft lavender light downward onto the falling droplets, frosted basin, and softly grazing the wall behind).
> - Rain is ON: thin, realistic clear water droplets falling from the flat underside of the cloud into the basin, creating delicate ripples on the water surface.
> - A faint, wispy curl of cool mist drifting softly from the top of the cloud.
>
> SCENE & COMPOSITION (4:3 landscape):
> - A stylish modern living-room floating oak/walnut wooden shelf or low shelving unit at dusk / blue hour.
> - Styled naturally with a few tactile handmade matte ceramic objects (such as a small speckled off-white stoneware vase, a small sculptural ceramic vessel) and a short stack or row of cloth-bound hardcover books with plain blank/unreadable cloth spines (strictly NO legible titles or text!).
> - Soft twilight blue-grey dusk ambient light in the living room, cozy atmospheric warmth, subtle wall plaster texture behind the shelf.
> - Editorial interior photography, 50mm lens, shallow depth of field, natural filmic grain and authentic dusk exposure.
> - Strictly NO text, NO watermarks, NO logos, NO brand names, NO people.

---

## 8. `og.jpg` (1200×630)

**Derived directly from Shot 1 (`hero-night.jpg`)**: Aspect-ratio crop to exact 1200×630 (1.905:1 Open Graph social sharing aspect ratio), bottom-weighted vertical crop (`bias = 0.72`) so the entire Mistlo cloud, falling droplets, glowing frosted basin, water glass, and walnut nightstand remain cleanly framed on the right while preserving the dark uncluttered left half for social card overlays or clean presentation.
