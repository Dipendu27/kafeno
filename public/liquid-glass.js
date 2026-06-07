(function () {
  const root = document.documentElement;
  const modeStorageKey = 'kafenoGlassMode';
  const glassTargets = [
    'header',
    'header a[href="/reserve"]',
    'main section a.rounded-full',
    'main section button.rounded-full',
    'article',
    'figure',
    '#why .group',
    '#gallery .group.relative',
    '#visit .relative.overflow-hidden',
    '.backend-form-copy',
    '.backend-back-link',
    '.backend-contact-strip',
    '.backend-card',
    '.backend-actions',
    '.backend-submit',
    '.backend-field',
    '.backend-field input',
    '.backend-field select',
    '.backend-field textarea',
    '.backend-help',
    'footer a[href="/reserve"]',
    'footer a[href="/takeaway"]',
    'footer a[aria-label="Social link"]',
  ].join(',');

  let frame = 0;
  let activeElement = null;

  const updateScrolledState = () => {
    document.body.dataset.glassScrolled = window.scrollY > 18 ? 'true' : 'false';
  };

  const forceTintedMode = () => {
    document.body.dataset.glassMode = 'tinted';
    root.dataset.glassMode = 'tinted';

    try {
      window.localStorage.removeItem(modeStorageKey);
    } catch (_error) {
      // Storage can be unavailable in private or restricted browsing.
    }
  };

  const setPointerLight = (event) => {
    if (frame) return;

    frame = window.requestAnimationFrame(() => {
      frame = 0;

      const element = event.target.closest && event.target.closest(glassTargets);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100));
      const y = Math.min(100, Math.max(0, ((event.clientY - rect.top) / rect.height) * 100));

      if (activeElement && activeElement !== element) {
        activeElement.removeAttribute('data-glass-active');
      }

      activeElement = element;
      element.dataset.glassActive = 'true';
      element.style.setProperty('--glass-x', `${x.toFixed(2)}%`);
      element.style.setProperty('--glass-y', `${y.toFixed(2)}%`);
      root.style.setProperty('--page-glass-x', `${((event.clientX / window.innerWidth) * 100).toFixed(2)}%`);
      root.style.setProperty('--page-glass-y', `${((event.clientY / window.innerHeight) * 100).toFixed(2)}%`);
    });
  };

  const clearActive = () => {
    if (!activeElement) return;
    activeElement.removeAttribute('data-glass-active');
    activeElement = null;
  };

  const samePath = (path) => (path.replace(/\/+$/, '') || '/') === '/';

  const scrollHomeTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    if (location.hash) history.replaceState(null, '', '/');
  };

  const goHomeWithTransition = () => {
    document.body.dataset.homeTransition = 'out';
    window.setTimeout(() => {
      window.location.assign('/');
    }, 180);
  };

  const findBrandLink = () => {
    const links = Array.from(document.querySelectorAll('header a[href]'));
    return (
      links.find((link) => link.querySelector('img') && link.textContent.includes('Kafeno')) ||
      links.find((link) => link.getAttribute('href') === '#top') ||
      null
    );
  };

  const prepareBrandHomeLink = () => {
    const brandLink = findBrandLink();
    if (!brandLink || brandLink.dataset.homeLinkReady === 'true') return;

    brandLink.dataset.homeLinkReady = 'true';
    brandLink.setAttribute('href', '/');
    brandLink.setAttribute('aria-label', 'Go to Kafeno home');

    brandLink.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === 'function') {
        event.stopImmediatePropagation();
      }

      if (samePath(location.pathname)) {
        scrollHomeTop();
        return;
      }

      goHomeWithTransition();
    });
  };

  const observeHeader = () => {
    prepareBrandHomeLink();

    const observer = new MutationObserver(prepareBrandHomeLink);
    observer.observe(document.body, { childList: true, subtree: true });
  };

  document.addEventListener('pointermove', setPointerLight, { passive: true });
  document.addEventListener('pointerleave', clearActive, true);
  window.addEventListener('scroll', updateScrolledState, { passive: true });
  window.addEventListener('DOMContentLoaded', () => {
    forceTintedMode();
    observeHeader();
    updateScrolledState();
  });

  forceTintedMode();
  updateScrolledState();
})();
