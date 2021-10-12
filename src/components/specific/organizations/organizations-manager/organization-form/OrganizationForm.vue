<template>
  <div class="organization-form">
    <transition name="fade" mode="out-in">
      <template v-if="isSuccess">
        <OrganizationFormSuccess @close="reset" />
      </template>

      <template v-else>
        <div class="organization-form__content">
          <div class="organization-form__title">
            {{ $t("OrganizationForm.title") }}
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
import { inject, ref, watch } from "vue";
import { useOrganizations } from "@/state/organizations.js";
// Components
import OrganizationFormSuccess from "./organization-form-success/OrganizationFormSuccess.vue";

export default {
  components: {
    OrganizationFormSuccess
  },
  setup() {
    const { createOrganization, updateOrganization } = useOrganizations();

    const localState = inject("localState");

    const hasInvalidName = ref(false);
    const isSuccess = ref(true);

    const reset = () => {
      localState.loading = false;
      hasInvalidName.value = false;
      isSuccess.value = false;
    };

    const orgaName = ref("");
    const orgaLogo = ref(null);

    watch(
      () => localState.organization,
      () => {
        if (localState.organization) {
          orgaName.value = localState.organization.name;
        }
      },
      { immediate: true }
    );

    const submit = async () => {
      hasInvalidName.value = false;
      if (!orgaName.value) {
        hasInvalidName.value = true;
        return;
      }
      try {
        localState.loading = true;
        const newOrganization = { name: orgaName.value };
        if (localState.organization) {
          await updateOrganization(newOrganization);
        } else {
          await createOrganization(newOrganization);
        }
        isSuccess.value = true;
      } finally {
        localState.loading = false;
      }
    };

    return {
      // References
      hasInvalidName,
      isSuccess,
      orgaLogo,
      orgaName,
      // Methods
      reset,
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./OrganizationForm.scss"></style>
