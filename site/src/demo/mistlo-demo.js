const colors = {
  'warm-amber': ['Warm Amber', '#f3b467'],
  candle: ['Candle', '#ffcf8a'],
  'soft-white': ['Soft White', '#f4efe6'],
  'dusk-rose': ['Dusk Rose', '#e9a3a8'],
  lavender: ['Lavender', '#b8a6e6'],
  'sea-glass': ['Sea Glass', '#8fd1c0'],
  'midnight-blue': ['Midnight Blue', '#5f7fd6'],
};
const modes = {
  drizzle: { label: 'Drizzle', rate: 6, speed: 0.85, volume: 0.12 },
  steady: { label: 'Steady', rate: 13, speed: 1, volume: 0.19 },
  pour: { label: 'Pour', rate: 23, speed: 1.18, volume: 0.26 },
};
const levels = { low: 'Low', medium: 'Mid', high: 'High' };
const defaultImage = new URL('../assets/photos/glow-studio.jpg', import.meta.url).href;
const mounted = new WeakMap();
const colorKeys = Object.keys(colors);
// Pixel coordinates in the 1600 × 1600 source photo. Each outlet maps into the basin ellipse.
const outlets = [[649, 706], [692, 708], [741, 709], [797, 711], [850, 713], [898, 714], [940, 715]];
const random = (min, max) => min + Math.random() * (max - min);
let nextId = 0;

function radioGroup(id, name, label, selected, entries, render) {
  return `<fieldset class="md-field">
    <legend>${label}</legend>
    <div class="md-options md-${name}">
      ${entries.map(([key, value]) => `<label>
        <input type="radio" name="${name}-${id}" value="${key}" ${key === selected ? 'checked' : ''}>
        ${render(value)}
      </label>`).join('')}
    </div>
  </fieldset>`;
}

function createAudio(AudioContext) {
  const context = new AudioContext();
  const output = context.createGain();
  output.gain.value = 0;
  output.connect(context.destination);

  const length = context.sampleRate * 3;
  const noise = context.createBuffer(1, length, context.sampleRate);
  const samples = noise.getChannelData(0);
  for (let index = 0; index < length; index++) samples[index] = random(-1, 1);

  const bed = context.createBufferSource();
  bed.buffer = noise;
  bed.loop = true;
  const low = context.createBiquadFilter();
  low.type = 'lowpass';
  low.frequency.value = 1450;
  const high = context.createBiquadFilter();
  high.type = 'highpass';
  high.frequency.value = 190;
  bed.connect(low).connect(high).connect(output);
  bed.start();

  let nextPlink = 0;

  return {
    context,
    setVolume(volume) {
      output.gain.setTargetAtTime(volume, context.currentTime, 0.035);
    },
    plink(strength) {
      const now = context.currentTime;
      if (context.state !== 'running' || now < nextPlink) return;
      nextPlink = now + random(0.07, 0.14);
      const chirp = context.createOscillator();
      const envelope = context.createGain();
      const pitch = random(760, 1520);
      chirp.frequency.setValueAtTime(pitch * 1.24, now);
      chirp.frequency.exponentialRampToValueAtTime(pitch, now + 0.055);
      envelope.gain.setValueAtTime(0.001, now);
      envelope.gain.linearRampToValueAtTime(0.026 * strength, now + 0.005);
      envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.086);
      chirp.connect(envelope).connect(output);
      chirp.onended = () => {
        chirp.disconnect();
        envelope.disconnect();
      };
      chirp.start(now);
      chirp.stop(now + 0.09);
    },
  };
}

