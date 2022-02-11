import { throttle } from "lodash";
import { ref } from "vue";
import { BREAKPOINTS } from "@/config/responsive.js";

const store = [];

const params = () => ({
  width: window.innerWidth,
  height: window.innerHeight
});

window.onresize = throttle(() => {
  store.forEach(({ ref: r, condition }) => (r.value = condition(params())));
}, 200);

function defineBreakpoints(breakpoints = {}) {
  const refs = {};

  Object.entries(breakpoints).map(([name, condition]) => {
    refs[name] = ref(condition(params()));
    store.push({ ref: refs[name], condition });
  });

  return refs;
}

const stdBreakpoints = defineBreakpoints({
  isXS: ({ width }) => width <= BREAKPOINTS.SM,
  isSM: ({ width }) => width <= BREAKPOINTS.MD,
  isMD: ({ width }) => width <= BREAKPOINTS.LG,
  isLG: ({ width }) => width <= BREAKPOINTS.XL,
  isXL: ({ width }) => width <= BREAKPOINTS.XXL,
  isXXL: () => true
});

function useStandardBreakpoints() {
  return stdBreakpoints;
}

function useCustomBreakpoints(breakpoints) {
  return defineBreakpoints(breakpoints);
}

export { useStandardBreakpoints, useCustomBreakpoints };
