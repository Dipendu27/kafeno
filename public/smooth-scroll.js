(function () {
  const homePath = '/';
  const sectionHashes = new Set(['#about', '#menu', '#why', '#gallery', '#reviews', '#visit']);
  const pendingHashKey = 'kafenoPendingHash';

  const samePath = (a, b) => {
    const clean = (path) => path.replace(/\/+$/, '') || '/';
    return clean(a) === clean(b);
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
      window.scrollTo(0, targetY);
      return;
    }

    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = Math.min(1200, Math.max(650, Math.abs(distance) * 0.55));
    let startTime = null;

    const step = (time) => {
      if (startTime === null) startTime = time;
      const progress = Math.min(1, (time - startTime) / duration);
      window.scrollTo(0, startY + distance * easeInOutCubic(progress));

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

  const scrollToHash = (hash, updateUrl) => {
    const target = findTarget(hash);
    if (!target) return false;

    if (updateUrl) {
      history.pushState(null, '', hash);
    }

    animateTo(getTargetTop(target));
    return true;
  };

  const waitForHash = (hash, attemptsLeft) => {
    if (scrollToHash(hash, false) || attemptsLeft <= 0) return;
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

      if (isSamePageTarget && scrollToHash(url.hash, true)) return;

      sessionStorage.setItem(pendingHashKey, url.hash);
      window.location.assign(`${homePath}${url.hash}`);
    },
    true,
  );

  window.addEventListener('DOMContentLoaded', () => {
    const pendingHash = sessionStorage.getItem(pendingHashKey);
    if (pendingHash) {
      sessionStorage.removeItem(pendingHashKey);
      waitForHash(pendingHash, 25);
      return;
    }

    if (sectionHashes.has(window.location.hash)) {
      waitForHash(window.location.hash, 25);
    }
  });
})();
