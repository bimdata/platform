<template>
  <div class="subscription-modal" v-click-away="closeModal">
    <div class="subscription-modal__header">
      <span>Get More Space</span>
      <span>You currently have 300 Mb of BIMData space.</span>
    </div>
    <div class="subscription-modal__body">
      <AppLink :to="{ name: routeNames.subscriptionPro }">
        <div class="subscription-modal__body__offer">
          <div class="subscription-modal__body__offer__content">
            <img src="/static/subscriptionModal/upgrade.png" />
            <div class="subscription-modal__body__offer__content__text">
              <span>Upgrade your space</span>
              <span>Upgrade to Bimdata Pro to get the most space</span>
            </div>
            <span class="subscription-modal__body__offer__content__data"
              >10 GB</span
            >
          </div>
        </div>
      </AppLink>
      <div class="subscription-modal__body__separator"></div>
      <div class="subscription-modal__body__offer">
        <div class="subscription-modal__body__offer__banner">
          <span class="subscription-modal__body__offer__banner__text"
            >SOON</span
          >
        </div>
        <div
          class="subscription-modal__body__offer__content"
          style="opacity: 40%"
        >
          <img src="/static/subscriptionModal/referal.png" />
          <div class="subscription-modal__body__offer__content__text">
            <span>Refer a friend to BIMData</span>
            <span>Spread the love to your friends, family, and coworkers</span>
          </div>
          <div class="subscription-modal__body__offer__content__data">
            <span>+100 MB</span>
          </div>
        </div>
      </div>
      <div class="subscription-modal__body__separator"></div>
      <div class="subscription-modal__body__offer">
        <div class="subscription-modal__body__offer__banner">
          <span class="subscription-modal__body__offer__banner__text"
            >SOON</span
          >
        </div>
        <div
          class="subscription-modal__body__offer__content"
          style="opacity: 40%"
        >
          <img src="/static/subscriptionModal/linkedin.png" />
          <div class="subscription-modal__body__offer__content__text">
            <span>Connect your Linkedin account</span>
            <span>Share folders with your friends and coworkers in a snap</span>
          </div>
          <div class="subscription-modal__body__offer__content__data">
            <span>+100 MB</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import routeNames from "@/router/route-names.js";
import AppLink from "@/components/specific/app/app-link/AppLink.vue";
import { useAppModal } from "@/components/specific/app/app-modal/app-modal.js";

export default {
  components: {
    AppLink
  },
  setup() {
    const { showModal, closeModal } = useAppModal();

    return {
      // references
      showModal,
      routeNames,
      // methods
      closeModal
    };
  }
};
</script>

<style scoped lang="scss" src="./SubscriptionModal.scss"></style>
