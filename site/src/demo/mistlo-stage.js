import * as THREE from '../vendor/three.module.min.js';
import { MarchingCubes } from '../vendor/MarchingCubes.js';
import { RoomEnvironment } from '../vendor/RoomEnvironment.js';
import { colors, modes, createAudio } from './mistlo-demo.js';

const TAU = Math.PI * 2;
const random = (min, max) => THREE.MathUtils.lerp(min, max, Math.random());
const presets = {
  colour: { color: 'lavender', turn: -.48, zoom: 1.08 },
  rain: { mode: 'pour', turn: .5, zoom: 1.2 },
  parts: { turn: -.26, zoom: .89, separation: 1 },
  power: { color: 'warm-amber', mode: 'steady', turn: 2.5, zoom: 1.05 },
};

function smoothMin(a, b, radius) {
  const blend = Math.max(radius - Math.abs(a - b), 0) / radius;
  return Math.min(a, b) - blend * blend * radius * .25;
}

function cloudShell(material) {
  // Smooth union of the three lobes and a rounded flat trim plane.
  const lobes = [
    [-1.00, .00, .60, .63, .61],
    [-.06, .24, .96, .96, .84],
    [1.05, -.07, .56, .56, .59],
  ];
  const extent = 1.82;
  const cells = 56;
  const surface = new MarchingCubes(cells, material, false, false, 32000);
  surface.isolation = 0;
  for (let z = 0; z < cells; z++) {
    const depth = (2 * z / cells - 1) * extent;
    for (let y = 0; y < cells; y++) {
      const height = (2 * y / cells - 1) * extent;
      for (let x = 0; x < cells; x++) {
        const width = (2 * x / cells - 1) * extent;
        let distance = Infinity;
        for (const [cx, cy, rx, ry, rz] of lobes) {
          const ellipsoid = Math.hypot((width - cx) / rx, (height - cy) / ry, depth / rz) - 1;
          distance = smoothMin(distance, ellipsoid * Math.min(rx, ry, rz), .115);
        }
        surface.field[x + y * cells + z * cells * cells] = smoothMin(-distance, height + .31, .10);
      }
    }
  }
  surface.update();
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(surface.positionArray.slice(0, surface.count * 3), 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(surface.normalArray.slice(0, surface.count * 3), 3));
  geometry.scale(extent, extent, extent);
  surface.geometry.dispose();
  return new THREE.Mesh(geometry, material);
}

function radialTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, '#fff');
  gradient.addColorStop(.34, '#ffffffa0');
  gradient.addColorStop(1, '#ffffff00');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

