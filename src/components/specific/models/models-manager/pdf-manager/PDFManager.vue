<template>
  <GenericModelsManager
    class="pdf-manager"
    :project="project"
    :types="types"
    :tabs="tabs"
    @tab-changed="currentTab = $event"
    @edit-metaBuilding="editBM"
    @file-uploaded="$emit('file-uploaded')"
  >
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
    <template #content v-if="currentTab && currentTab.id === 'metaBuildings'">
      <BIMDataButton
        class="pdf-manager__building-maker-btn"
        width="100px"
        color="primary"
        outline
        radius
        icon
        @click="openBM"
      >
        <BIMDataIcon name="building" size="xxxs" margin="0 12px 0 0" />
        <span> {{ $t("ModelsTable.buildingMaker.create") }} </span>
      </BIMDataButton>

      <transition name="slide-fade-right">
        <div v-if="isOpenBM" class="pdf-manager__building-maker">
          <BIMDataButton
            class="pdf-manager__building-maker__close"
            ghost
            rounded
            icon
            @click="closeBM"
          >
            <BIMDataIcon name="close" size="xxs" fill color="granite-light" />
          </BIMDataButton>
          <div class="pdf-manager__building-maker__content">
            <BuildingMaker
              :apiClient="apiClient"
              :space="project.cloud"
              :project="project"
              :model="currentModel"
              @metaBuilding-created="loadProjectModels(project)"
              @metaBuilding-updated="loadProjectModels(project)"
              @metaBuilding-deleted="loadProjectModels(project)"
            />
          </div>
        </div>
      </transition>
    </template>
  </GenericModelsManager>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { MODEL_TYPE } from "../../../../../config/models.js";
import { useToggle } from "../../../../../composables/toggle";
import { useModels } from "../../../../../state/models.js";
import apiClient from "../../../../../services/api-client.js";
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
    },
    types: {
      type: Array,
      required: true
    }
  },
  emits: ["file-uploaded"],
  setup(props) {
    const { locale, fallbackLocale } = useI18n();
    const { loadProjectModels } = useModels();
    const { isOpen: isOpenBM, close: closeBM, open: openBM } = useToggle();

    const tabs = ref(tabsDef);
    const currentTab = ref(null);
    const currentModel = ref(null);

    const editBM = model => {
      currentModel.value = model;
      openBM();
      setTimeout(() => (currentModel.value = null), 100);
    };

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

    const placeholderBackground = computed(() => {
      const lang =
        ["fr", "de", "it", "es", "en"].find(lang => lang === locale.value) ||
        fallbackLocale.value;
      return `var(--color-silver-light) url("/static/modelsManager/menuAnimation/${lang}.gif") no-repeat 11% 143% / 79%`;
    });

    return {
      // References
      apiClient,
      currentModel,
      currentTab,
      isOpenBM,
      placeholderBackground,
      tabs,
      // Methods
      closeBM,
      editBM,
      loadProjectModels,
      openBM
    };
  }
};
</script>

<style scoped lang="scss" src="./PDFManager.scss"></style>
