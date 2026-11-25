/**
 * Interactive behaviors:
 * 1. Click on a "My Global Journey" card image -> smooth-scroll to the matching
 *    section in "Moments Around The World".
 * 2. Click on any image in "Moments Around The World" -> open enlarged lightbox popup.
 */
(function () {
  const DRAG_THRESHOLD_PX = 8;

  /**
   * Scroll smoothly to a target element while accounting for the sticky header.
   * @param {HTMLElement} targetEl
   */
  function scrollToMoment(targetEl) {
    const header = document.querySelector('.site-header');
    const headerOffset = header ? header.offsetHeight + 24 : 112;
    const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - headerOffset;

    // Ensure reveal animation is shown immediately
    targetEl.classList.add('is-revealed');

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth'
    });

    // Trigger subtle highlight pulse on the target moment image
    targetEl.classList.remove('is-highlighted');
    void targetEl.offsetWidth;
    targetEl.classList.add('is-highlighted');
  }

  /**
   * Initialize click/keyboard navigation from Journey card images to Moment rows.
   */
  function initJourneyToMomentLinks() {
    let hasPointerDown = false;
    let pointerDownX = 0;
    let pointerDownY = 0;

    document.addEventListener('pointerdown', (e) => {
      const cardWrap = e.target.closest('.journey-card__image-wrap[data-target]');
      if (!cardWrap) {
        hasPointerDown = false;
        return;
      }
      hasPointerDown = true;
      pointerDownX = e.clientX;
      pointerDownY = e.clientY;
    });

    document.addEventListener('click', (e) => {
      const cardWrap = e.target.closest('.journey-card__image-wrap[data-target]');
      if (!cardWrap) return;

      if (hasPointerDown) {
        const dx = Math.abs(e.clientX - pointerDownX);
        const dy = Math.abs(e.clientY - pointerDownY);
        hasPointerDown = false;
        if (dx > DRAG_THRESHOLD_PX || dy > DRAG_THRESHOLD_PX) return;
      }

      const targetId = cardWrap.getAttribute('data-target');
      if (!targetId) return;

      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        scrollToMoment(targetEl);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const cardWrap = e.target.closest('.journey-card__image-wrap[data-target]');
      if (!cardWrap) return;

      e.preventDefault();
      const targetId = cardWrap.getAttribute('data-target');
      const targetEl = targetId ? document.getElementById(targetId) : null;
      if (targetEl) {
        scrollToMoment(targetEl);
      }
    });
  }

  /**
   * Initialize lightbox popup for enlarging images in "Moments Around The World".
   */
  function initMomentsLightbox() {
    let lastFocusedTrigger = null;

    const getElements = () => ({
      lightbox: document.getElementById('image-lightbox'),
      lightboxImg: document.getElementById('lightbox-img'),
      lightboxCaption: document.getElementById('lightbox-caption')
    });

    const openLightbox = (trigger) => {
      const { lightbox, lightboxImg, lightboxCaption } = getElements();
      const img = trigger.querySelector('.moment-image');
      if (!lightbox || !lightboxImg || !lightboxCaption || !img) return;

      const row = trigger.closest('.moment-row');
      const titleEl = row ? row.querySelector('.moment-title') : null;
      const captionText = titleEl ? titleEl.textContent.trim() : (img.alt || '');

      lastFocusedTrigger = trigger;
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt || captionText;
      lightboxCaption.textContent = captionText;

      lightbox.hidden = false;
      requestAnimationFrame(() => {
        lightbox.classList.add('is-open');
      });

      document.body.style.overflow = 'hidden';

      const closeBtn = lightbox.querySelector('.image-lightbox__close');
      if (closeBtn) closeBtn.focus();
    };

    const closeLightbox = () => {
      const { lightbox, lightboxImg } = getElements();
      if (!lightbox || !lightbox.classList.contains('is-open')) return;

      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';

      const finishClose = () => {
        if (!lightbox.classList.contains('is-open') && !lightbox.hidden) {
          lightbox.hidden = true;
          if (lightboxImg) lightboxImg.src = '';
        }
      };

      const onTransitionEnd = () => {
        finishClose();
        lightbox.removeEventListener('transitionend', onTransitionEnd);
      };
      lightbox.addEventListener('transitionend', onTransitionEnd);
      setTimeout(finishClose, 300);

      if (lastFocusedTrigger) {
        lastFocusedTrigger.focus();
        lastFocusedTrigger = null;
      }
    };

    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-lightbox-close]')) {
        closeLightbox();
        return;
      }

      const trigger = e.target.closest('.moment-image-col');
      if (trigger) {
        openLightbox(trigger);
      }
    });

    document.addEventListener('keydown', (e) => {
      const { lightbox } = getElements();
      if (e.key === 'Escape' && lightbox && !lightbox.hidden) {
        closeLightbox();
        return;
      }

      if (e.key === 'Enter' || e.key === ' ') {
        const trigger = e.target.closest('.moment-image-col');
        if (trigger) {
          e.preventDefault();
          openLightbox(trigger);
        }
      }
    });
  }

  window.initInteractions = function initInteractions() {
    initJourneyToMomentLinks();
    initMomentsLightbox();
  };
})();
