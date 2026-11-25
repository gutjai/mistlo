'use strict';

const { page, root, goat } = document.body.dataset;
const canonical = new URL(document.querySelector('link[rel="canonical"]').href);
const revealUrl = new URL(root + 'gotcha/', location.origin);
const dialog = document.getElementById('reveal-dialog');
const direct = document.querySelector('[data-direct-reveal]');
const analyticsEnabled = Boolean(goat && location.origin === canonical.origin &&
  navigator.doNotTrack !== '1' && !navigator.globalPrivacyControl && !navigator.webdriver);

function count(path, event = false) {
  if (!analyticsEnabled) return;
  const params = new URLSearchParams({ p: path, rnd: String(Math.random()) });
  if (event) params.set('e', '1');
  else if (document.referrer) params.set('r', new URL(document.referrer).origin);
  fetch('https://' + goat + '.goatcounter.com/count?' + params, {
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
  }, 1000);
}

document.addEventListener('visibilitychange', scheduleCompletion);
if (direct) {
  direct.querySelector('[data-share]').hidden = false;
  scheduleCompletion();
}

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
    const controls = [...dialog.querySelectorAll('a[href], button, video[controls]')].filter(control => control.getClientRects().length);
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
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey ||
          typeof dialog.showModal !== 'function') return;
      event.preventDefault();
      if (dialog.open) return;
      opener = link;
      content.replaceChildren(template.content.cloneNode(true));
      content.querySelector('[data-share]').hidden = false;
      completed = false;
      dialog.showModal();
      closeButton.focus();
      scheduleCompletion();
    });
  }
}

async function share(button) {
  count('share-click', true);
  const copy = button.closest('.reveal-copy');
  const status = copy.querySelector('.share-status');
  const manual = copy.querySelector('.manual-share');
  // Share the storefront (not the reveal) so friends get the same surprise; ?ref=share shows up in GoatCounter.
  const shareUrl = new URL(root + '?ref=share', location.origin).href;
  const shareData = { title: document.title, text: button.dataset.shareText || '', url: shareUrl };
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
    status.textContent = 'Open the reveal link and copy it from the address bar.';
    manual.hidden = false;
    manual.querySelector('a').focus();
  }
}

document.addEventListener('click', event => {
  const button = event.target.closest('[data-share]');
  if (button) share(button);
  if (event.target.closest('[data-portfolio]')) count('portfolio-click', true);
});

// Glow picker: retint the studio photo and announce the color name.
const glowFigure = document.querySelector('.glow-figure');
const glowName = document.querySelector('[data-glow-name]');
document.addEventListener('change', event => {
  const input = event.target.closest('input[name="glow"]');
  if (!input || !glowFigure) return;
  glowFigure.style.setProperty('--glow', input.value);
  if (glowName) glowName.textContent = input.dataset.name;
});

// Sticky buy bar appears once the hero's own Buy button has scrolled away.
const sticky = document.querySelector('[data-sticky]');
const heroBuy = document.querySelector('.hero [data-buy]');
if (sticky && heroBuy && 'IntersectionObserver' in window) {
  sticky.classList.add('is-hidden');
  new IntersectionObserver(([entry]) => {
    sticky.classList.toggle('is-hidden', entry.isIntersecting || entry.boundingClientRect.top > 0);
  }).observe(heroBuy);
}
