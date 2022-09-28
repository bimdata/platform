<template>
  <GenericModelsManager :project="project" :tabs="tabs">
    <template #tablePlaceholder v-if="models.length === 0">
      <div class="pdf-manager__placeholder">
        <div
          class="pdf-manager__placeholder__circle"
          :style="`background: ${placeholderBackground}`"
        >
          <BIMDataFileIcon class="icon" fileName=".pdf" :size="20" />
        </div>
        <div class="pdf-manager__placeholder__content">
          {{ $t("ModelsTable.emptyTablePlaceholder.textPdf") }}
        </div>
      </div>
    </template>
  </GenericModelsManager>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { MODEL_TYPE } from "../../../../../config/models.js";
import { segregateBySource } from "../../../../../utils/models.js";
// Components
import GenericModelsManager from "../generic-models-manager/GenericModelsManager.vue";

const tabsDef = [{ id: "upload" }, { id: "metaBuildings" }, { id: "archive" }];

export default {
  components: {
    GenericModelsManager
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    models: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const { locale, fallbackLocale } = useI18n();
    const tabs = ref(tabsDef);

    watch(
      () => props.models,
      models => {
        const modelsBySource = segregateBySource(
          models.filter(model => model.type !== MODEL_TYPE.META_BUILDING)
        );
        const metaBuildings = models.filter(
          model => model.type === MODEL_TYPE.META_BUILDING
        );
        tabs.value = tabs.value.map(tab => ({
          ...tab,
          label: tab.label || tab.id,
          models:
            tab.id === "metaBuildings" ? metaBuildings : modelsBySource[tab.id]
        }));
      },
      { immediate: true }
    );

    const placeholderBackground = computed(
      () =>
        `var(--color-silver-light) url("/static/modelsManager/menuAnimation/${
          ["fr", "de", "it", "es", "en"].find(lang => lang === locale.value) ||
          fallbackLocale.value
        }.gif") no-repeat 11% 143% / 79%`
    );

    return {
      placeholderBackground,
      tabs
    };
  }
};
</script>

<style scoped lang="scss" src="./PDFManager.scss"></style>
