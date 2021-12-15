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
        <span class="models-manager__tab__count">
          <!-- TODO -->
          {{ models.length }}
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
          <component :is="currentTab.component" v-bind="$props" />
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
// Components
import DWGManager from "./dwg-manager/DWGManager.vue";
import IFCManager from "./ifc-manager/IFCManager.vue";
import PDFManager from "./pdf-manager/PDFManager.vue";
import PTCManager from "./ptc-manager/PTCManager.vue";

const tabsDef = [
  { id: "dwg", label: "DWG", component: "DWGManager" },
  { id: "ifc", label: "IFC", component: "IFCManager" },
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
  setup() {
    const tabs = ref(tabsDef);
    const currentTab = ref(tabsDef[0]);

    const selectTab = tab => {
      currentTab.value = tab;
    };

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

<style scoped lang="scss" src="./ModelsManagerV2.scss"></style>
