<template>
  <div class="models-manager">
    <div class="models-manager__head">
      <div
        v-for="tab of tabs"
        :key="tab.id"
        class="models-manager__tab"
        :class="{ selected: tab.id === currentTab.id }"
        @click="selectTab(tab)"
      >
        <span class="models-manager__tab__icon">
          <img :src="`/static/${tab.id}-file.svg`" />
        </span>
        <span class="models-manager__tab__text">
          {{ tab.label }}
        </span>
        <span class="models-manager__tab__count" v-if="tab.models.length > 0">
          {{ tab.models.length }}
        </span>
      </div>

      <BIMDataButton>
        <BIMDataIcon
          name="ellipsis"
          size="l"
          fill
          color="granite-light"
          :rotate="90"
        />
      </BIMDataButton>
    </div>
    <div class="models-manager__body">
      <transition name="fade">
        <keep-alive>
          <component
            :is="currentTab.component"
            :project="project"
            :models="currentTab.models"
          />
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
// Components
import DWGManager from "./dwg-manager/DWGManager.vue";
import IFCManager from "./ifc-manager/IFCManager.vue";
import PDFManager from "./pdf-manager/PDFManager.vue";
import PTCManager from "./ptc-manager/PTCManager.vue";

const tabsDef = [
  { id: "ifc", label: "IFC", component: "IFCManager" },
  { id: "dwg", label: "DWG", component: "DWGManager" },
  { id: "pdf", label: "PDF", component: "PDFManager" },
  { id: "ptc", label: "Point Cloud", component: "PTCManager" }
];

export default {
  components: {
    DWGManager,
    IFCManager,
    PDFManager,
    PTCManager
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
    const tabs = ref([]);
    const currentTab = ref({});

    const selectTab = tab => {
      currentTab.value = tab;
    };

    watch(
      () => props.models,
      models => {
        tabs.value = tabsDef.map(tab => ({
          ...tab,
          // TODO: set models for each tab based on type
          models: tab.id === "ifc" ? models : []
        }));
        currentTab.value = tabs.value[0];
      },
      { immediate: true }
    );

    return {
      // References
      currentTab,
      tabs,
      // Methods
      selectTab
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelsManager.scss"></style>
