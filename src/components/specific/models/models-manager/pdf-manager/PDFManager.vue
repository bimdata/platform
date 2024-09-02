<template>
  <GenericModelsManager
    class="pdf-manager"
    :project="project"
    :types="types"
    :tabs="tabs"
    @tab-changed="currentTab = $event"
    @file-uploaded="$emit('file-uploaded')"
    @edit-metaBuilding="editMetaBuilding"
    @view-metaBuilding="viewMetaBuilding"
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
    <template #content v-if="currentTab?.id === 'metaBuildings'">
      <BIMDataButton
        v-if="!isProjectGuest(project)"
        class="pdf-manager__building-maker-btn"
        width="100px"
        color="primary"
        outline
        radius
        icon
        @click="openBuildingMaker"
      >
        <BIMDataIconBuilding size="xs" margin="0 12px 0 0" />
        <span> {{ $t("t.create") }} </span>
      </BIMDataButton>
    </template>
  </GenericModelsManager>
</template>

<script>
import { computed, h, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useAppSidePanel } from "../../../app/app-side-panel/app-side-panel.js";
import { MODEL_TYPE } from "../../../../../config/models.js";
import { useUser } from "../../../../../state/user.js";
import { segregateBySource } from "../../../../../utils/models.js";
// Components
import GenericModelsManager from "../generic-models-manager/GenericModelsManager.vue";
import BuildingMakerPanel from "./BuildingMakerPanel.vue";
import MetaBuildingStructurePanel from "./MetaBuildingStructurePanel.vue";

const tabsDef = [
  { id: "upload" },
  { id: "metaBuildings" },
  { id: "archive" }
];

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
    const { openSidePanel, closeSidePanel } = useAppSidePanel();
    const { isProjectGuest } = useUser();

    const tabs = ref(tabsDef);
    const currentTab = ref(null);

    const openBuildingMaker = () => {
      openSidePanel("right", {
        component: {
          render() {
            return h(BuildingMakerPanel, {
              onClose: closeSidePanel,
              space: props.project.cloud,
              project: props.project,
            })
          }
        }
      });
    };

    const viewMetaBuilding = model => {
      openSidePanel("right", {
        component: {
          render() {
            return h(MetaBuildingStructurePanel, {
              onClose: closeSidePanel,
              space: props.project.cloud,
              project: props.project,
              model,
            })
          }
        }
      });
    };

    const editMetaBuilding = model => {
      openSidePanel("right", {
        component: {
          render() {
            return h(BuildingMakerPanel, {
              onClose: closeSidePanel,
              space: props.project.cloud,
              project: props.project,
              model,
            })
          }
        }
      });
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
      currentTab,
      placeholderBackground,
      tabs,
      // Methods
      editMetaBuilding,
      isProjectGuest,
      openBuildingMaker,
      viewMetaBuilding,
    };
  }
};
</script>

<style scoped lang="scss" src="./PDFManager.scss"></style>
