/**
 * Responsive breakpoints in pixels.
 * These breakpoints comes from Bootstrap framework.
 * See https://getbootstrap.com/docs/5.0/layout/breakpoints/ for more info
 * (especially about the 0.02 subtraction).
 */
const BREAKPOINTS = Object.freeze({
  XS: 0,
  SM: 576 - 0.02,
  MD: 768 - 0.02,
  LG: 992 - 0.02,
  XL: 1200 - 0.02,
  XXL: 1400 - 0.02
});

export { BREAKPOINTS };