function makeProduct(scene) {
  const product = new THREE.Group();
  scene.add(product);
  const ivory = new THREE.MeshStandardMaterial({ color: 0xfff0db, roughness: .71, metalness: 0 });
  const shellGlow = new THREE.Color();
  // Fade the internal light through the lower edge of the matte shell.
  const shellMaterial = ivory.clone();
  shellMaterial.onBeforeCompile = shader => {
    shader.uniforms.shellGlow = { value: shellGlow };
    shader.vertexShader = 'varying float shellHeight;\n' + shader.vertexShader.replace(
      '#include <begin_vertex>', '#include <begin_vertex>\nshellHeight = position.y;',
    );
    shader.fragmentShader = 'varying float shellHeight;\nuniform vec3 shellGlow;\n' + shader.fragmentShader.replace(
      '#include <emissivemap_fragment>',
      '#include <emissivemap_fragment>\ntotalEmissiveRadiance += shellGlow * (1.0 - smoothstep(-0.32, -0.07, shellHeight)) * 0.7;',
    );
  };
  const trim = new THREE.MeshStandardMaterial({ color: 0xdbc6af, roughness: .31, metalness: .13 });
  const stemMaterial = new THREE.MeshStandardMaterial({ color: 0xe6c8ab, roughness: .24, metalness: .55 });
  const rimMaterial = new THREE.MeshStandardMaterial({ color: 0xf0d6b7, roughness: .27, transparent: true, opacity: .87, metalness: .13 });
  const glowMaterial = new THREE.MeshBasicMaterial({ color: 0xffc77b, toneMapped: false });
  const shell = new THREE.Group();
  const stem = new THREE.Group();
  const basin = new THREE.Group();
  const base = new THREE.Group();
  product.add(shell, stem, basin, base);

  const cloud = cloudShell(shellMaterial);
  shell.add(cloud);
  shell.position.y = 2.12;

  function lathe(points, material, parent) {
    const mesh = new THREE.Mesh(new THREE.LatheGeometry(points.map(([x, y]) => new THREE.Vector2(x, y)), 96), material);
    parent.add(mesh);
    return mesh;
  }
  function cylinder(radius, height, material, parent, x, y, z) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 48), material);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }

  const diffuser = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 20), glowMaterial);
  diffuser.scale.set(1.43, .031, .52);
  diffuser.position.y = -.322;
  shell.add(diffuser);
  cylinder(.052, 1.47, stemMaterial, stem, .91, 1.11, -.22);
  cylinder(.091, .045, trim, stem, .91, .409, -.22);
  lathe([[0, .018], [1.19, .018], [1.26, .027], [1.30, .06], [1.32, .11], [1.32, .25], [1.30, .28], [1.26, .30], [0, .30]], ivory, base);
  lathe([[0, .28], [1.30, .28], [1.33, .31], [1.34, .39], [1.33, .45], [1.31, .47], [1.25, .47], [1.22, .443], [1.21, .355], [1.17, .338], [0, .338]], rimMaterial, basin);
  const waterMaterial = new THREE.MeshPhysicalMaterial({ color: 0xa59b90, roughness: .19, metalness: .34, clearcoat: 1, transparent: true, opacity: .88 });
  cylinder(1.217, .016, waterMaterial, basin, 0, .39, 0);
  const reservoir = new THREE.Group();
  product.add(reservoir);
  const tankMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xb4cbcf, roughness: .25, metalness: .12, transparent: true, opacity: .65, side: THREE.DoubleSide,
  });
  lathe([[0, .03], [.95, .03], [1.02, .08], [1.04, .19], [1.02, .21], [.98, .20], [.95, .08], [0, .08]], tankMaterial, reservoir);

  for (const angle of [-.25, -.084, .084, .25]) {
    const button = cylinder(.058, .027, trim, base, Math.sin(angle) * 1.32, .165, Math.cos(angle) * 1.32);
    button.rotation.x = Math.PI / 2;
    button.rotation.y = angle;
  }
  const port = new THREE.Mesh(new THREE.BoxGeometry(.19, .064, .035), new THREE.MeshStandardMaterial({ color: 0x312b2b }));
  port.position.set(0, .14, -1.31);
  base.add(port);

  const glow = new THREE.PointLight(0xffc77b, 10, 3.6, 2);
  glow.position.set(0, 1.76, .16);
  product.add(glow);
  const reflected = new THREE.PointLight(0xffc77b, .54, 2.5, 2);
  reflected.position.set(-.23, .68, .62);
  product.add(reflected);

  const texture = radialTexture();
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.9, 2.85), new THREE.MeshBasicMaterial({
    map: texture, color: 0x050309, transparent: true, opacity: .83, depthWrite: false,
  }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -.008;
  product.add(shadow);
  const spill = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 3.8), new THREE.MeshBasicMaterial({
    map: texture, color: 0xffb768, transparent: true, opacity: .33, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  spill.rotation.x = -Math.PI / 2;
  spill.position.y = -.012;
  product.add(spill);

  const rain = new THREE.Group();
  product.add(rain);
  const droplets = Array.from({ length: 90 }, () => ({
    x: random(-.88, .66), z: random(-.25, .36), phase: Math.random(), speed: random(.8, 1.55), length: random(.022, .092),
  }));
  const vertices = new Float32Array(droplets.length * 6);
  const lines = new THREE.BufferGeometry();
  lines.setAttribute('position', new THREE.BufferAttribute(vertices, 3).setUsage(THREE.DynamicDrawUsage));
  const rainMaterial = new THREE.LineBasicMaterial({ color: 0xffdfb1, transparent: true, opacity: .69 });
  const streaks = new THREE.LineSegments(lines, rainMaterial);
  streaks.frustumCulled = false;
  rain.add(streaks);

  const ripples = Array.from({ length: 7 }, (_, index) => {
    const material = new THREE.MeshBasicMaterial({ color: 0xffd3a0, transparent: true, depthWrite: false, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(new THREE.RingGeometry(.9, 1, 40), material);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set((index - 3) * .24, .402, random(-.17, .32));
    rain.add(ring);
    return ring;
  });
  const mist = Array.from({ length: 4 }, () => {
    const material = new THREE.SpriteMaterial({ map: texture, color: 0xffe8d1, transparent: true, opacity: .06, depthWrite: false });
    const sprite = new THREE.Sprite(material);
    rain.add(sprite);
    return sprite;
  });

  return { product, shell, stem, basin, base, reservoir, shellGlow, glow, reflected, glowMaterial, spill, rain, drops: droplets, vertices, lines, rainMaterial, ripples, mist, cloud };
}

export function mountStage() {
  const story = document.querySelector('.mistlo-story');
  const frame = story.querySelector('.mistlo-visual');
  const container = frame.querySelector('.mistlo-render');
  const controls = story.querySelector('.mistlo-play');
  const sound = controls.querySelector('.mistlo-sound');
  const chapters = [...story.querySelectorAll('[data-scene]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 720px)');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' });
  if (!context) throw new Error('WebGL 2 unavailable');
  const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, compact.matches ? 1.65 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;

  const scene = new THREE.Scene();
  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(environment, .06).texture;
  scene.environmentIntensity = .40;
  environment.dispose();
  pmrem.dispose();

  const camera = new THREE.OrthographicCamera();
  camera.position.set(0, 3.3, 7);
  camera.lookAt(0, 1.61, 0);

  function light(color, intensity, position) {
    const source = new THREE.DirectionalLight(color, intensity);
    source.position.set(...position);
    scene.add(source);
  }
  light(0xffe1c5, 1.85, [-3, 6, 4]);
  light(0xc1c9ff, .92, [4, 4, -5]);
  light(0xffba76, .24, [3, 1, 3]);
  const lamp = makeProduct(scene);

  canvas.tabIndex = 0;
  canvas.setAttribute('aria-label', 'Interactive Mistlo lamp. Use arrow keys to rotate, or Enter to change glow colour.');
  container.append(canvas);

  const canPlayAudio = window.AudioContext || window.webkitAudioContext;
  sound.hidden = !canPlayAudio;
  let audio;
  let playing = false;
  let mode = 'steady';
  let color = 'warm-amber';
  let selectedMode = mode;
  let selectedColor = color;
  let chapter = '';
  let visible = true;
  let viewport = false;
  let request = 0;
  let lastTime = 0;
  let elapsed = 0;
  let bounce = 0;
  let thunder = 0;
  let spin = -.13;
  let tilt = 0;
  let velocity = 0;
  let separation = 0;
  let poseTurn = 0;
  let drag;
  let lastTap = -Infinity;
  const chipColors = new Map();
  const chipModes = new Map();
  const targetColor = new THREE.Color(colors[color][1]);
  const currentColor = targetColor.clone();
  const rainHighlight = new THREE.Color(0xfff3e6);

  function emit(type, detail) {
    controls.dispatchEvent(new CustomEvent('mistlo:' + type, { bubbles: true, composed: true, detail }));
  }

  function updateAudio() {
    audio?.setVolume(playing && visible && !document.hidden ? modes[mode].volume : 0);
  }

  function setColor(next, source) {
    if (source) selectedColor = next;
    color = next;
    targetColor.set(colors[next][1]);
    for (const [key, button] of chipColors) button.setAttribute('aria-pressed', String(key === next));
    if (source) emit('color', { color: next, name: colors[next][0], hex: colors[next][1], source });
    wake();
  }

  function setMode(next, source) {
    if (source) selectedMode = next;
    mode = next;
    for (const [key, button] of chipModes) button.setAttribute('aria-pressed', String(key === next));
    if (source) emit('mode', { mode: next });
    updateAudio();
    wake();
  }

  function addChip(group, label, title, action) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.title = title;
    button.setAttribute('aria-label', title);
    button.addEventListener('click', () => {
      controls.classList.add('has-played');
      action();
    });
    controls.querySelector(group).append(button);
    return button;
  }
  for (const [key, [name, hex]] of Object.entries(colors)) {
    const button = addChip('.mistlo-glows', '', name, () => setColor(key, 'manual'));
    button.style.setProperty('--chip', hex);
    chipColors.set(key, button);
  }
  for (const [key, { label }] of Object.entries(modes)) {
    chipModes.set(key, addChip('.mistlo-rain', label, label, () => setMode(key, true)));
  }

  sound.addEventListener('click', async () => {
    if (sound.disabled) return;
    sound.disabled = true;
    try {
      audio ??= createAudio(canPlayAudio);
      if (!playing) await audio.context.resume();
      playing = !playing;
      sound.setAttribute('aria-pressed', String(playing));
      controls.classList.add('has-played');
      updateAudio();
      emit('sound', { enabled: playing });
    } catch {
      sound.textContent = 'Sound unavailable';
      sound.hidden = true;
    } finally {
      sound.disabled = false;
    }
  });

  function resize() {
    const { clientWidth: width, clientHeight: height } = frame;
    const aspect = width / height;
    const halfHeight = compact.matches ? Math.max(2.8, 2.03 / aspect) : Math.max(2.4, 2.65 / aspect);
    camera.left = -halfHeight * aspect;
    camera.right = halfHeight * aspect;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    renderer.setSize(width, height, false);
    wake();
  }

  function updateChapter() {
    const center = window.innerHeight * .56;
    const active = reduced.matches ? null : chapters.find(section => {
      const bounds = section.getBoundingClientRect();
      return bounds.top < center && bounds.bottom >= center;
    });
    const next = active?.dataset.scene ?? '';
    if (next === chapter) return;
    chapter = next;
    if (next) frame.dataset.chapter = next;
    else delete frame.dataset.chapter;
    setColor(presets[next]?.color ?? selectedColor);
    setMode(presets[next]?.mode ?? selectedMode);
    wake();
  }

  function cycleColor() {
    const keys = [...chipColors.keys()];
    setColor(keys[(keys.indexOf(color) + 1) % keys.length], 'cloud');
    if (!reduced.matches) bounce = .58;
    if (playing) audio?.plink(1.5);
    wake();
  }

  canvas.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, lastY: event.clientY, moved: false };
    velocity = 0;
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', event => {
    if (drag?.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.moved && (Math.abs(dx) > 5 || (event.pointerType === 'mouse' && Math.abs(dy) > 5))) {
      if (event.pointerType !== 'mouse' && Math.abs(dy) > Math.abs(dx)) return;
      drag.moved = true;
      controls.classList.add('has-played');
    }
    if (!drag.moved) return;
    const step = (event.clientX - drag.lastX) * .009;
    velocity = THREE.MathUtils.clamp(step, -.19, .19);
    spin += step;
    if (event.pointerType === 'mouse') {
      tilt = THREE.MathUtils.clamp(tilt + (event.clientY - drag.lastY) * .003, -.27, .27);
    }
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    wake();
  });

  const ray = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  canvas.addEventListener('pointerup', event => {
    if (drag?.id !== event.pointerId) return;
    const moved = drag.moved;
    drag = null;
    if (moved) return;
    const bounds = canvas.getBoundingClientRect();
    pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1);
    ray.setFromCamera(pointer, camera);
    if (!ray.intersectObject(lamp.cloud).length) return;
    controls.classList.add('has-played');
    if (performance.now() - lastTap < 330) {
      if (!reduced.matches) thunder = .6;
      lastTap = -Infinity;
      wake();
      return;
    }
    lastTap = performance.now();
    cycleColor();
  });
  canvas.addEventListener('pointercancel', () => { drag = null; velocity = 0; });
  canvas.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    controls.classList.add('has-played');
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') spin += event.key === 'ArrowLeft' ? -.24 : .24;
    else cycleColor();
    wake();
  });

  function render(time) {
    request = 0;
    const dt = lastTime ? Math.min((time - lastTime) / 1000, .04) : 1 / 60;
    lastTime = time;
    const still = reduced.matches;
    if (!still) elapsed += dt;
    const blend = still ? 1 : 1 - Math.exp(-5 * dt);
    const preset = still ? null : presets[chapter];
    separation = THREE.MathUtils.lerp(separation, preset?.separation ?? 0, blend);
    poseTurn = THREE.MathUtils.lerp(poseTurn, preset?.turn ?? 0, blend);
    if (!drag && !still) {
      spin += velocity * dt * 48;
      velocity *= Math.exp(-8 * dt);
    }
    camera.zoom = THREE.MathUtils.lerp(camera.zoom, compact.matches ? 1 : preset?.zoom ?? 1, blend);
    camera.updateProjectionMatrix();

    bounce = Math.max(0, bounce - dt);
    thunder = Math.max(0, thunder - dt);
    const stretch = still ? 0 : Math.sin(bounce * 21) * bounce * .13;
    const shake = still ? 0 : Math.sin(thunder * 126) * thunder * .10;
    const offset = compact.matches ? 0 : chapter ? 1.24 : -.06;
    lamp.product.position.x = THREE.MathUtils.lerp(lamp.product.position.x, offset, blend);
    camera.position.x = shake;
    const yOffset = compact.matches ? (chapter ? .96 : -.14) : -.17;
    lamp.product.position.y = THREE.MathUtils.lerp(lamp.product.position.y, yOffset - .22 * separation, blend);
    lamp.product.rotation.set(tilt, spin + poseTurn, 0);
    lamp.shell.position.y = 2.12 + separation * .81;
    lamp.shell.scale.set(1 - stretch * .6, 1 + stretch, 1 - stretch * .6);
    lamp.stem.position.set(separation * .34, separation * .18, 0);
    lamp.basin.position.y = separation * .63;
    lamp.reservoir.visible = separation > .15;
    lamp.reservoir.position.y = separation * .35;
    lamp.base.position.y = separation * -.13;
    lamp.rain.visible = separation < .25;
    lamp.glow.position.y = lamp.shell.position.y - .36;

    currentColor.lerp(targetColor, blend * (still ? 1 : 2.6));
    const flash = thunder > .12 && Math.sin(thunder * 60) > .18;
    lamp.shellGlow.copy(currentColor).multiplyScalar(flash ? 2.5 : 1);
    lamp.glow.color.copy(currentColor);
    lamp.glow.intensity = flash ? 31 : 5.2;
    lamp.reflected.color.copy(currentColor);
    lamp.glowMaterial.color.copy(currentColor).multiplyScalar(flash ? 2.8 : 1.3);
    lamp.spill.material.color.copy(currentColor);
    lamp.rainMaterial.color.copy(currentColor).lerp(rainHighlight, .34);

    const count = modes[mode].rate * 3;
    const speed = modes[mode].speed;
    lamp.lines.setDrawRange(0, count * 2);
    for (let index = 0; index < count; index++) {
      const drop = lamp.drops[index];
      const progress = (drop.phase + elapsed * drop.speed * speed) % 1;
      const y = 1.76 - progress * 1.36;
      const start = index * 6;
      lamp.vertices[start] = drop.x;
      lamp.vertices[start + 1] = y;
      lamp.vertices[start + 2] = drop.z;
      lamp.vertices[start + 3] = drop.x + .006;
      lamp.vertices[start + 4] = Math.min(1.78, y + drop.length);
      lamp.vertices[start + 5] = drop.z;
    }
    lamp.lines.attributes.position.needsUpdate = true;
    lamp.ripples.forEach((ring, index) => {
      const progress = (elapsed * 2.4 * speed + index / lamp.ripples.length) % 1;
      ring.scale.setScalar(.027 + progress * .205);
      ring.material.color.copy(currentColor);
      ring.material.opacity = (1 - progress) * .42;
    });
    lamp.mist.forEach((sprite, index) => {
      const progress = (elapsed * .23 + index / lamp.mist.length) % 1;
      sprite.position.set((index - 1.5) * .34, .49 + progress * .69, -.14);
      sprite.scale.set(.78 + progress * .64, .24 + progress * .41, 1);
      sprite.material.opacity = Math.sin(progress * Math.PI) * .105;
    });
    if (playing && Math.random() < dt * modes[mode].rate * .4) audio?.plink(random(.54, 1));
    renderer.render(scene, camera);
    if (!still) wake();
  }

  function wake() {
    if (!request && visible && !document.hidden) request = requestAnimationFrame(render);
  }

  function checkVisibility() {
    visible = viewport && !document.hidden;
    if (!visible) {
      cancelAnimationFrame(request);
      request = 0;
      lastTime = 0;
    }
    updateAudio();
    wake();
  }

  function motionPreference() {
    story.classList.toggle('mistlo-static', reduced.matches);
    if (reduced.matches) {
      velocity = 0;
      bounce = 0;
      thunder = 0;
    }
    updateChapter();
    resize();
  }

  function onContextLost(event) {
    event.preventDefault();
    story.classList.remove('mistlo-ready');
    controls.hidden = true;
    viewport = false;
    checkVisibility();
  }

  canvas.addEventListener('webglcontextlost', onContextLost);
  canvas.addEventListener('webglcontextrestored', () => {
    story.classList.add('mistlo-ready');
    controls.hidden = false;
    viewport = true;
    checkVisibility();
  });
  new ResizeObserver(resize).observe(frame);
  new IntersectionObserver(([entry]) => {
    viewport = entry.isIntersecting;
    checkVisibility();
  }).observe(frame);
  document.addEventListener('visibilitychange', checkVisibility);
  window.addEventListener('scroll', updateChapter, { passive: true });
  reduced.addEventListener('change', motionPreference);

  setColor(color);
  setMode(mode);
  motionPreference();
  render(performance.now());
  story.classList.add('mistlo-ready');
  controls.hidden = false;
}
