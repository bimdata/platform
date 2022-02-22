<template>
  <div class="models-manager">
    <div class="models-manager__head">
      <template v-for="tab of tabs" :key="tab.id">
        <div
          v-if="tab.displayed"
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
              <span>{{ `.${tab.id}` }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="models-manager__body">
      <transition name="fade" mode="out-in">
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
import { useToggle } from "@/composables/toggle.js";
import { segregateByType } from "@/utils/models.js";
// Components
import DWGManager from "./dwg-manager/DWGManager.vue";
import IFCManager from "./ifc-manager/IFCManager.vue";
import PDFManager from "./pdf-manager/PDFManager.vue";

const tabsDef = [
  { id: "ifc", label: "IFC", component: "IFCManager" },
  { id: "dwg", label: "DWG", component: "DWGManager" },
  { id: "pdf", label: "PDF", component: "PDFManager" }
];

export default {
  components: {
    DWGManager,
    IFCManager,
    PDFManager
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
          models: modelsByType[tab.id] || [],
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
      toggleMenu
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelsManager.scss"></style>
