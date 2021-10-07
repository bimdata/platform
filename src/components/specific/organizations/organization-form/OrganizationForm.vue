<template>
  <div class="organization-form">
    <div class="organization-form__header">
      <BIMDataButton ghost radius :disabled="loading" @click="close">
        <BIMDataIcon name="arrow" size="xxs" margin="0 6px 0 0" />
        <span>{{ $t("OrganizationForm.backButtonText") }}</span>
      </BIMDataButton>
      <BIMDataButton ghost rounded icon :disabled="loading" @click="closePanel">
        <BIMDataIcon name="close" size="xxs" fill color="tertiary-dark" />
      </BIMDataButton>
    </div>

    <transition name="fade" mode="out-in">
      <template v-if="loading">
        <div class="organization-form__loader">
          <BIMDataSpinner />
        </div>
      </template>

      <template v-else-if="isSuccess">
        <div class="organization-form__success">
          <img
            class="organization-form__success__image"
            src="/static/organization-form-success.svg"
          />
          <div class="organization-form__success__title">
            {{ $t("OrganizationForm.successTitle") }}
          </div>
          <div class="organization-form__success__message">
            {{ $t("OrganizationForm.successMessage") }}
          </div>
          <BIMDataButton
            width="120px"
            color="primary"
            fill
            radius
            @click="reset"
          >
            {{ $t("OrganizationForm.successButtonText") }}
          </BIMDataButton>
        </div>
      </template>

      <template v-else>
        <div class="organization-form__content">
          <div class="organization-form__title">
            {{ "Création d'organisation" }}
          </div>
          <div class="organization-form__section">
            <div class="organization-form__section__title">
              {{ $t("OrganizationForm.infoSectionTitle") }}
            </div>
            <BIMDataInput
              :placeholder="$t('OrganizationForm.nameInputPlaceholder')"
              :error="hasInvalidName"
              :errorMessage="$t('OrganizationForm.nameInputErrorMessage')"
              v-model="orgaName"
            />
          </div>
          <div class="organization-form__section">
            <div class="organization-form__section__title">
              {{ $t("OrganizationForm.logoSectionTitle") }}
            </div>
            <input
              type="file"
              accept="image/png, image/jpeg"
              @change="orgaLogo = $event.target.files[0]"
            />
          </div>
          <div class="organization-form__action">
            <BIMDataButton width="120px" color="primary" fill radius>
              {{ $t("OrganizationForm.submitButtonText") }}
            </BIMDataButton>
          </div>
        </div>
      </template>
    </transition>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useOrganizations } from "@/state/organizations.js";

export default {
  props: {
    organization: {
      type: Object,
      default: null
    }
  },
  emits: ["close", "close-panel"],
  setup(props, { emit }) {
    const { createOrganization, updateOrganization } = useOrganizations();

    const loading = ref(false);
    const hasInvalidName = ref(false);
    const isSuccess = ref(false);

    const orgaName = ref("");
    const orgaLogo = ref(null);

    watch(
      () => props.organization,
      () => {
        if (props.organization) {
          orgaName.value = props.organization.name;
        }
      },
      { immediate: true }
    );

    const reset = () => {
      loading.value = false;
      hasInvalidName.value = false;
      isSuccess.value = false;
    };

    const close = () => {
      reset();
      emit("close");
    };

    const closePanel = () => {
      reset();
      emit("close-panel");
    };

    const submit = async () => {
      hasInvalidName.value = false;
      if (!orgaName.value) {
        hasInvalidName.value = true;
        return;
      }
      try {
        loading.value = true;
        const newOrganization = { name: orgaName.value };
        if (props.organization) {
          await updateOrganization(newOrganization);
        } else {
          await createOrganization(newOrganization);
        }
        isSuccess.value = true;
      } finally {
        loading.value = false;
      }
    };

    return {
      // References
      hasInvalidName,
      isSuccess,
      loading,
      orgaLogo,
      orgaName,
      // Methods
      close,
      closePanel,
      reset,
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./OrganizationForm.scss"></style>
