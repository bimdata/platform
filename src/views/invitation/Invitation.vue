<template>
  <div class="invitation">
    <div class="invitation__back-btn">
      <GoBackButton />
    </div>
    <div class="invitation__content">
      <span>{{ $t("Invitation.title") }}</span>
      <div class="invitation__content__header">
        <span>{{ $t("Invitation.invitCounter") }}</span>
        <BIMDataButton
          class="generic-modal__content__btn-close"
          ghost
          rounded
          icon
          @click="$emit('close')"
        >
          <BIMDataIcon name="close" size="xxs" />
        </BIMDataButton>
      </div>
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
    const data = [
      {
        project: "test-dwg",
        cloud: "new viewer",
        date: new Date(),
        status: "A"
      },
      {
        project: "new project",
        cloud: "new viewer",
        date: new Date(),
        status: "D"
      },
      {
        project: "project2",
        cloud: "new viewer",
        date: new Date(),
        status: "W"
      }
    ];
    return {
      getBack: () => router.back()
    };
  }
};
</script>

<style scoped lang="scss" src="./Invitation.scss"></style>
