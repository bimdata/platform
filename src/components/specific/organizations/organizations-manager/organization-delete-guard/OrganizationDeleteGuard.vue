<template>
  <div class="organization-delete-guard">
    <div class="organization-delete-guard__title">
      {{ $t("OrganizationDeleteGuard.title") }}
    </div>
    <div class="organization-delete-guard__message">
      {{ $t("OrganizationDeleteGuard.message") }}
    </div>
    <div class="organization-delete-guard__action">
      <BIMDataButton
        width="120px"
        color="high"
        fill
        radius
        disabled
        @click="submit"
      >
        {{ $t("OrganizationDeleteGuard.submitButtonText") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { inject } from "vue";
import { useOrganizations } from "@/state/organizations.js";

export default {
  setup() {
    const { deleteOrganization } = useOrganizations();

    const localState = inject("localState");

    const submit = async () => {
      try {
        localState.loading = true;
        await deleteOrganization(localState.organization);
        localState.currentView = "list";
      } finally {
        localState.loading = false;
      }
    };

    return {
      // Methods
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./OrganizationDeleteGuard.scss"></style>
