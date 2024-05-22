<template>
  <AppGlobalLoader
    :message="$t('UserProfile.loading.message')"
    :subMessage="$t('UserProfile.loading.subMessage')"
  />

  <div class="user-profile" v-show="!showGlobalLoader">
    <div class="user-profile__back-btn">
      <GoBackButton />
    </div>
    <div class="user-profile__container">
      <span class="m-t-6">{{ $t("UserProfile.title") }}</span>
      <div class="user-profile__container__content">
        <BIMDataSpinner />
        <template v-if="showIframe">
          <iframe ref="iframe" :src="BIMDATACONNECT_URL + '/embed_profile/'" />
        </template>
      </div>
    </div>
    <div class="user-profile__ghost-element"></div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../../state/auth.js";
import { useAppGlobalLoader } from "../../components/specific/app/app-global-loader/app-global-loader.js";

import GoBackButton from "../../components/specific/app/go-back-button/GoBackButton.vue";
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
    const showIframe = ref(true);

    onMounted(() => {
      window.addEventListener("message", async message => {
        switch (message.data) {
          case "profile update successful":
            showIframe.value = false;
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
      BIMDATACONNECT_URL: ENV.VUE_APP_URL_BIMDATACONNECT,
      iframe,
      showGlobalLoader,
      showIframe,
    };
  }
};
</script>

<style scoped lang="scss" src="./UserProfile.scss"></style>
