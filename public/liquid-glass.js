(function () {
  const root = document.documentElement;
  const modeStorageKey = 'kafenoGlassMode';
  const modes = new Set(['clear', 'tinted']);
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
    '.glass-mode-switch',
    '.glass-mode-option',
  ].join(',');

  let frame = 0;
  let activeElement = null;
  let modeSwitch = null;

  const readMode = () => {
    try {
      const storedMode = window.localStorage.getItem(modeStorageKey);
      return modes.has(storedMode) ? storedMode : 'tinted';
    } catch (_error) {
      return 'tinted';
    }
  };

  const persistMode = (mode) => {
    try {
      window.localStorage.setItem(modeStorageKey, mode);
    } catch (_error) {
      // Storage can be unavailable in private or restricted browsing.
    }
  };

  const updateModeSwitch = (mode) => {
    if (!modeSwitch) return;

    for (const option of modeSwitch.querySelectorAll('.glass-mode-option')) {
      const isActive = option.dataset.glassModeOption === mode;
      option.setAttribute('aria-checked', String(isActive));
      option.dataset.active = String(isActive);
    }
  };

  const applyMode = (mode, shouldPersist) => {
    const nextMode = modes.has(mode) ? mode : 'tinted';
    document.body.dataset.glassMode = nextMode;
    root.dataset.glassMode = nextMode;
    updateModeSwitch(nextMode);

    if (shouldPersist) persistMode(nextMode);
  };

  const updateScrolledState = () => {
    document.body.dataset.glassScrolled = window.scrollY > 18 ? 'true' : 'false';
  };

  const createModeSwitch = () => {
    if (modeSwitch || document.querySelector('.glass-mode-switch')) return;

    modeSwitch = document.createElement('div');
    modeSwitch.className = 'glass-mode-switch';
    modeSwitch.setAttribute('role', 'radiogroup');
    modeSwitch.setAttribute('aria-label', 'Liquid glass appearance');

    for (const mode of ['clear', 'tinted']) {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'glass-mode-option';
      option.dataset.glassModeOption = mode;
      option.setAttribute('role', 'radio');
      option.textContent = mode === 'clear' ? 'Clear' : 'Tinted';
      option.addEventListener('click', () => applyMode(mode, true));
      modeSwitch.appendChild(option);
    }

    document.body.appendChild(modeSwitch);
    updateModeSwitch(document.body.dataset.glassMode || readMode());
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
  window.addEventListener('DOMContentLoaded', () => {
    applyMode(readMode(), false);
    createModeSwitch();
    updateScrolledState();
  });

  applyMode(readMode(), false);
  updateScrolledState();
})();
