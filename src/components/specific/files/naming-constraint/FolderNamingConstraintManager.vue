<template>
  <div class="naming-constraint-manager">
    <div class="naming-constraint-manager__header">
      <BIMDataButton
        v-if="showBack"
        class="naming-constraint-manager__header__back"
        ghost
        rounded
        icon
        :disabled="localState.loading"
        @click="back"
      >
        <BIMDataIconChevron :rotate="270" size="xxs" fill color="granite" />
      </BIMDataButton>
      <BIMDataIconNamingConvention v-else size="s" fill color="primary" />

      <span class="naming-constraint-manager__header__title">
        {{ $t("NamingConstraint.managerTitle") }}
      </span>

      <BIMDataButton ghost rounded icon @click="closeSidePanel()">
        <BIMDataIconClose size="xxs" fill color="granite-light" />
      </BIMDataButton>
    </div>

    <div class="naming-constraint-manager__content m-t-12">
      <transition name="fade">
        <div v-show="localState.loading" class="naming-constraint-manager__loader">
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
import FolderNamingConstraintSelector from "./folder-naming-constraint-selector/FolderNamingConstraintSelector.vue";
import NamingConstraintForm from "./naming-constraint-form/NamingConstraintForm.vue";

const components = {
  "folder-rule": "FolderNamingConstraintSelector",
  "constraint-form": "NamingConstraintForm",
};

export default {
  components: {
    FolderNamingConstraintSelector,
    NamingConstraintForm,
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
    folder: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { closeSidePanel } = useAppSidePanel();
    const { loadNamingConstraints, loadNamingPartsTemplates, fetchFolderNamingConstraint } =
      useNamingConstraints();

    const localState = reactive({
      project: props.project,
      folder: props.folder,
      constraints: [],
      templates: [],
      constraint: null,
      currentView: "folder-rule",
      listView: "folder-rule",
      selectedConstraintId: null,
      recursive: false,
      loading: false,
    });

    provide("localState", localState);

    const currentComponent = computed(() => components[localState.currentView]);

    const showBack = computed(() => localState.currentView !== "folder-rule");

    const back = () => {
      localState.constraint = null;
      localState.currentView = "folder-rule";
    };

    onMounted(async () => {
      try {
        localState.loading = true;
        const [constraints, templates, folderRule] = await Promise.all([
          loadNamingConstraints(props.project),
          loadNamingPartsTemplates(props.project),
          fetchFolderNamingConstraint(props.project, props.folder),
        ]);
        localState.constraints = constraints;
        localState.templates = templates;
        if (folderRule) {
          localState.selectedConstraintId = folderRule.constraint?.id ?? null;
          localState.recursive = !!folderRule.recursive;
        }
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

<style scoped src="./NamingConstraintManagerCommon.css"></style>
