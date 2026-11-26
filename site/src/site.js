'use strict';

const { page, root, goat } = document.body.dataset;
const canonical = new URL(document.querySelector('link[rel="canonical"]').href);
const dialog = document.getElementById('reveal-dialog');
const direct = document.querySelector('[data-direct-reveal]');
const goatOrigin = goat ? 'https://' + goat + '.goatcounter.com' : '';
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const campaignKey = root + 'campaign';
const query = new URLSearchParams(location.search);
const cleanCampaign = value => /^[a-z0-9-]{1,32}$/i.test(value ?? '') ? value.toLowerCase() : '';
let campaign = cleanCampaign(query.get('ref')) || cleanCampaign(query.get('utm_source'));
try {
  if (campaign) sessionStorage.setItem(campaignKey, campaign);
  else campaign = cleanCampaign(sessionStorage.getItem(campaignKey));
} catch {}

const analyticsEnabled = Boolean(goat && location.origin === canonical.origin &&
  navigator.doNotTrack !== '1' && !navigator.globalPrivacyControl && !navigator.webdriver);

function count(path, event = false) {
  if (!analyticsEnabled) return;
  const params = new URLSearchParams({ p: path, rnd: String(Math.random()) });
  if (event) params.set('e', '1');
  else if (document.referrer) params.set('r', new URL(document.referrer).origin);
  fetch(goatOrigin + '/count?' + params, {
    mode: 'no-cors', credentials: 'omit', referrerPolicy: 'no-referrer', keepalive: true
  }).catch(() => {});
}

if (analyticsEnabled) {
  count(root + page.slice(1));
  if (page === '/') count('product-view', true);
  const checkDepth = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max > 0 && window.scrollY / max >= .75 && !dialog?.open) {
      count('scroll-75', true);
      window.removeEventListener('scroll', checkDepth);
    }
  };
  window.addEventListener('scroll', checkDepth, { passive: true });
  checkDepth();
}

let opener;
let revealTimer;
let completed = false;

function scheduleCompletion() {
  clearTimeout(revealTimer);
  if (!analyticsEnabled || completed || document.hidden || (!dialog?.open && !direct)) return;
  revealTimer = setTimeout(() => {
    completed = true;
    count('reveal-complete', true);
    if (campaign) count('ref/' + campaign + '/reveal', true);
  }, 1000);
}

document.addEventListener('visibilitychange', scheduleCompletion);
if (direct) scheduleCompletion();

if (dialog) {
  const content = dialog.querySelector('.dialog-content');
  const template = dialog.querySelector('template');
  const closeButton = dialog.querySelector('[data-close]');

  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    if (dialog.open) return;
    clearTimeout(revealTimer);
    content.replaceChildren();
    opener?.focus({ preventScroll: true });
  });
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('a[href], button, video[controls]')].filter(control => !control.disabled && control.getClientRects().length);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  for (const link of document.querySelectorAll('[data-buy]')) {
    link.addEventListener('click', event => {
      count('buy-click/' + link.dataset.buy, true);
      if (campaign) count('ref/' + campaign + '/buy', true);
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey ||
          typeof dialog.showModal !== 'function') return;
      event.preventDefault();
      if (dialog.open) return;
      opener = link;
      content.replaceChildren(template.content.cloneNode(true));
      initParty(content);
      completed = false;
      dialog.showModal();
      closeButton.focus();
      scheduleCompletion();
    });
  }
}

async function share(button) {
  count('share-click', true);
  const copy = button.closest('.share-control');
  const status = copy.querySelector('.share-status');
  const manual = copy.querySelector('.manual-share');
  const shareUrl = manual.querySelector('a').href;
  const shareData = { title: 'Mistlo', text: button.dataset.shareText || '', url: shareUrl };
  manual.hidden = true;
  status.textContent = '';
  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }
  } catch (error) {
    if (error.name === 'AbortError') return;
  }
  try {
    await navigator.clipboard.writeText((shareData.text ? shareData.text + ' ' : '') + shareUrl);
    status.textContent = 'Link copied — send it to a friend.';
  } catch {
    status.textContent = 'Open the storefront and copy its link from the address bar.';
    manual.hidden = false;
    manual.querySelector('a').focus();
  }
}

const reactionKey = root + 'reaction';
let reaction = '';
try { reaction = localStorage.getItem(reactionKey) || ''; } catch {}

