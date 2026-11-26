# Mistlo live demo

Serve `site/src` over HTTP and open `/demo/demo.html` for the standalone preview. For example, from the `site` directory run `python -m http.server 8766 --directory src`.

## Mounting

For production, copy `mistlo-demo.js` and `mistlo-demo.css` into a `demo/` directory. Keep `assets/photos/glow-studio.jpg` one level above that directory. Load the stylesheet once and mount after the host exists. Use site-relative URLs appropriate to the host page.

```html
<link rel="stylesheet" href="./demo/mistlo-demo.css">
<div data-mistlo-demo></div>
<script type="module">
  import { mountAllMistloDemos } from './demo/mistlo-demo.js';
  mountAllMistloDemos();
</script>
```

- `mountMistloDemo(host, options = {})` mounts into an element and returns a controller with `destroy()`. Calling it again on the same host returns the existing controller. Call `destroy()` before removing the host when navigating dynamically.
- `mountAllMistloDemos(scope = document, options)` mounts all descendant hosts marked with `data-mistlo-demo` and returns their controllers. The module does not auto-mount.

| Option | Default | Values |
| --- | --- | --- |
| `mode` | `steady` | `drizzle`, `steady`, `pour` |
| `color` | `warm-amber` | `warm-amber`, `candle`, `soft-white`, `dusk-rose`, `lavender`, `sea-glass`, `midnight-blue` |
| `brightness` | `medium` | `low`, `medium`, `high` |
| `cycle` | `false` | `true` to start slow color cycling. Selecting a swatch stops cycling. |
| `cycleInterval` | `8000` | Milliseconds per color, with a 2000 ms minimum. |
| `intro` | `true` | Set to `false` to show full light and rain on first view. |
| `imageUrl` | `../assets/photos/glow-studio.jpg`, relative to the module | Optional alternate URL for the same square composition. The rim, photo masks, mist nozzle and drop landing points are calibrated to this photo. |

## Events

Events bubble from the demo section through the mount host. Attach listeners to the host to handle the events in the product page.

| Event | `event.detail` |
| --- | --- |
| `mistlo:mode` | `{ mode }` |
| `mistlo:color` | `{ color, name, hex, source }`, where `source` is `manual` or `cycle` |
| `mistlo:sound` | `{ enabled }`, the current sound preference |

A manual color selection emits on change. If analytics should count only deliberate swatch changes, filter for `source === 'manual'`. The module makes no analytics requests and stores no visitor data.

Canvas animation and sound pause when the photo is outside the viewport or the document is hidden. The cycle resumes with a fresh dwell period. Sound requires a click or keyboard activation each time the demo mounts. With reduced motion, the demo shows a still frame and keeps the rain, lighting and audio settings available. Rain audio in this view plays the filtered rain bed.

## Browser captures

- [Desktop, Warm Amber in Steady mode](./mistlo-desktop.png)
- [Mobile, Sea Glass in Pour mode](./mistlo-mobile.png)

## Verification

Headless Chrome exercised keyboard and touch controls, rain bursts, color cycling, sound opt-in and suspension, viewport and tab visibility, and reduced motion. The 390 × 920 touch profile with DPR 2.75 and 4× CPU throttling averaged 56.1 canvas paints per second in Pour mode. The 95th-percentile paint interval was 18.1 ms, with no tasks over 50 ms during the sampled animation and no console errors. One fresh mobile browser startup recorded an 83 ms long task, with no long-running module script attributed in the same frame.
