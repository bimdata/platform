<template>
  <div class="subscription-modal" v-click-away="closeModal">
    <BIMDataButton
      class="subscription-modal__btn-close"
      ghost
      rounded
      icon
      @click="closeModal"
    >
      <BIMDataIconClose size="xxs" fill color="granite-light" />
    </BIMDataButton>

    <div class="subscription-modal__header">
      <span>{{ $t("SubscriptionModal.title") }}</span>
      <span>
        {{ $t("SubscriptionModal.subtitle", { size: freePlanStorage }) }}
      </span>
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
        <div class="subscription-modal__body__offer" @click="closeModal">
          <div class="subscription-modal__body__offer__content">
            <img src="/static/subscriptionModal/upgrade.png" />
            <div class="subscription-modal__body__offer__content__text">
              <span>{{ $t("SubscriptionModal.upgrade.title") }}</span>
              <span>{{ $t("SubscriptionModal.upgrade.subtitle") }}</span>
            </div>
            <span class="subscription-modal__body__offer__content__data">
              {{ proPlanStorage }}
            </span>
          </div>
        </div>
      </AppLink>

      <div class="subscription-modal__body__separator"></div>
      <div class="subscription-modal__body__offer">
        <div class="subscription-modal__body__offer__banner">
          <span class="subscription-modal__body__offer__banner__text">
            {{ $t("SubscriptionModal.soon") }}
          </span>
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
            {{ `+ ${bonusStorage}` }}
          </div>
        </div>
      </div>

      <div class="subscription-modal__body__separator"></div>
      <div class="subscription-modal__body__offer">
        <div class="subscription-modal__body__offer__banner">
          <span class="subscription-modal__body__offer__banner__text">
            {{ $t("SubscriptionModal.soon") }}
          </span>
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
            {{ `+ ${bonusStorage}` }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAppModal } from "../../app/app-modal/app-modal.js";
import {
  BONUS_STORAGE,
  FREE_PLAN_STORAGE,
  PRO_PLAN_STORAGE
} from "../../../../config/subscription.js";
import routeNames from "../../../../router/route-names.js";
import { useSpaces } from "../../../../state/spaces.js";
import { formatBytes } from "../../../../utils/files.js";
// Components
import AppLink from "../../app/app-link/AppLink.vue";

export default {
  components: {
    AppLink
  },
  setup() {
    const { closeModal } = useAppModal();
    const { currentSpace } = useSpaces();

    const freePlanStorage = formatBytes(FREE_PLAN_STORAGE);
    const proPlanStorage = formatBytes(PRO_PLAN_STORAGE);
    const bonusStorage = formatBytes(BONUS_STORAGE);

    return {
      // References
      bonusStorage,
      currentSpace,
      freePlanStorage,
      proPlanStorage,
      routeNames,
      // Methods
      closeModal
    };
  }
};
</script>

<style scoped lang="scss" src="./SubscriptionModal.scss"></style>
