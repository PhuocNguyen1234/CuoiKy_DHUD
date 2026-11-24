/**
 * Main Application Entry Point
 */
import { initJourneySlider } from './slider.js';
import { initAnimations } from './animations.js';

document.addEventListener('DOMContentLoaded', () => {
  initJourneySlider();
  initAnimations();
});
