/**
 * Main Application Entry Point
 */
(function () {
  function boot() {
    if (typeof window.initJourneySlider === 'function') {
      window.initJourneySlider();
    }
    if (typeof window.initAnimations === 'function') {
      window.initAnimations();
    }
    if (typeof window.initInteractions === 'function') {
      window.initInteractions();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
