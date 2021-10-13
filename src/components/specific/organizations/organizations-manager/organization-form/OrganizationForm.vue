<template>
  <div class="organization-form">
    <transition name="fade" mode="out-in">
      <template v-if="isSuccess">
        <OrganizationFormSuccess @close="reset" />
      </template>

      <template v-else>
        <div class="organization-form__content">
          <div class="form-title">
            {{
              $t(`OrganizationForm.${isUpdate ? "updateTitle" : "createTitle"}`)
            }}
          </div>

          <div class="form-section--name">
            <div class="form-section__title">
              {{ $t("OrganizationForm.infoSectionTitle") }}
            </div>
            <BIMDataInput
              :placeholder="$t('OrganizationForm.nameInputPlaceholder')"
              :error="hasInvalidName"
              :errorMessage="$t('OrganizationForm.nameInputErrorMessage')"
              v-model="orgaName"
            />
          </div>

          <div class="form-section--logo">
            <div class="logo-preview" v-show="orgaLogoUrl">
              <img :src="orgaLogoUrl" />
            </div>
            <div class="logo-input">
              <div class="logo-input__title">
                {{ $t("OrganizationForm.logoInputLabel") }}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  @change="orgaLogoFile = $event.target.files[0]"
                />
              </div>
              <div class="logo-input__message">
                {{ $t("OrganizationForm.logoInputMessage") }}
              </div>
            </div>
          </div>

          <div class="form-action">
            <BIMDataButton
              width="120px"
              color="primary"
              fill
              radius
              @click="submit"
            >
              {{ $t("OrganizationForm.submitButtonText") }}
            </BIMDataButton>
          </div>
        </div>
      </template>
    </transition>
  </div>
</template>

<script>
import { computed, inject, ref, watch } from "vue";
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

    const isUpdate = computed(() => !!localState.organization);
    const hasInvalidName = ref(false);
    const isSuccess = ref(false);

    const reset = () => {
      localState.loading = false;
      hasInvalidName.value = false;
      isSuccess.value = false;
      localState.currentView = "list";
    };

    const orgaName = ref("");
    const orgaLogoUrl = ref("");
    const orgaLogoFile = ref(null);

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      orgaLogoUrl.value = reader.result;
    });
    watch(orgaLogoFile, file => reader.readAsDataURL(file));

    watch(
      () => localState.organization,
      () => {
        if (isUpdate.value) {
          orgaName.value = localState.organization.name;
          orgaLogoUrl.value = localState.organization.logo;
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
        const newOrganization = {
          name: orgaName.value,
          logo: orgaLogoFile.value
        };
        if (isUpdate.value) {
          newOrganization.id = localState.organization.id;
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
      isUpdate,
      orgaLogoFile,
      orgaLogoUrl,
      orgaName,
      // Methods
      reset,
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./OrganizationForm.scss"></style>
