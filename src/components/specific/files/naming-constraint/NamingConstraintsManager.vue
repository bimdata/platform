<template>
  <div class="naming-constraints-manager">
    <div class="naming-constraints-manager__header">
      <BIMDataButton
        v-if="showBack"
        class="naming-constraints-manager__header__back"
        ghost
        rounded
        icon
        :disabled="localState.loading"
        @click="back"
      >
        <BIMDataIconChevron :rotate="180" size="xxs" fill color="granite" />
      </BIMDataButton>
      <BIMDataIconNamingConvention v-else size="s" fill color="primary" />

      <span class="naming-constraints-manager__header__title">
        {{ $t("NamingConstraint.managerTitle") }}
      </span>

      <BIMDataButton ghost rounded icon @click="closeSidePanel()">
        <BIMDataIconClose size="xxs" fill color="granite-light" />
      </BIMDataButton>
    </div>

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
    const { closeSidePanel } = useAppSidePanel();
    const { loadNamingConstraints, loadNamingPartsTemplates } = useNamingConstraints();

    const localState = reactive({
      project: props.project,
      constraints: [],
      templates: [],
      constraint: null,
      template: null,
      currentView: "constraints-list",
      loading: false,
    });

    provide("localState", localState);

    const currentComponent = computed(() => components[localState.currentView]);

    const showBack = computed(() => localState.currentView !== "constraints-list");

    const back = () => {
      if (localState.currentView === "constraint-form") {
        localState.constraint = null;
        localState.currentView = "constraints-list";
      } else if (localState.currentView === "template-form") {
        localState.template = null;
        localState.currentView = "templates-list";
      } else {
        localState.currentView = "constraints-list";
      }
    };

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
      // Methods
      back,
      closeSidePanel,
    };
  },
};
</script>

<style scoped src="./NamingConstraintsManager.css"></style>
