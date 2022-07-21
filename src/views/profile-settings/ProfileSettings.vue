<template>
  <div class="profile-settings">
    <div class="profile-settings__back-btn">
      <GoBackButton />
    </div>
    <div class="profile-settings__content">
      <span>{{ $t("ProfileSettings.title") }}</span>
      <iframe src="http://localhost:8000/embed_profile/" />
    </div>
    <div class="profile-settings__ghost-element" />
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
      // methods
      getBack: () => router.back()
    };
  }
};
</script>

<style scoped lang="scss" src="./ProfileSettings.scss"></style>
