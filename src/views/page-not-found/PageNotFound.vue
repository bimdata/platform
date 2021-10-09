<template>
  <div class="view page-not-found">
    <div class="page-not-found__left">
      <div class="page-not-found__404">
        <img src="/static/page-not-found-404.svg" />
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
        <img src="/static/page-not-found-image.svg" />
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { routeNames } from "@/router";

export default {
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
