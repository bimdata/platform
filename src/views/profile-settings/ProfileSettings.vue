<template>
  <template v-if="deleteLoader">
    <teleport to="body">
      <BIMDataLoading
        class="delete-loader"
        :message="$t('ProfileSettings.loading.message')"
        :subMessage="$t('ProfileSettings.loading.subMessage')"
      />
    </teleport>
  </template>
  <div class="profile-settings">
    <div class="profile-settings__back-btn">
      <GoBackButton />
    </div>
    <div class="profile-settings__container">
      <span>{{ $t("ProfileSettings.title") }}</span>
      <div class="profile-settings__container__content">
        <BIMDataSpinner />
        <template v-if="displayIframe">
          <iframe ref="iframe" src="http://localhost:8000/embed_profile/" />
        </template>
      </div>
    </div>
    <div class="profile-settings__ghost-element" />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/state/auth.js";

import GoBackButton from "@/components/specific/app/go-back-button/GoBackButton.vue";
export default {
  components: {
    GoBackButton
  },
  setup() {
    const router = useRouter();
    const { signOut } = useAuth();

    const iframe = ref(null);
    const deleteLoader = ref(false);
    const displayIframe = ref(true);

    onMounted(() => {
      window.addEventListener("message", async message => {
        switch (message.data) {
          case "profile update successful":
            displayIframe.value = false;
            await signOut();
            break;
          case "account delete start":
            setTimeout(() => (deleteLoader.value = true), 500);
            break;
          case "account delete successful":
            signOut();
        }
      });
    });

    return {
      iframe,
      deleteLoader,
      displayIframe,
      getBack: () => router.back()
    };
  }
};
</script>

<style scoped lang="scss" src="./ProfileSettings.scss"></style>
