<template>
  <div class="invitation">
    <div class="invitation__back-btn">
      <GoBackButton />
    </div>
    <div class="invitation__content">
      <span>{{ $t("Invitation.title") }}</span>
      <iframe src="http://localhost:8000/embed_invitation/"></iframe>
    </div>
    <div class="invitation__empty-div"></div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

import GoBackButton from "@/components/specific/app/go-back-button/GoBackButton.vue";

export default {
  components: {
    GoBackButton
  },
  setup() {
    const router = useRouter();
    return {
      getBack: () => router.back()
    };
  }
};
</script>

<style scoped lang="scss" src="./Invitation.scss"></style>
