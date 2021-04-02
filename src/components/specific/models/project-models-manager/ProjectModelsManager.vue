<template>
  <BIMDataCard
    class="project-models-manager"
    :titleHeader="$t('ProjectBoard.ProjectModelsManager.title')"
  >
    <template #content>
      <BIMDataTabs
        width="100%"
        height="44px"
        tabSize="180px"
        :tabs="tabs"
        selected="ifc"
        @tab-click="selectTab"
      />

      <ModelsActionBar
        class="project-models-manager__action-bar"
        :style="{ visibility: selection.length > 0 ? 'visible' : 'hidden' }"
        @archive-clicked="() => {}"
        @delete-clicked="() => {}"
        @download-clicked="() => {}"
        @merge-clicked="() => {}"
      />

      <ModelsManagerTable
        :project="project"
        :models="displayedModels"
        @archive-clicked="() => {}"
        @delete-clicked="() => {}"
        @download-clicked="() => {}"
        @selection-changed="setSelection"
      />
    </template>
  </BIMDataCard>
</template>

<script>
import { reactive, ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useModels } from "@/state/models";
import { MODEL_SOURCE } from "@/utils/models";
// Components
import BIMDataCard from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCard.js";
import BIMDataTabs from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataTabs.js";
import ModelsActionBar from "@/components/specific/models/models-action-bar/ModelsActionBar";
import ModelsManagerTable from "@/components/specific/models/models-manager-table/ModelsManagerTable";

export default {
  components: {
    BIMDataCard,
    BIMDataTabs,
    ModelsActionBar,
    ModelsManagerTable
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
    const { t } = useI18n();
    const { updateModels, deleteModels } = useModels();

    const tabs = ref([]);
    const currentTab = ref("ifc");
    watchEffect(() => {
      tabs.value = [
        {
          id: "ifc",
          label: t("ProjectBoard.ProjectModelsManager.tabs.ifc")
        },
        {
          id: "split",
          label: t("ProjectBoard.ProjectModelsManager.tabs.split")
        },
        {
          id: "merge",
          label: t("ProjectBoard.ProjectModelsManager.tabs.merge")
        },
        {
          id: "archive",
          label: t("ProjectBoard.ProjectModelsManager.tabs.archive")
        }
      ];
    });
    const selectTab = tab => {
      currentTab.value = tab.id;
    };

    const models = reactive({
      ifc: [],
      merge: [],
      split: [],
      archive: []
    });
    watch(
      () => props.models,
      () => {
        models.ifc = props.models.filter(model =>
          [MODEL_SOURCE.UPLOAD, MODEL_SOURCE.OPTIMIZED].includes(model.source)
        );
        models.merge = props.models.filter(
          model => model.source === MODEL_SOURCE.MERGE
        );
        models.split = props.models.filter(model =>
          [MODEL_SOURCE.SPLIT, MODEL_SOURCE.EXPORT].includes(model.source)
        );
        models.archive = props.models.filter(model => model.archived);
      },
      { immediate: true }
    );

    const displayedModels = ref([]);
    watchEffect(() => {
      displayedModels.value = models[currentTab.value];
    });

    const selection = ref([]);
    const setSelection = models => {
      selection.value = models;
    };

    const removeModels = models => {};

    const archiveModels = models => {};

    const downloadModels = models => {};

    const mergeModels = models => {};

    return {
      // References
      displayedModels,
      selection,
      tabs,
      // Methods
      selectTab,
      setSelection
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectModelsManager.scss"></style>