function renderReaction(scope) {
  for (const button of scope.querySelectorAll('[data-react]')) {
    button.disabled = false;
    button.setAttribute('aria-pressed', String(button.dataset.react === reaction));
    button.setAttribute('aria-disabled', String(Boolean(reaction)));
  }
  for (const status of scope.querySelectorAll('.reaction-status')) {
    status.textContent = reaction ? 'Reaction locked in!' : '';
  }
}

async function loadTotal(element) {
  try {
    const response = await fetch(goatOrigin + '/counter/' + encodeURIComponent(element.dataset.total) + '.json', {
      credentials: 'omit', referrerPolicy: 'no-referrer'
    });
    if (!response.ok) return;
    const { count } = await response.json();
    if (typeof count !== 'string' || !/^(?:[0-9]+|[0-9]{1,3}(?:,[0-9]{3})+)$/.test(count)) return;
    element.textContent = count;
    element.hidden = false;
    if (element.parentElement.matches('.party-counts p')) element.parentElement.hidden = false;
  } catch {}
}

function initParty(scope) {
  for (const button of scope.querySelectorAll('[data-share]')) button.hidden = false;
  renderReaction(scope);
  if (goatOrigin) {
    for (const element of scope.querySelectorAll('[data-total]')) void loadTotal(element);
  }
}

function celebrate(button) {
  if (motion.matches) return;
  button.animate([{ scale: '1' }, { scale: '1.13', offset: .38 }, { scale: '1' }], 360);
  const burst = document.createElement('span');
  burst.className = 'confetti';
  burst.setAttribute('aria-hidden', 'true');
  button.append(burst);
  for (let i = 0; i < 12; i++) {
    const piece = document.createElement('i');
    const angle = i * Math.PI / 6;
    piece.style.setProperty('--x', Math.round(Math.cos(angle) * 66) + 'px');
    piece.style.setProperty('--y', Math.round(Math.sin(angle) * 66) + 'px');
    piece.style.setProperty('--hue', String(i * 31));
    burst.append(piece);
  }
  setTimeout(() => burst.remove(), 700);
}

initParty(document);
window.addEventListener('storage', event => {
  if (event.key !== reactionKey) return;
  reaction = event.newValue || '';
  renderReaction(document);
});

document.addEventListener('click', event => {
  const button = event.target.closest('[data-share]');
  if (button) void share(button);
  if (event.target.closest('[data-portfolio]')) count('portfolio-click', true);
  const reactionButton = event.target.closest('[data-react]');
  if (!reactionButton || reaction) return;
  try { reaction = localStorage.getItem(reactionKey) || ''; } catch {}
  if (!reaction) {
    reaction = reactionButton.dataset.react;
    try { localStorage.setItem(reactionKey, reaction); } catch {}
    count('react/' + reaction, true);
    celebrate(reactionButton);
  }
  renderReaction(document);
});

// Sticky buy bar appears once the hero's own Buy button has scrolled away.
const sticky = document.querySelector('[data-sticky]');
const heroBuy = document.querySelector('.stage [data-buy]');
if (sticky && heroBuy && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    const hidden = entry.isIntersecting || entry.boundingClientRect.top > 0;
    if (hidden && sticky.contains(document.activeElement)) heroBuy.focus({ preventScroll: true });
    sticky.classList.toggle('is-hidden', hidden);
    sticky.inert = hidden;
    sticky.setAttribute('aria-hidden', String(hidden));
  }).observe(heroBuy);
}

// Live demo: mirror the visitor's choices in the buy bar and count deliberate interactions.
const demoState = { name: 'Warm Amber', hex: '#f3b467', mode: 'steady' };
const stickyState = document.querySelector('[data-sticky-state]');
const modeLabel = { drizzle: 'Drizzle', steady: 'Steady rain', pour: 'Pour' };
function renderDemoState() {
  if (stickyState) stickyState.textContent = demoState.name + ' · ' + modeLabel[demoState.mode];
  if (sticky) sticky.style.setProperty('--sticky-glow', demoState.hex);
}
const counted = new Set();
function countOnce(name) { if (!counted.has(name)) { counted.add(name); count(name, true); } }
document.addEventListener('mistlo:mode', event => { demoState.mode = event.detail.mode; renderDemoState(); countOnce('demo-mode'); });
document.addEventListener('mistlo:color', event => {
  demoState.name = event.detail.name; demoState.hex = event.detail.hex; renderDemoState();
  if (event.detail.source === 'manual') countOnce('demo-color');
});
document.addEventListener('mistlo:sound', event => { if (event.detail.enabled) countOnce('demo-sound'); });