function createMistSprite() {
  const sprite = document.createElement('canvas');
  sprite.width = 96;
  sprite.height = 96;
  const context = sprite.getContext('2d', { willReadFrequently: true });
  const gradient = context.createRadialGradient(48, 48, 0, 48, 48, 48);
  gradient.addColorStop(0, 'rgba(217, 231, 235, .42)');
  gradient.addColorStop(0.32, 'rgba(217, 231, 235, .29)');
  gradient.addColorStop(0.7, 'rgba(217, 231, 235, .08)');
  gradient.addColorStop(1, 'rgba(217, 231, 235, 0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 96, 96);
  return sprite;
}

/**
 * Mounts a demo in an empty host. Calling again for the same host returns its existing controller.
 */
export function mountMistloDemo(host, options = {}) {
  if (mounted.has(host)) return mounted.get(host);

  let mode = Object.hasOwn(modes, options.mode) ? options.mode : 'steady';
  let color = Object.hasOwn(colors, options.color) ? options.color : 'warm-amber';
  let brightness = Object.hasOwn(levels, options.brightness) ? options.brightness : 'medium';
  let cycling = options.cycle === true;
  let sound = false;
  let paused = false;
  const cycleInterval = Number.isFinite(options.cycleInterval) ? Math.max(2000, options.cycleInterval) : 8000;
  const canPlayAudio = window.AudioContext || window.webkitAudioContext;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.createElement('section');
  root.className = 'mistlo-demo';
  const id = ++nextId;
  root.setAttribute('aria-labelledby', `md-title-${id}`);
  root.innerHTML = `
    <div class="md-layout">
      <div class="md-scene">
        <img class="md-photo" alt="Ivory Mistlo humidifier with a cloud-shaped top and a round water basin" width="1600" height="1600" loading="eager" fetchpriority="high" decoding="async">
        <div class="md-backdrop" aria-hidden="true"></div>
        <div class="md-lights" aria-hidden="true">
          <div class="md-basin"></div>
          <div class="md-rim"></div>
          <div class="md-spill"></div>
        </div>
        <canvas class="md-canvas" aria-hidden="true"></canvas>
        <button type="button" class="md-cloud" aria-label="Make the cloud rain" title="Make the cloud rain"></button>
      </div>
      <div class="md-panel">
        <div class="md-header">
          <span class="md-product">Mistlo</span>
          <h2 id="md-title-${id}">Make it rain.</h2>
          <p>Tap the cloud for a burst of rain.</p>
        </div>
        ${radioGroup(id, 'mode', 'Rain speed', mode, Object.entries(modes), ({ label }) => `<span>${label}</span>`)}
        <div class="md-color-controls">
          ${radioGroup(id, 'color', 'Light color', color, Object.entries(colors), ([label, hex]) => `<span class="md-swatch" style="--md-swatch:${hex}"></span><span class="md-sr">${label}</span>`)}
          <div class="md-color-footer">
            <span class="md-color-name" aria-hidden="true"></span>
            <button class="md-toggle md-cycle" type="button" aria-pressed="false"><span>Slow cycle</span><span class="md-switch" aria-hidden="true"></span></button>
          </div>
        </div>
        ${radioGroup(id, 'brightness', 'Brightness', brightness, Object.entries(levels), label => `<span>${label}</span>`)}
        <div class="md-sound-row">
          <button class="md-toggle md-sound" type="button" aria-pressed="false"><span>Rain sound</span><span class="md-sound-state" aria-hidden="true">Off</span><span class="md-switch" aria-hidden="true"></span></button>
          <button type="button" class="md-toggle md-pause">Pause animation</button>
          <span class="md-sr md-audio-status" role="status"></span>
        </div>
      </div>
    </div>`;

  const photo = root.querySelector('.md-photo');
  const scene = root.querySelector('.md-scene');
  const canvas = root.querySelector('.md-canvas');
  let context;
  let canvasScale = 0;
  let mistSprite;
  const cloud = root.querySelector('.md-cloud');
  const pauseButton = root.querySelector('.md-pause');
  const cycleButton = root.querySelector('.md-cycle');
  const soundButton = root.querySelector('.md-sound');
  const audioStatus = root.querySelector('.md-audio-status');
  const colorName = root.querySelector('.md-color-name');
  const colorInputs = Array.from(root.querySelectorAll('.md-color input'));
  const listeners = new AbortController();
  const { signal } = listeners;
  const drops = [];
  const ripples = [];
  const mist = [];
  let audio;
  let suspendTimer;
  let cycleTimer;
  let frame = 0;
  let paintTime = 0;
  let tickTime = 0;
  let lastRendered = 0;
  let elapsed = 0;
  let dropBudget = 0;
  let mistBudget = 0;
  let burst = 0;
  let burstWait = 0;
  let drift = 0;
  let pointerDrift = 0;
  let slowFrames = 0;
  let economical = Boolean(navigator.deviceMemory && navigator.deviceMemory < 4);
  let visible = !window.IntersectionObserver;
  let active = false;
  let firstView = true;
  let photoReady = false;
  let destroyed = false;
  const useIntro = options.intro !== false && !reducedMotion.matches;
  if (useIntro) scene.dataset.intro = 'waiting';

  function emit(type, detail) {
    root.dispatchEvent(new CustomEvent(`mistlo:${type}`, { bubbles: true, composed: true, detail }));
  }

  function setColor(value, source) {
    color = value;
    const [name, hex] = colors[color];
    root.style.setProperty('--md-light', hex);
    colorName.textContent = name;
    colorInputs.find(input => input.value === color).checked = true;
    if (source) emit('color', { color, name, hex, source });
  }

  function scheduleCycle() {
    clearTimeout(cycleTimer);
    if (!cycling || !active || paused || reducedMotion.matches) return;
    cycleTimer = setTimeout(() => {
      const next = (colorKeys.indexOf(color) + 1) % colorKeys.length;
      setColor(colorKeys[next], 'cycle');
      scheduleCycle();
    }, cycleInterval);
  }

  function setCycle(enabled) {
    cycling = enabled;
    cycleButton.setAttribute('aria-pressed', String(enabled));
    scheduleCycle();
  }

  function updateSoundButton() {
    soundButton.setAttribute('aria-pressed', String(sound));
    soundButton.querySelector('.md-sound-state').textContent = sound ? 'On' : 'Off';
  }

  async function syncAudio() {
    clearTimeout(suspendTimer);
    if (!audio || destroyed) return;

    if (!sound || !active) {
      audio.setVolume(0);
      suspendTimer = setTimeout(() => {
        if (!destroyed && (!sound || !active)) audio.context.suspend().catch(() => {});
      }, 170);
      return;
    }

    try {
      await audio.context.resume();
    } catch {
      if (!destroyed && sound) {
        sound = false;
        updateSoundButton();
        audioStatus.textContent = 'Rain sound is unavailable.';
        emit('sound', { enabled: false });
      }
      return;
    }
    if (!destroyed && sound && active) audio.setVolume(modes[mode].volume);
  }

  function resize(size = scene.clientWidth) {
    if (!size) return;
    const scale = Math.min(window.devicePixelRatio || 1, economical ? 1.25 : 2, (economical ? 768 : 1280) / size);
    const pixels = Math.max(1, Math.round(size * scale));
    const changed = canvas.width !== pixels || canvas.height !== pixels;
    if (changed) {
      canvas.width = canvas.height = pixels;
      canvasScale = 0;
    }
    if (!context) {
      context = canvas.getContext('2d');
      updateMotion();
    }
  }

  function addDrop() {
    if (drops.length >= 54) return;
    const [outlet, top] = outlets[Math.floor(random(0, outlets.length))];
    const x = outlet + random(-7, 7);
    const floor = 1128 - 46 * ((x - 798) / 300) ** 2 + random(-18, 22);
    drops.push({ x, top, y: top, floor, speed: random(70, 155), width: random(2.1, 3.9) });
  }

  function paint(dt, settings) {
    if (!canvasScale) {
      if (!drops.length && !mist.length && !ripples.length) return;
      canvasScale = canvas.width / 1600;
      context.setTransform(canvasScale, 0, 0, canvasScale, 0, 0);
    }
    context.clearRect(0, 0, 1600, 1600);

    if (mist.length && !mistSprite) mistSprite = createMistSprite();
    drift += (pointerDrift - drift) * Math.min(1, dt * 2);
    for (let index = mist.length - 1; index >= 0; index--) {
      const puff = mist[index];
      puff.age += dt;
      const life = puff.age / puff.duration;
      if (life >= 1) {
        mist.splice(index, 1);
        continue;
      }
      puff.x += (puff.drift + drift * life) * dt;
      const width = puff.width * (1 + life * 2.6);
      const height = width * 0.54;
      const y = 276 - puff.age * puff.rise;
      context.globalAlpha = Math.sin(Math.PI * life) * puff.opacity;
      context.drawImage(mistSprite, puff.x - width / 2, y - height * 0.8, width, height);
    }
    context.globalAlpha = 1;

    for (let index = drops.length - 1; index >= 0; index--) {
      const drop = drops[index];
      drop.speed += 2400 * dt;
      drop.y += drop.speed * settings.speed * dt;
      if (drop.y >= drop.floor) {
        if (ripples.length < 30) ripples.push({ x: drop.x, y: drop.floor, age: 0, width: drop.width });
        drops.splice(index, 1);
        if (sound && Math.random() < 0.7) audio?.plink(drop.width / 3.9);
      }
    }

    context.lineCap = 'round';
    context.strokeStyle = 'rgba(198, 218, 230, .25)';
    context.beginPath();
    for (const drop of drops) {
      context.moveTo(drop.x, Math.max(drop.top, drop.y - Math.min(42, drop.speed * 0.029)));
      context.lineTo(drop.x, drop.y - 0.4);
    }
    context.lineWidth = 2.5;
    context.stroke();

    context.fillStyle = 'rgba(235, 245, 252, .81)';
    context.beginPath();
    for (const drop of drops) {
      const length = 3 + drop.speed * 0.005;
      context.moveTo(drop.x + drop.width, drop.y - length / 2);
      context.ellipse(drop.x, drop.y - length / 2, drop.width, length / 2, 0, 0, Math.PI * 2);
    }
    context.fill();

    context.strokeStyle = '#f2f6fa';
    context.fillStyle = '#f2f6fa';
    context.lineWidth = 2.4;
    for (let index = ripples.length - 1; index >= 0; index--) {
      const ripple = ripples[index];
      ripple.age += dt;
      const progress = ripple.age / 0.6;
      if (progress >= 1) {
        ripples.splice(index, 1);
        continue;
      }
      const radius = 3 + 46 * progress;
      context.globalAlpha = (1 - progress) ** 2 * 0.72;
      context.beginPath();
      context.ellipse(ripple.x, ripple.y, radius, radius * 0.27, 0, 0, Math.PI * 2);
      context.stroke();
      if (progress < 0.24) {
        const splash = progress / 0.24;
        for (const direction of [-1, 1]) {
          const x = ripple.x + direction * (3 + 18 * splash);
          const y = ripple.y - 15 * Math.sin(Math.PI * splash);
          context.fillRect(x, y, ripple.width * 0.6, 3);
        }
      }
    }
    context.globalAlpha = 1;
  }

  function animate(now) {
    frame = requestAnimationFrame(animate);
    if (tickTime && !economical) {
      slowFrames = now - tickTime > 24 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
      if (slowFrames >= 18) {
        economical = true;
        resize();
      }
    }
    tickTime = now;
    const interval = 1000 / (economical ? 30 : 60);
    const delta = now - paintTime;
    if (paintTime && delta < interval - 0.2) return;
    // Keep pace on high-refresh displays without slowly drifting out of phase.
    paintTime = paintTime && delta < 80 ? Math.min(now, paintTime + interval) : now;
    const dt = lastRendered ? Math.min((now - lastRendered) / 1000, 0.05) : 0;
    lastRendered = now;
    elapsed += dt;
    const settings = modes[mode];
    const ramp = useIntro ? Math.min(1, elapsed / 1.5) : 1;
    dropBudget += dt * settings.rate * ramp * random(0.8, 1.2);
    while (dropBudget >= 1) {
      addDrop();
      dropBudget--;
    }

    if (burst) {
      burstWait -= dt;
      if (burstWait <= 0) {
        addDrop();
        addDrop();
        burst -= 2;
        burstWait = random(0.035, 0.065);
      }
    }

    mistBudget += dt * (economical ? 5 : 9);
    if (mistBudget >= 1) {
      mistBudget--;
      mist.push({
        x: random(777, 854), age: 0, duration: random(1.35, 2.5),
        width: random(73, 132), rise: random(47, 89), drift: random(-22, 27),
        opacity: random(0.08, 0.18) * ramp,
      });
    }
    paint(dt, settings);
  }

  function updateMotion() {
    const still = paused || reducedMotion.matches;
    root.toggleAttribute('data-motion-paused', still);
    cycleButton.disabled = still;
    pauseButton.hidden = reducedMotion.matches;
    cloud.disabled = still || !context || !photoReady;
    root.querySelector('.md-header p').hidden = cloud.disabled;
    if (still) {
      scene.removeAttribute('data-intro');
      drops.length = ripples.length = mist.length = 0;
      burst = 0;
      if (canvasScale) context.clearRect(0, 0, 1600, 1600);
    }
    if (firstView && active && photoReady) {
      firstView = false;
      if (scene.dataset.intro === 'waiting') scene.dataset.intro = 'playing';
    }
    const run = active && photoReady && !still && context;
    if (run && !frame) {
      tickTime = paintTime = lastRendered = 0;
      frame = requestAnimationFrame(animate);
    } else if (!run && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }

  function updateVisibility() {
    const next = visible && !document.hidden;
    if (active === next) return;
    active = next;
    updateMotion();
    scheduleCycle();
    void syncAudio();
  }

  root.addEventListener('change', ({ target }) => {
    if (target.name === `mode-${id}`) {
      mode = target.value;
      if (sound && active) audio?.setVolume(modes[mode].volume);
      emit('mode', { mode });
    } else if (target.name === `color-${id}`) {
      setCycle(false);
      setColor(target.value, 'manual');
    } else if (target.name === `brightness-${id}`) {
      brightness = target.value;
      root.dataset.brightness = brightness;
    }
  }, { signal });

  root.addEventListener('click', ({ target }) => {
    if (cycling && target.name === `color-${id}` && target.value === color) setCycle(false);
  }, { signal });

  pauseButton.addEventListener('click', () => {
    paused = !paused;
    pauseButton.textContent = paused ? 'Resume animation' : 'Pause animation';
    updateMotion();
    scheduleCycle();
  }, { signal });
  cycleButton.addEventListener('click', () => setCycle(!cycling), { signal });
  soundButton.disabled = !canPlayAudio;
  if (!canPlayAudio) soundButton.querySelector('.md-sound-state').textContent = 'Unavailable';
  soundButton.addEventListener('click', () => {
    if (!audio) {
      try {
        audio = createAudio(canPlayAudio);
      } catch {
        audioStatus.textContent = 'Rain sound is unavailable.';
        return;
      }
    }
    sound = !sound;
    updateSoundButton();
    audioStatus.textContent = '';
    emit('sound', { enabled: sound });
    void syncAudio();
  }, { signal });

  cloud.addEventListener('click', () => {
    burst = 14;
    burstWait = 0;
  }, { signal });
  scene.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || reducedMotion.matches) return;
    const bounds = scene.getBoundingClientRect();
    pointerDrift = ((event.clientX - bounds.left) / bounds.width - 0.5) * 120;
  }, { signal, passive: true });
  scene.addEventListener('pointerleave', () => { pointerDrift = 0; }, { signal });
  reducedMotion.addEventListener('change', () => {
    updateMotion();
    scheduleCycle();
  }, { signal });
  photo.addEventListener('load', () => {
    photoReady = true;
    updateMotion();
  }, { once: true, signal });
  photo.src = options.imageUrl ?? defaultImage;
  document.addEventListener('visibilitychange', updateVisibility, { signal });
  window.addEventListener('resize', () => resize(), { signal });

  root.dataset.brightness = brightness;
  setColor(color);
  setCycle(cycling);
  host.append(root);
  updateMotion();
  updateVisibility();

  const sizeObserver = window.ResizeObserver && new ResizeObserver(([entry]) => resize(entry.contentRect.width));
  if (sizeObserver) sizeObserver.observe(scene);
  else resize();
  const visibilityObserver = window.IntersectionObserver && new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    updateVisibility();
  });
  visibilityObserver?.observe(scene);

  const controller = {
    destroy() {
      if (destroyed) return;
      destroyed = true;
      listeners.abort();
      sizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      clearTimeout(cycleTimer);
      clearTimeout(suspendTimer);
      cancelAnimationFrame(frame);
      audio?.context.close().catch(() => {});
      root.remove();
      mounted.delete(host);
    },
  };

  mounted.set(host, controller);
  return controller;
}

export function mountAllMistloDemos(scope = document, options) {
  return Array.from(scope.querySelectorAll('[data-mistlo-demo]'), host => mountMistloDemo(host, options));
}
