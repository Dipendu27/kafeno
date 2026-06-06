(function () {
  const homePath = '/';
  const sectionHashes = new Set(['#about', '#menu', '#why', '#gallery', '#reviews', '#visit']);
  const pendingHashKey = 'kafenoPendingHash';
  const nativeScrollTo = window.scrollTo.bind(window);
  let suppressTopResetUntil = 0;
  let scrollLockTimer = null;
  let previousBodyMinHeight = '';

  const samePath = (a, b) => {
    const clean = (path) => path.replace(/\/+$/, '') || '/';
    return clean(a) === clean(b);
  };

  const isTopReset = (args) => {
    const [first, second] = args;
    if (typeof first === 'object' && first !== null) {
      return Number(first.top || 0) === 0 && Number(first.left || 0) === 0;
    }

    return Number(first || 0) === 0 && Number(second || 0) === 0;
  };

  window.scrollTo = (...args) => {
    if (Date.now() < suppressTopResetUntil && isTopReset(args)) return;
    nativeScrollTo(...args);
  };

  const suppressTopReset = () => {
    suppressTopResetUntil = Date.now() + 1800;
  };

  const lockScrollHeight = () => {
    if (scrollLockTimer) {
      window.clearTimeout(scrollLockTimer);
      scrollLockTimer = null;
    }

    previousBodyMinHeight = document.body.style.minHeight;
    const minHeight = Math.max(document.body.scrollHeight, window.scrollY + window.innerHeight + 240);
    document.body.style.minHeight = `${Math.ceil(minHeight)}px`;
  };

  const unlockScrollHeight = () => {
    if (scrollLockTimer) {
      window.clearTimeout(scrollLockTimer);
      scrollLockTimer = null;
    }

    document.body.style.minHeight = previousBodyMinHeight;
  };

  const scheduleScrollUnlock = () => {
    if (scrollLockTimer) window.clearTimeout(scrollLockTimer);
    scrollLockTimer = window.setTimeout(unlockScrollHeight, 1500);
  };

  const getHeaderOffset = () => {
    const header = document.querySelector('header');
    if (!header) return window.innerWidth < 768 ? 84 : 96;
    return Math.ceil(header.getBoundingClientRect().height + 14);
  };

  const getTargetTop = (target) => {
    if (target.id === 'hero') return 0;
    const pageTop = target.getBoundingClientRect().top + window.scrollY;
    return Math.max(0, pageTop - getHeaderOffset());
  };

  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const animateTo = (targetY) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nativeScrollTo(0, targetY);
      return;
    }

    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = Math.min(1200, Math.max(650, Math.abs(distance) * 0.55));
    let startTime = null;

    const step = (time) => {
      if (startTime === null) startTime = time;
      const progress = Math.min(1, (time - startTime) / duration);
      nativeScrollTo(0, startY + distance * easeInOutCubic(progress));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  const findTarget = (hash) => {
    if (!hash || hash === '#') return null;
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  };

  const scrollToHash = (hash) => {
    const target = findTarget(hash);
    if (!target) return false;

    animateTo(getTargetTop(target));
    return true;
  };

  const waitForHash = (hash, attemptsLeft) => {
    if (scrollToHash(hash)) {
      sessionStorage.removeItem(pendingHashKey);
      scheduleScrollUnlock();
      return;
    }

    if (attemptsLeft <= 0) {
      scheduleScrollUnlock();
      return;
    }

    window.setTimeout(() => waitForHash(hash, attemptsLeft - 1), 80);
  };

  document.addEventListener(
    'click',
    (event) => {
      const link = event.target.closest && event.target.closest('a[href]');
      if (!link) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || !sectionHashes.has(url.hash)) return;

      const isHomeTarget = samePath(url.pathname, homePath);
      const isSamePageTarget = samePath(url.pathname, window.location.pathname);
      if (!isHomeTarget && !isSamePageTarget) return;

      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === 'function') {
        event.stopImmediatePropagation();
      }

      suppressTopReset();

      if (isSamePageTarget && scrollToHash(url.hash)) return;

      sessionStorage.setItem(pendingHashKey, url.hash);
      lockScrollHeight();
      history.pushState(null, '', `${homePath}${url.hash}`);
      const routeEvent =
        typeof PopStateEvent === 'function' ? new PopStateEvent('popstate') : new Event('popstate');
      window.dispatchEvent(routeEvent);
      waitForHash(url.hash, 25);
    },
    true,
  );

  window.addEventListener('DOMContentLoaded', () => {
    const pendingHash = sessionStorage.getItem(pendingHashKey);
    if (pendingHash) {
      sessionStorage.removeItem(pendingHashKey);
      suppressTopReset();
      waitForHash(pendingHash, 25);
      return;
    }

    if (sectionHashes.has(window.location.hash)) {
      suppressTopReset();
      waitForHash(window.location.hash, 25);
    }
  });
})();
