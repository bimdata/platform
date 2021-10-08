<template>
  <div class="organization-spaces-import">
    <div class="organization-spaces-import__header">
      <BIMDataButton ghost radius :disabled="loading" @click="close">
        <BIMDataIcon name="arrow" size="xxs" margin="0 6px 0 0" />
        <span>{{ $t("OrganizationSpacesImport.backButtonText") }}</span>
      </BIMDataButton>
      <TextBox :text="organization.name" :maxLength="24" />
      <BIMDataButton ghost rounded icon :disabled="loading" @click="closePanel">
        <BIMDataIcon name="close" size="xxs" fill color="tertiary-dark" />
      </BIMDataButton>
    </div>

    <div class="organization-spaces-import__content">
      <div class="list-title">
        {{ $t("OrganizationSpacesImport.spaceListTitle") }}
      </div>
      <div class="list-container">
        <div class="list-item" v-for="space of spaces" :key="space.id">
          <BIMDataCheckbox class="list-item__checkbox" />
          <TextBox :text="space.name" :maxLength="32" />
        </div>
      </div>
      <BIMDataButton color="primary" fill radius>
        {{ $t("OrganizationSpacesImport.submitButtonText") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useOrganizations } from "@/state/organizations.js";
import { useSpaces } from "@/state/spaces.js";

export default {
  props: {
    organization: {
      type: Object,
      required: true
    }
  },
  emits: ["close", "close-panel"],
  setup(props, { emit }) {
    const { userSpaces } = useSpaces();
    const { getOrganizationSpaces } = useOrganizations();

    const spaces = computed(() => {
      const organizationSpacesIDs = getOrganizationSpaces(
        props.organization
      ).map(space => space.id);
      return userSpaces.value.filter(
        space => !organizationSpacesIDs.includes(space.id)
      );
    });

    const loading = ref(false);

    const reset = () => {
      loading.value = false;
    };
    const close = () => {
      reset();
      emit("close");
    };
    const closePanel = () => {
      reset();
      emit("close-panel");
    };

    return {
      // References
      loading,
      spaces,
      // Methods
      close,
      closePanel
    };
  }
};
</script>

<style scoped lang="scss" src="./OrganizationSpacesImport.scss"></style>
