<template>
  <teleport to="#app-modal-paiement">
    <div class="files-paiement-modal">
      <div class="files-paiement-modal__box">
        <div class="files-paiement-modal__box__header">
          <span>Get More Space</span>
          <span>You currently have 300 Mb of BIMData space.</span>
        </div>
        <div class="files-paiement-modal__box__body">
          <div class="files-paiement-modal__box__body__content">
            <img src="/static/paiementModal/upgrade.png" />
            <div class="files-paiement-modal__box__body__content__text">
              <span>Upgrade your space</span>
              <span>Upgrade to Bimdata Pro to get the most space</span>
            </div>
            <span class="files-paiement-modal__box__body__content__data"
              >10 GB</span
            >
          </div>
          <div class="files-paiement-modal__box__body__separator"></div>
          <div class="files-paiement-modal__box__body__content">
            <img src="/static/paiementModal/referal.png" />
            <div class="files-paiement-modal__box__body__content__text">
              <span>Refer a friend to BIMData</span>
              <span
                >Spread the love to your friends, family, and coworkers</span
              >
            </div>
            <span class="files-paiement-modal__box__body__content__data"
              >+100 MB</span
            >
          </div>
          <div class="files-paiement-modal__box__body__separator"></div>
          <div class="files-paiement-modal__box__body__content">
            <img src="/static/paiementModal/linkedin.png" />
            <div class="files-paiement-modal__box__body__content__text">
              <span>Connect your Linkedin account</span>
              <span
                >Share folders with your friends and coworkers in a snap</span
              >
            </div>
            <span class="files-paiement-modal__box__body__content__data"
              >+100 MB</span
            >
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import {} from "vue";

export default {
  props: {},
  emits: [],
  setup() {
    return {};
  }
};
</script>

<style lang="scss" src="./FilesPaiementModal.global.scss"></style>
<style scoped lang="scss" src="./FilesPaiementModal.scss"></style>
