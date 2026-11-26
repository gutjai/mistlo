# Mistlo Product Photography — AI Workflow & Final Prompts

## Tooling, Model & Current Pass Status (v2 Realism Pass — 2026-11-26)

- **Image generation tool/model**: Antigravity `generate_image` (`gemini-3.1-flash-image`).
- **Video generation tool (Part B)**: **Not available** in this environment (no Veo or other video-generation tool/MCP server is present; `ffmpeg` is installed, so compression/poster extraction would be possible once raw video exists, but video generation itself cannot be run here).
- **Backup**: All original v1 images (`desk-day.jpg`, `evening-shelf.jpg`, `glow-studio.jpg`, `hero-night.jpg`, `in-the-box.jpg`, `og.jpg`, `pack-shot.jpg`, `rain-macro.jpg`) were copied intact into `photos/_v1/` before any overwrite.
- **v2 Completion & Blocker**:
  - **Completed**: `pack-shot.jpg` (1600×1600, ≤300 KB sRGB progressive JPEG, Lanczos-upscaled from 1024×1024 `gemini-3.1-flash-image` output, anchored on `_v1/pack-shot.jpg`). Adds realistic bead-blasted plastic micro-grain, hairline underside cloud seam, machined stem collar, curved water meniscus, stray rim droplets, organic coiled-memory USB-C cable bend with white strain-relief boot, and **4 subtle blank flush circular matte warm-ivory tactile buttons** centered low on the front edge of the frosted base.
  - **Blocked by image-model quota**: After generating `pack-shot.jpg` v2, all 9 remaining v2 scene generations (`hero-night.jpg`, `desk-day.jpg`, `rain-macro.jpg`, `evening-shelf.jpg`, `glow-studio.jpg`, `hand-button.jpg`, `detail-stem.jpg`, `packaging.jpg`, `scale-hand.jpg`) immediately returned `429 RESOURCE_EXHAUSTED` / `QUOTA_EXHAUSTED` on `gemini-3.1-flash-image` (reported quota reset: `2026-11-26T03:27:02Z` / `13:27:02+10:00`). Accordingly, `hero-night.jpg`, `desk-day.jpg`, `rain-macro.jpg`, `evening-shelf.jpg`, `glow-studio.jpg`, and `og.jpg` currently remain their v1 files, and the 4 new files (`hand-button.jpg`, `detail-stem.jpg`, `packaging.jpg`, `scale-hand.jpg`) could not be generated yet.

---

## v2 Realism Pass — Completed Anchor

### `pack-shot.jpg` (1600×1600 — v2 LIVE)

- **Tool/model**: `generate_image` (`gemini-3.1-flash-image`), anchored on `_v1/pack-shot.jpg`; post-processed with Pillow Lanczos resize to 1600×1600, progressive sRGB JPEG under 300 KB.

> Use `_v1/pack-shot.jpg` as the visual reference for exact product geometry and proportions, and transform it from a clean CGI-looking render into an authentic, unmistakably real photograph taken by a skilled product photographer with a real camera.
> - Top: Soft 3-puff minimalist cumulus cloud (~18 cm wide) with flat underside, bead-blasted matte warm-ivory ABS plastic (subtle real micro-grain texture, NOT smooth CG clay), realistic hairline manufacturing seam around the lower edge where the underside plate meets the cloud shell.
> - Stem: ONE single slim brushed-champagne anodized aluminum stem at the back-right (~10 cm open gap) with a tiny machined collar/seam where it enters the frosted basin and faint natural specular highlight and subtle fingerprint sheen.
> - Base: Shallow round translucent frosted warm-ivory polycarbonate basin (~14 cm diameter, ~3.5 cm tall) filled with real clear water, curved meniscus along inner frosted wall, soft rectangular softbox reflection, 2–3 tiny stray water droplets on the inner rim, faint mineral trace.
> - Front controls (consistent across v2): Centered low along the front face of the base, a subtle minimalist horizontal row of 4 small flush circular matte warm-ivory tactile buttons (~5 mm diameter each, tiny hairline gaps, completely blank — NO icons, NO text, NO symbols).
> - Cable: Thin matte off-white USB-C power cable plugged into the back-right with a small white strain-relief collar, trailing rightward with realistic slight wave/memory bends from having been coiled.
> - Camera & lighting: 35mm full-frame camera, 90mm f/5.6 macro lens, asymmetric diffused softbox from upper-left with gentle right fill bounce, subtle caustic light transmission and layered contact shadow on matte light-grey paper sweep with faint paper tooth, subtle organic film grain, LED OFF, no droplets/mist, strictly NO text/logos/icons/watermarks.

---

## v2 Realism Pass — Prepared Prompts (Pending `gemini-3.1-flash-image` Quota Reset at `2026-11-26T03:27:02Z`)

