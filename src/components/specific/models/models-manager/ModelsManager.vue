<template>
  <div class="models-manager">
    <div class="models-manager__head">
      <template v-for="tab of tabs" :key="tab.id">
        <div
          v-if="tab.displayed"
          class="models-manager__tab"
          :class="{ selected: tab.id === currentTab.id }"
          :style="{ width: isLG ? 'auto' : '' }"
          @click="selectTab(tab)"
        >
          <span class="models-manager__tab__icon">
            <BIMDataIcon size="m" :name="tab.icon" />
          </span>
          <span v-if="!isMD" class="models-manager__tab__text">
            {{ tab.label }}
          </span>
          <span v-if="tab.beta" class="beta-badge">BETA</span>
          <span class="models-manager__tab__count" v-if="tab.models.length > 0">
            {{ tab.models.length }}
          </span>
        </div>
      </template>

      <div class="models-manager__menu" v-click-away="closeMenu">
        <BIMDataButton>
          <BIMDataIcon
            color="granite-light"
            name="ellipsis"
            size="l"
            fill
            :rotate="90"
            @click="toggleMenu"
          />
        </BIMDataButton>

        <div class="models-manager__menu__container" v-show="showMenu">
          <template v-for="tab of tabs" :key="tab.id">
            <div
              class="models-manager__menu__item"
              :class="{ disabled: tab.models.length > 0 }"
            >
              <BIMDataCheckbox
                :disabled="tab.models.length > 0"
                :modelValue="tab.models.length > 0 || tab.displayed"
                @update:modelValue="tab.displayed = !tab.displayed"
              />
              <span>{{ tab.label }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="models-manager__body">
      <transition name="fade" mode="out-in">
        <keep-alive>
          <component
            :key="currentTab.id"
            :is="currentTab.component"
            :project="project"
            :type="currentTab.type"
            :models="currentTab.models"
            @file-uploaded="$emit('file-uploaded')"
          />
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useStandardBreakpoints } from "../../../../composables/responsive.js";
import { useToggle } from "../../../../composables/toggle.js";
import { MODEL_TYPE, MODEL_ICON } from "../../../../config/models.js";
import { segregateByType } from "../../../../utils/models.js";
// Components
import DWGManager from "./dwg-manager/DWGManager.vue";
import IFCManager from "./ifc-manager/IFCManager.vue";
import PDFManager from "./pdf-manager/PDFManager.vue";
import PointCloudManager from "./point-cloud-manager/PointCloudManager.vue";

const tabsDef = [
  {
    id: "ifc",
    label: "IFC",
    icon: MODEL_ICON.IFC,
    type: MODEL_TYPE.IFC,
    modelTypes: [MODEL_TYPE.IFC],
    component: "IFCManager"
  },
  {
    id: "dwg",
    label: "DWG",
    icon: MODEL_ICON.DWG,
    type: MODEL_TYPE.DWG,
    modelTypes: [MODEL_TYPE.DWG],
    component: "DWGManager",
    beta: true
  },
  {
    id: "dxf",
    label: "DXF",
    icon: MODEL_ICON.DXF,
    type: MODEL_TYPE.DXF,
    modelTypes: [MODEL_TYPE.DXF],
    component: "DWGManager",
    beta: true
  },
  {
    id: "pdf",
    label: "PDF",
    icon: MODEL_ICON.PDF,
    type: MODEL_TYPE.PDF,
    modelTypes: [MODEL_TYPE.PDF, MODEL_TYPE.META_BUILDING],
    component: "PDFManager"
  },
  // TODO: uncomment when point-cloud is ready
  // {
  //   id: "point-cloud",
  //   label: "Point Cloud",
  //   icon: MODEL_ICON.POINT_CLOUD,
  //   type: MODEL_TYPE.POINT_CLOUD,
  //   modelTypes: [MODEL_TYPE.POINT_CLOUD],
  //   component: "PointCloudManager"
  // }
  {
    id: "photos",
    label: "Photos",
    icon: MODEL_ICON.PHOTOS,
    type: MODEL_TYPE.PHOTOS,
    modelTypes: [MODEL_TYPE.JPEG, MODEL_TYPE.PNG],
    component: "DWGManager"
  }
];

export default {
  components: {
    DWGManager,
    IFCManager,
    PDFManager,
    PointCloudManager
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
  emits: ["file-uploaded"],
  setup(props) {
    const {
      isOpen: showMenu,
      close: closeMenu,
      toggle: toggleMenu
    } = useToggle();

    const tabs = ref([]);
    const currentTab = ref({});

    const selectTab = tab => {
      currentTab.value = tab;
    };

    watch(
      () => props.models,
      models => {
        const modelsByType = segregateByType(models);
        tabs.value = tabsDef.map(tab => ({
          ...tab,
          models: tab.modelTypes.flatMap(type => modelsByType[type] || []),
          displayed: true
        }));
        currentTab.value =
          tabs.value.find(tab => tab.id === currentTab.value?.id) ||
          tabs.value[0];
      },
      { immediate: true }
    );

    return {
      // References
      currentTab,
      showMenu,
      tabs,
      // Methods
      closeMenu,
      selectTab,
      toggleMenu,
      // Responsive breakpoints
      ...useStandardBreakpoints()
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelsManager.scss"></style>
