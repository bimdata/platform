<template>
  <AppGlobalLoader
    :message="$t('ProfileSettings.loading.message')"
    :subMessage="$t('ProfileSettings.loading.subMessage')"
  />

  <div class="profile-settings" v-show="!showGlobalLoader">
    <div class="profile-settings__back-btn">
      <GoBackButton />
    </div>
    <div class="profile-settings__container">
      <span class="m-t-6">{{ $t("ProfileSettings.title") }}</span>
      <div class="profile-settings__container__content">
        <BIMDataSpinner />
        <template v-if="displayIframe">
          <iframe ref="iframe" :src="bimDataConnectUrl + '/embed_profile/'" />
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
import { useAppGlobalLoader } from "../../components/specific/app/app-global-loader/app-global-loader.js";

import GoBackButton from "@/components/specific/app/go-back-button/GoBackButton.vue";
import AppGlobalLoader from "../../components/specific/app/app-global-loader/AppGlobalLoader.vue";

export default {
  components: {
    GoBackButton,
    AppGlobalLoader
  },
  setup() {
    const router = useRouter();
    const { signOut } = useAuth();
    const { openGlobalLoader, closeGlobalLoader, showGlobalLoader } =
      useAppGlobalLoader();

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
            openGlobalLoader();
            break;
          case "account delete error":
            closeGlobalLoader();
            break;
          case "account delete successful":
            signOut();
        }
      });
    });

    return {
      // References
      iframe,
      deleteLoader,
      displayIframe,
      showGlobalLoader,
      bimDataConnectUrl: process.env.VUE_APP_URL_BIMDATACONNECT,
      // Methods
      getBack: () => router.back()
    };
  }
};
</script>

<style scoped lang="scss" src="./ProfileSettings.scss"></style>
