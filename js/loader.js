/* loader.js — Page loader & entry animation */
(function() {
  const loader = document.getElementById('page-loader');
  const count  = document.getElementById('loader-count');
  if (!loader) return;

  let n = 0;
  const target = 100;
  const start = performance.now();
  const duration = 1800;

  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    // Ease out cubic
    const ease = 1 - Math.pow(1 - t, 3);
    n = Math.floor(ease * target);
    if (count) count.textContent = n + '%';
    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      setTimeout(() => {
        loader.classList.add('loaded');
        document.body.style.overflow = '';
      }, 200);
    }
  }

  // Prevent scroll during load
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(tick);
})();
