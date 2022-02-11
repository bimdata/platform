import { throttle } from "lodash";
import { ref } from "vue";

const store = [];

const params = () => ({
  width: window.innerWidth,
  height: window.innerHeight
});

window.onresize = throttle(() => {
  store.forEach(({ ref: r, condition }) => (r.value = condition(params())));
}, 200);

export function useResponsive(breakpoints) {
  const refs = {};

  Object.entries(breakpoints).map(([name, condition]) => {
    refs[name] = ref(condition(params()));
    store.push({ ref: refs[name], condition });
  });

  return refs;
}
