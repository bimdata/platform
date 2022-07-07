<template>
  <div class="subscription-modal" v-click-away="closeModal">
    <div class="subscription-modal__header">
      <span>{{ $t("SubscriptionModal.title") }}</span>
      <span>{{ $t("SubscriptionModal.subtitle") }}</span>
    </div>
    <div class="subscription-modal__body">
      <AppLink
        :to="{
          name: routeNames.subscriptionPro,
          query: {
            space: currentSpace.id
          }
        }"
      >
        <div class="subscription-modal__body__offer">
          <div class="subscription-modal__body__offer__content">
            <img src="/static/subscriptionModal/upgrade.png" />
            <div class="subscription-modal__body__offer__content__text">
              <span>{{ $t("SubscriptionModal.upgrade.title") }}</span>
              <span>{{ $t("SubscriptionModal.upgrade.subtitle") }}</span>
            </div>
            <span class="subscription-modal__body__offer__content__data">{{
              $t("SubscriptionModal.10gbSize")
            }}</span>
          </div>
        </div>
      </AppLink>
      <div class="subscription-modal__body__separator"></div>
      <div class="subscription-modal__body__offer">
        <div class="subscription-modal__body__offer__banner">
          <div>
            <span class="subscription-modal__body__offer__banner__text">{{
              $t("SubscriptionModal.soon")
            }}</span>
          </div>
        </div>
        <div
          class="subscription-modal__body__offer__content"
          style="opacity: 40%"
        >
          <img src="/static/subscriptionModal/referal.png" />
          <div class="subscription-modal__body__offer__content__text">
            <span>{{ $t("SubscriptionModal.referal.title") }}</span>
            <span>{{ $t("SubscriptionModal.referal.subtitle") }}</span>
          </div>
          <div class="subscription-modal__body__offer__content__data">
            <span>{{ $t("SubscriptionModal.100mbSize") }}</span>
          </div>
        </div>
      </div>
      <div class="subscription-modal__body__separator"></div>
      <div class="subscription-modal__body__offer">
        <div class="subscription-modal__body__offer__banner">
          <span class="subscription-modal__body__offer__banner__text">{{
            $t("SubscriptionModal.soon")
          }}</span>
        </div>
        <div
          class="subscription-modal__body__offer__content"
          style="opacity: 40%"
        >
          <img src="/static/subscriptionModal/linkedin.png" />
          <div class="subscription-modal__body__offer__content__text">
            <span>{{ $t("SubscriptionModal.linkedin.title") }}</span>
            <span>{{ $t("SubscriptionModal.linkedin.subtitle") }}</span>
          </div>
          <div class="subscription-modal__body__offer__content__data">
            <span>{{ $t("SubscriptionModal.100mbSize") }}</span>
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
import { useSpaces } from "@/state/spaces.js";

export default {
  components: {
    AppLink
  },
  setup() {
    const { showModal, closeModal } = useAppModal();
    const { currentSpace } = useSpaces();

    return {
      // references
      showModal,
      routeNames,
      currentSpace,
      // methods
      closeModal
    };
  }
};
</script>

<style scoped lang="scss" src="./SubscriptionModal.scss"></style>
