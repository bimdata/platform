<template>
  <BIMDataButton
    data-test-id="go-back-button"
    class="go-back-button"
    ghost
    radius
    @click="goBack"
  >
    <BIMDataIcon
      class="go-back-button__icon"
      name="arrow"
      size="xxs"
      margin="0 6px 0 0"
    />
    <span>
      {{ $t("GoBackButton.text") }}
    </span>
  </BIMDataButton>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import { useSession } from "../../../../composables/session.js";

export default {
  setup() {
    const router = useRouter();
    const { previousView } = useSession();

    const goBack = () => {
      const route = useRoute();
      const prev = previousView.get();
      const { back, backRoutes, backDefault } = route.meta;

      let target;

      if (back) {
        // If `route.meta.back` is defined
        // => go to `back`
        target = { name: back, params: route.params };
      }
      // ---
      else if (prev.name && (!backRoutes || backRoutes.includes(prev.name))) {
        // If a previous route exists and `route.meta.backRoutes` is not defined
        // or if previous route is included in `route.meta.backRoutes`
        // => go to previous route
        target = prev;
      }
      // ---
      else if (backDefault) {
        // If `route.meta.backDefault` is defined
        // => go to `backDefault`
        target = { name: backDefault, params: route.params };
      }

      if (target) {
        router.push(target);
      }
    };

    return {
      goBack
    };
  }
};
</script>

<style scoped lang="scss" src="./GoBackButton.scss"></style>
