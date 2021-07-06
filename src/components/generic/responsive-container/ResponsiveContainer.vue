<template>
  <div class="responsive-container" ref="container">
    <slot :el="el" />
  </div>
</template>

<script>
import { throttle } from "lodash";
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";

export default {
  props: {
    breakpoints: {
      type: Object,
      default: () => {}
    }
  },
  setup(props) {
    const container = ref(null);

    const el = reactive({
      width: 0,
      height: 0,
      is: {}
    });

    let responsiveObserver;
    onMounted(() => {
      const handler = throttle(([element]) => {
        el.width = element.contentRect.width;
        el.height = element.contentRect.height;
        el.is = Object.entries(props.breakpoints).reduce(
          (obj, [breakpoint, condition]) => ({
            ...obj,
            [breakpoint]: condition(el)
          }),
          {}
        );
      }, 200);

      responsiveObserver = new ResizeObserver(handler);
      responsiveObserver.observe(container.value);
    });

    onBeforeUnmount(() => {
      responsiveObserver.disconnect();
    });

    return {
      container,
      el
    };
  }
};
</script>
