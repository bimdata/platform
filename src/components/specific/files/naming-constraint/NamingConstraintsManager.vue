<template>
  <div class="naming-constraints-manager">
    <div class="naming-constraints-manager__header">
      <div class="naming-constraints-manager__header__icon">
        <BIMDataButton
          v-if="showBack"
          class="naming-constraints-manager__header__back"
          ghost
          radius
          icon
          :disabled="localState.loading"
          @click="back"
        >
          <BIMDataIconChevron :rotate="180" size="xxs" fill color="granite" margin="0 6px 0 0" />
          {{ $t("t.back") }}
        </BIMDataButton>
        <BIMDataIconNamingConvention v-else size="s" fill color="primary" />
      </div>

      <span class="naming-constraints-manager__header__title">
        {{ $t("NamingConstraint.managerTitle") }}
      </span>

      <BIMDataButton ghost rounded icon @click="closeSidePanel()">
        <BIMDataIconClose size="xxs" fill color="granite-light" />
      </BIMDataButton>
    </div>

    <BIMDataTabs
      class="m-t-24"
      v-if="localState.currentView === 'list'"
      :tabs="tabs"
      width="100%"
      tabSize="50%"
      height="40px"
      :selected="localState.currentTab"
      @tab-selected="localState.currentTab = $event.id"
    >
      <template #tab="{ tab }">
        <BIMDataIcon :name="tab.icon" size="xs" margin="0 6px 0 0" />
        <span>{{ tab.label }}</span>
      </template>
    </BIMDataTabs>

    <div class="naming-constraints-manager__content">
      <transition name="fade">
        <div v-show="localState.loading" class="naming-constraints-manager__loader">
          <BIMDataSpinner />
        </div>
      </transition>

      <transition name="fade" mode="out-in">
        <component :is="currentComponent" />
      </transition>
    </div>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
import { computed, onMounted, provide, reactive } from "vue";
import { useNamingConstraints } from "../../../../state/naming-constraints.js";
import { useAppSidePanel } from "../../app/app-side-panel/app-side-panel.js";
// Components
import NamingConstraintForm from "./naming-constraint-form/NamingConstraintForm.vue";
import NamingConstraintsList from "./naming-constraints-list/NamingConstraintsList.vue";
import NamingPartsTemplateForm from "./naming-parts-template-form/NamingPartsTemplateForm.vue";
import NamingPartsTemplatesList from "./naming-parts-templates-list/NamingPartsTemplatesList.vue";

const components = {
  "constraints-list": "NamingConstraintsList",
  "constraint-form": "NamingConstraintForm",
  "templates-list": "NamingPartsTemplatesList",
  "template-form": "NamingPartsTemplateForm",
};

export default {
  components: {
    NamingConstraintForm,
    NamingConstraintsList,
    NamingPartsTemplateForm,
    NamingPartsTemplatesList,
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n();
    const { closeSidePanel } = useAppSidePanel();
    const { loadNamingConstraints, loadNamingPartsTemplates } = useNamingConstraints();

    const localState = reactive({
      project: props.project,
      constraints: [],
      templates: [],
      constraint: null,
      template: null,
      currentTab: "constraints", // constraints | templates
      currentView: "list", // list | form
      loading: false,
    });

    provide("localState", localState);

    const currentComponent = computed(() => {
      if (localState.currentView === "form") {
        return localState.currentTab === "constraints"
          ? "NamingConstraintForm"
          : "NamingPartsTemplateForm";
      }

      return localState.currentTab === "constraints"
        ? "NamingConstraintsList"
        : "NamingPartsTemplatesList";
    });

    const showBack = computed(() => localState.currentView !== "constraints-list");

    const back = () => {
      localState.constraint = null;
      localState.template = null;
      localState.currentView = "list";
    };

    const tabs = computed(() => [
      {
        id: "constraints",
        label: t("NamingConstraint.constraintsTab"),
        icon: "Gavel",
      },
      {
        id: "templates",
        label: t("NamingConstraint.listsTab"),
        icon: "List",
      },
    ]);

    onMounted(async () => {
      try {
        localState.loading = true;
        const [constraints, templates] = await Promise.all([
          loadNamingConstraints(props.project),
          loadNamingPartsTemplates(props.project),
        ]);
        localState.constraints = constraints;
        localState.templates = templates;
      } finally {
        localState.loading = false;
      }
    });

    return {
      // References
      localState,
      currentComponent,
      showBack,
      tabs,
      // Methods
      back,
      closeSidePanel,
    };
  },
};
</script>

<style scoped src="./NamingConstraintsManager.css"></style>
