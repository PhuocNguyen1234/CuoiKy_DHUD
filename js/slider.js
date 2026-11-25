/**
 * Carousel Slider for "My Global Journey"
 * Pure Vanilla JavaScript — index-based paging, 3 cards per click.
 * On desktop: card = 390px, gap = 73px → step = 463px × 3 = 1389px.
 * When fewer than 3 cards remain, the empty space is left visible (no loop/wrap).
 * No vertical scroll on the card container.
 */
window.initJourneySlider = function initJourneySlider() {
  const container = document.querySelector('.journey-slider-container');
  const track     = document.querySelector('.journey-slider-track');
  const btnPrev   = document.querySelector('.btn-prev');
  const btnNext   = document.querySelector('.btn-next');

  if (!container || !track || !btnPrev || !btnNext) return;

  // ── Constants ──────────────────────────────────────────────────────────────
  const CARDS_PER_PAGE = 3;
  const CARD_W_DESKTOP = 390;
  const GAP_DESKTOP    = 73;
  const CARD_W_MOBILE  = 300;
  const GAP_MOBILE     = 24;

  // ── State ──────────────────────────────────────────────────────────────────
  let currentPage = 0; // 0-based page index

  // ── Helpers ────────────────────────────────────────────────────────────────
  const cards = () => Array.from(track.querySelectorAll('.journey-card'));

  const isDesktop = () => window.innerWidth > 1024;

  const cardStep = () => isDesktop()
    ? CARD_W_DESKTOP + GAP_DESKTOP   // 463px
    : CARD_W_MOBILE  + GAP_MOBILE;   // 324px

  const pageStep = () => cardStep() * CARDS_PER_PAGE;

  const totalPages = () => Math.ceil(cards().length / CARDS_PER_PAGE);

  // ── Render ─────────────────────────────────────────────────────────────────
  const goToPage = (page) => {
    const maxPage = totalPages() - 1;
    currentPage = Math.max(0, Math.min(page, maxPage));

    const offset = currentPage * pageStep();
    // Use CSS transform on the track — no scrolling involved
    track.style.transform = `translateX(-${offset}px)`;
    track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

    updateButtons();
  };

  const updateButtons = () => {
    const atStart = currentPage === 0;
    const atEnd   = currentPage >= totalPages() - 1;

    btnPrev.style.opacity = atStart ? '0.5' : '1';
    btnPrev.style.cursor  = atStart ? 'default' : 'pointer';
    atStart ? btnPrev.setAttribute('disabled', 'true') : btnPrev.removeAttribute('disabled');

    btnNext.style.opacity = atEnd ? '0.5' : '1';
    btnNext.style.cursor  = atEnd ? 'default' : 'pointer';
    atEnd ? btnNext.setAttribute('disabled', 'true') : btnNext.removeAttribute('disabled');
  };

  // ── Button clicks ──────────────────────────────────────────────────────────
  btnPrev.addEventListener('click', () => goToPage(currentPage - 1));
  btnNext.addEventListener('click', () => goToPage(currentPage + 1));

  // ── Disable native scroll on the container ─────────────────────────────────
  // overflow is already hidden via CSS; keep it clean on resize too
  container.style.overflow = 'hidden';

  // ── Touch / drag swipe ──────────────────────────────────────────────────────
  let dragStartX    = null;
  let dragging      = false;
  const SWIPE_THRESHOLD = 60; // px

  container.addEventListener('mousedown', (e) => {
    dragStartX = e.pageX;
    dragging   = true;
    container.style.cursor = 'grabbing';
  });

  window.addEventListener('mouseup', (e) => {
    if (!dragging) return;
    dragging = false;
    container.style.cursor = 'grab';
    const delta = e.pageX - dragStartX;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      goToPage(delta < 0 ? currentPage + 1 : currentPage - 1);
    }
    dragStartX = null;
  });

  container.addEventListener('touchstart', (e) => {
    dragStartX = e.touches[0].pageX;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    if (dragStartX === null) return;
    const delta = e.changedTouches[0].pageX - dragStartX;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      goToPage(delta < 0 ? currentPage + 1 : currentPage - 1);
    }
    dragStartX = null;
  }, { passive: true });

  // ── Recalculate on resize (keep position, don't jump weirdly) ──────────────
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => goToPage(currentPage), 150);
  });

  // ── Init ───────────────────────────────────────────────────────────────────
  goToPage(0);
}