All 9 shots below are designed to anchor directly on the v2 `pack-shot.jpg` (keeping the exact 3-puff matte ivory cloud, hairline seam, back-right brushed-champagne stem + collar, frosted basin with 4 blank flush front buttons, and white USB-C cable) while fixing v1 CGI artifacts (replacing cigarette-smoke plumes with near-invisible diffuse cool vapor, replacing uniform vertical bead strings with sparse irregular 1/125s motion-blurred droplets, and adding real-world lighting falloff, dust, water spots, mineral line, and lens character):

1. **`hero-night.jpg` (2400×1350, 16:9)** — Product in RIGHT third on open-pore dark walnut nightstand at night, LEFT half dark roller-stippled charcoal/blue-grey bedroom wall completely empty for headline text. Warm ~2400K amber underside glow, 4–7 sparse irregular falling droplets with subtle 1/125s motion blur, natural ripples, ultra-subtle cool vapor haze (NO cigarette-smoke plume), tiny water spots on rim, subtle dust on wood, imperfect cable curve, clear half-full water glass + blurred unreadable paperback corner on far right, 50mm f/1.8 ISO 1600 low-light film grain.
2. **`desk-day.jpg` (1600×1200, 4:3)** — Natural apartment window morning daylight through softly wrinkled sheer linen curtains on light-oak desk. LED OFF, sparse irregular falling drops with 1/125s motion blur, subtle ripples, tiny water spots/mineral line, barely visible backlit vapor (NO smoke plume), lived-in unbranded props (used stoneware mug, closed logo-free aluminum laptop edge, plain linen notebook, imperfect potted plant), 50mm f/2.0 shallow DOF & grain.
3. **`rain-macro.jpg` (1200×1500, 4:5)** — 90mm f/2.8 macro framing the ~10 cm gap between cloud underside (micro-grain plastic + hairline seam) and frosted basin rim (tiny water beads, faint mineral line). Only 5–8 sparse irregular droplets mid-fall with authentic 1/125s vertical motion blur + 1–2 clinging droplets detaching from tiny pinhole outlets, organic ripples/subtle micro-splash, warm amber backlight, whisper-faint vapor glow (NO smoke tendrils), subtle fingerprint on soft-bokeh champagne stem.
4. **`evening-shelf.jpg` (1600×1200, 4:3)** — Candid dusk/blue-hour living-room floating oak shelf beside cool twilight window on left. Muted realistic pastel lavender underside LED glow with natural falloff onto textured plaster wall, sparse 1/125s motion-blurred drops, delicate ripples, NO smoke plume, imperfect handmade stoneware ceramics and worn blank cloth hardcover books (zero legible text), 50mm f/2.0 high-ISO grain.
5. **`glow-studio.jpg` (1600×1600, 1:1)** — Real matte near-black studio sweep (#0C0D10-ish) with PURE NEUTRAL WHITE (4800K–5000K, zero warm/cool cast for CSS tinting) underside LED glow, 5–7 sparse irregular 1/125s droplets, organic ripples, whisper-faint vapor (NO smoke plume), soft neutral circular light pool on matte sweep, subtle studio rim kickers separating cloud silhouette, 90mm f/4 macro with subtle sensor grain.
6. **`og.jpg` (1200×630)** — To be derived directly via bottom-weighted 1.905:1 crop from v2 `hero-night.jpg`.
7. **`hand-button.jpg` (1600×1200, 4:3 — NEW)** — Close-up 50mm f/2.0 lifestyle shot in late-afternoon window light + warm amber LED glow: natural adult human hand (anatomically accurate 5 fingers, real skin texture/pores/cuticles) entering from lower-left with index finger pressing one of the 4 small blank flush circular buttons on the lower front edge of the frosted basin on a walnut nightstand.
8. **`detail-stem.jpg` (1200×1500, 4:5 — NEW)** — 90mm f/3.2 macro from rear-right 3/4 angle showing brushed-champagne stem with faint fingerprint smudge seating into machined collar on frosted basin, clear water meniscus + stray rim droplets + faint mineral line, and matte white USB-C plug/strain-relief plugged into the recessed rear-right port with cable curving naturally across oak/walnut grain.
9. **`packaging.jpg` (1600×1200, 4:3 — NEW)** — 35mm f/2.8 sunlit tabletop unboxing shot (~38° angle): plain completely unbranded raw recycled-kraft corrugated box (ZERO text/logos/labels/barcodes) flipped open on warm oak table, showing the Mistlo cloud, frosted basin (4 blank buttons), brushed-champagne stem, and paper-tied white USB-C cable nested in a fibrous raw grey-beige moulded paper-pulp tray.
10. **`scale-hand.jpg` (1600×1200, 4:3 — NEW)** — 35mm f/2.8 candid morning window-light bedroom nightstand shot placing the Mistlo (~18 cm cloud / ~14 cm basin / ~22 cm tall) next to a standard ~15 cm black-glass smartphone (blank off screen with subtle reflection/smudge, no logos) and a handmade ~9.5 cm stoneware coffee mug on dark walnut wood with unmade oatmeal linen blurred behind.

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
