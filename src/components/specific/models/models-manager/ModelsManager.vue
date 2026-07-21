<template>
  <div class="models-manager">
    <div class="models-manager__head">
      <div class="models-manager__tabs">
        <template v-for="tab of tabs" :key="tab.id">
          <button
            v-if="tab.displayed"
            type="button"
            class="models-manager__tab"
            :class="{ 'models-manager__tab--active': tab.id === currentTab.id }"
            @click="selectTab(tab)"
          >
            <BIMDataIcon
              class="models-manager__tab__icon"
              :name="tab.icon"
              size="m"
            />
            <span v-if="!isMD" class="models-manager__tab__text">
              {{ tab.text }}
            </span>
            <span v-if="tab.beta" class="beta-badge">BETA</span>
            <span v-if="tab.models.length > 0" class="models-manager__tab__count">
              {{ tab.models.length }}
            </span>
          </button>
        </template>
      </div>

      <div class="models-manager__menu" v-click-away="closeMenu">
        <BIMDataButton ghost rounded icon @click="toggleMenu">
          <BIMDataIconEllipsis color="granite-light" size="m" :rotate="90" />
        </BIMDataButton>

        <BIMDataMenu
          v-show="showMenu"
          class="models-manager__menu__container"
          :menuItems="tabs"
          width="auto"
        >
          <template #item="{ item: tab }">
            <div
              class="models-manager__menu__item"
              :class="{ disabled: tab.models.length > 0 }"
            >
              <BIMDataCheckbox
                :disabled="tab.models.length > 0"
                :modelValue="tab.models.length > 0 || tab.displayed"
                @update:modelValue="tab.displayed = !tab.displayed"
                :text="tab.text"
              />
            </div>
          </template>
        </BIMDataMenu>
      </div>
    </div>

    <div class="models-manager__body">
      <transition name="fade" mode="out-in">
        <keep-alive>
          <component
            :key="currentTab.id"
            :is="currentTab.component"
            :project="project"
            :types="currentTab.modelTypes"
            :models="currentTab.models"
            @file-uploaded="$emit('file-uploaded')"
            @go-folders-view="$emit('go-folders-view', $event)"
          />
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, ref, watch } from "vue";
import { useStandardBreakpoints } from "../../../../composables/responsive.js";
import { useSession } from "../../../../composables/session.js";
import { useToggle } from "../../../../composables/toggle.js";
import { MODEL_CONFIG, MODEL_TYPE } from "../../../../config/models.js";
import { segregateByType } from "../../../../utils/models.js";
// Components
import DWGManager from "./dwg-manager/DWGManager.vue";
import IFCManager from "./ifc-manager/IFCManager.vue";
import PDFManager from "./pdf-manager/PDFManager.vue";
import PhotosphereManager from "./photosphere-manager/PhotosphereManager.vue";
import PointCloudManager from "./point-cloud-manager/PointCloudManager.vue";

const { DWG, DXF, IFC, JPEG, META_BUILDING, PDF, PHOTOSPHERE, PHOTOSPHERE_BUILDING, PNG, POINT_CLOUD } =
  MODEL_TYPE;

const tabsDef = [
  {
    id: "ifc",
    text: "IFC",
    icon: MODEL_CONFIG[IFC].icon,
    modelTypes: [IFC],
    component: "IFCManager"
  },
  {
    id: "dwg",
    text: "DWG",
    icon: MODEL_CONFIG[DWG].icon,
    modelTypes: [DWG],
    component: "DWGManager",
    beta: true
  },
  {
    id: "dxf",
    text: "DXF",
    icon: MODEL_CONFIG[DXF].icon,
    modelTypes: [DXF],
    component: "DWGManager",
    beta: true
  },
  {
    id: "pdf",
    text: "PDF",
    icon: MODEL_CONFIG[PDF].icon,
    modelTypes: [PDF, META_BUILDING],
    component: "PDFManager"
  },
  {
    id: "point-cloud",
    text: "Point Cloud",
    icon: MODEL_CONFIG[POINT_CLOUD].icon,
    modelTypes: [POINT_CLOUD],
    component: "PointCloudManager",
    beta: true
  },
  {
    id: "images",
    text: "Images",
    icon: "fileImagePolychrome",
    modelTypes: [JPEG, PNG],
    component: "DWGManager"
  },
  {
    id: "photosphere",
    text: "Photosphere",
    icon: "filePhotospherePolychrome",
    modelTypes: [PHOTOSPHERE, PHOTOSPHERE_BUILDING],
    component: "PhotosphereManager"
  }
];

export default {
  components: {
    DWGManager,
    IFCManager,
    PDFManager,
    PhotosphereManager,
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
  emits: ["file-uploaded", "go-folders-view"],
  setup(props) {
    const { projectModelTab } = useSession();
    const {
      isOpen: showMenu,
      close: closeMenu,
      toggle: toggleMenu
    } = useToggle();

    const tabs = ref([]);
    const currentTab = ref({});

    const selectTab = tab => {
      projectModelTab.set(props.project.id, tab.id);
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

    onBeforeMount(() => {
      // Look for current model tab from session storage
      const tabId = projectModelTab.get(props.project.id);
      const tab = tabs.value.find(t => t.id === tabId);
      if (tab) selectTab(tab);
    });

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
