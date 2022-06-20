<template>
  <teleport to="#app-modal-paiement">
    <div v-show="isOpen" class="files-paiement-modal">
      <div class="files-paiement-modal__box" v-click-away="closePaiementModal">
        <BIMDataButton
          class="files-paiement-modal__box__btn-close"
          ghost
          rounded
          icon
          @click="closePaiementModal"
        >
          <BIMDataIcon name="close" size="xxs" fill color="granite-light" />
        </BIMDataButton>
        <div class="files-paiement-modal__box__header">
          <span>Get More Space</span>
          <span>You currently have 300 Mb of BIMData space.</span>
        </div>
        <div class="files-paiement-modal__box__body">
          <AppLink :to="{ name: routeNames.subscriptionPro }">
            <div class="files-paiement-modal__box__body__offer">
              <div class="files-paiement-modal__box__body__offer__content">
                <img src="/static/paiementModal/upgrade.png" />
                <div
                  class="files-paiement-modal__box__body__offer__content__text"
                >
                  <span>Upgrade your space</span>
                  <span>Upgrade to Bimdata Pro to get the most space</span>
                </div>
                <span
                  class="files-paiement-modal__box__body__offer__content__data"
                  >10 GB</span
                >
              </div>
            </div>
          </AppLink>
          <div class="files-paiement-modal__box__body__separator"></div>
          <div class="files-paiement-modal__box__body__offer">
            <div class="files-paiement-modal__box__body__offer__banner">
              <span class="files-paiement-modal__box__body__offer__banner__text"
                >SOON</span
              >
            </div>
            <div
              class="files-paiement-modal__box__body__offer__content"
              style="opacity: 40%"
            >
              <img src="/static/paiementModal/referal.png" />
              <div
                class="files-paiement-modal__box__body__offer__content__text"
              >
                <span>Refer a friend to BIMData</span>
                <span
                  >Spread the love to your friends, family, and coworkers</span
                >
              </div>
              <div
                class="files-paiement-modal__box__body__offer__content__data"
              >
                <span>+100 MB</span>
              </div>
            </div>
          </div>
          <div class="files-paiement-modal__box__body__separator"></div>
          <div class="files-paiement-modal__box__body__offer">
            <div class="files-paiement-modal__box__body__offer__banner">
              <span class="files-paiement-modal__box__body__offer__banner__text"
                >SOON</span
              >
            </div>
            <div
              class="files-paiement-modal__box__body__offer__content"
              style="opacity: 40%"
            >
              <img src="/static/paiementModal/linkedin.png" />
              <div
                class="files-paiement-modal__box__body__offer__content__text"
              >
                <span>Connect your Linkedin account</span>
                <span
                  >Share folders with your friends and coworkers in a snap</span
                >
              </div>
              <div
                class="files-paiement-modal__box__body__offer__content__data"
              >
                <span>+100 MB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import routeNames from "@/router/route-names.js";
import AppLink from "@/components/specific/app/app-link/AppLink.vue";
import { usePaiementModal } from "./paiement-modal.js";

export default {
  components: {
    AppLink
  },
  emits: ["close"],
  setup() {
    const { isOpen, closePaiementModal } = usePaiementModal();
    return {
      // references
      isOpen,
      routeNames,
      // methods
      closePaiementModal
    };
  }
};
</script>

<style lang="scss" src="./FilesPaiementModal.global.scss"></style>
<style scoped lang="scss" src="./FilesPaiementModal.scss"></style>
