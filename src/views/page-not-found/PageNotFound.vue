<template>
  <div class="view page-not-found">
    <div class="page-not-found__left">
      <div class="page-not-found__404">
        <h1>404</h1>
      </div>
      <div class="page-not-found__title">
        {{ $t("PageNotFound.title") }}
      </div>
      <div class="page-not-found__text">
        <div>{{ $t("PageNotFound.text.line1") }}</div>
        <div>{{ $t("PageNotFound.text.line2") }}</div>
      </div>
      <div class="page-not-found__action">
        <BIMDataButton
          width="150px"
          height="36px"
          color="primary"
          fill
          radius
          @click="goToDashboard"
        >
          {{ $t("PageNotFound.homeButtonText") }}
        </BIMDataButton>
      </div>
    </div>
    <div class="page-not-found__right">
      <div class="page-not-found__image">
        <PageNotFoundImage />
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import routeNames from "@/router/route-names.js";
// Components
import PageNotFoundImage from "../../../public/static/page-not-found-image.vue";

export default {
  components: {
    PageNotFoundImage
  },
  setup() {
    const router = useRouter();

    const goToDashboard = () => {
      router.push({ name: routeNames.dashboard });
    };

    return {
      goToDashboard
    };
  }
};
</script>

<style scoped lang="scss" src="./PageNotFound.scss"></style>
