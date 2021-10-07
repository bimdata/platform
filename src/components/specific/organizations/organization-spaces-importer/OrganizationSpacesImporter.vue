<template>
  <div class="organization-spaces-importer">
    <div class="organization-spaces-importer__header">
      <BIMDataButton ghost radius :disabled="loading" @click="close">
        <BIMDataIcon name="arrow" size="xxs" margin="0 6px 0 0" />
        <span>{{ $t("OrganizationSpacesImporter.backButtonText") }}</span>
      </BIMDataButton>
      <TextBox :text="organization.name" :maxLength="24" />
      <BIMDataButton ghost rounded icon :disabled="loading" @click="closePanel">
        <BIMDataIcon name="close" size="xxs" fill color="tertiary-dark" />
      </BIMDataButton>
    </div>

    <div class="organization-spaces-importer__content">
      <div class="list-title">
        {{ $t("OrganizationSpacesImporter.spaceListTitle") }}
      </div>
      <div class="list-container">
        <div v-for="space of spaces" :key="space.id">
          <BIMDataCheckbox />
          <TextBox :text="space.name" :maxLength="32" />
        </div>
      </div>
      <BIMDataButton color="primary" fill radius>
        {{ $t("OrganizationSpacesImporter.submitButtonText") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    organization: {
      type: Object,
      required: true
    }
  },
  emits: ["close", "close-panel"],
  setup(props, { emit }) {
    const spaces = ref([]);

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
      spaces,
      // Methods
      close,
      closePanel
    };
  }
};
</script>

<style scoped lang="scss" src="./OrganizationSpacesImporter.scss"></style>
