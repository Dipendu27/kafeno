(function () {
  const root = document.documentElement;
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
    '.backend-card',
    '.backend-submit',
    '.backend-field input',
    '.backend-field select',
    '.backend-field textarea',
    'footer a[href="/reserve"]',
    'footer a[href="/takeaway"]',
    'footer a[aria-label="Social link"]',
  ].join(',');

  let frame = 0;
  let activeElement = null;

  const updateScrolledState = () => {
    document.body.dataset.glassScrolled = window.scrollY > 18 ? 'true' : 'false';
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

  document.addEventListener('pointermove', setPointerLight, { passive: true });
  document.addEventListener('pointerleave', clearActive, true);
  window.addEventListener('scroll', updateScrolledState, { passive: true });
  window.addEventListener('DOMContentLoaded', updateScrolledState);
  updateScrolledState();
})();
