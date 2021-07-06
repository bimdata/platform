/**
 * This responsive directive is largely inspired by:
 * https://github.com/Kelin2025/vue-responsive-components
 */

import { throttle } from "lodash";

export default {
  mounted(el, breakpoints) {
    const handler = throttle(([element]) => {
      for (const [className, condition] of Object.entries(breakpoints)) {
        if (condition(element.contentRect)) {
          element.classList.add(className);
        } else {
          element.classList.remove(className);
        }
      }
    }, 200);

    this.responsiveObserver = new ResizeObserver(handler);
    this.responsiveObserver.observe(el);
  },
  beforeUnmount() {
    this.responsiveObserver.disconnect();
  }
};
