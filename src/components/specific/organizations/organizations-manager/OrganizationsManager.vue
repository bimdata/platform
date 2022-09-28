<template>
  <div class="organizations-manager">
    <div
      v-show="localState.currentView !== 'list'"
      class="organizations-manager__header"
    >
      <BIMDataButton ghost radius :disabled="localState.loading" @click="back">
        <BIMDataIcon name="arrow" size="xxs" margin="0 6px 0 0" />
        <span>{{ $t("OrganizationsManager.backButtonText") }}</span>
      </BIMDataButton>
      <BIMDataTextbox
        v-if="localState.organization"
        maxWidth="260px"
        :text="localState.organization.name"
      />
      <BIMDataButton
        ghost
        rounded
        icon
        :disabled="localState.loading"
        @click="close"
      >
        <BIMDataIcon name="close" size="xxs" fill color="granite-light" />
      </BIMDataButton>
    </div>

    <transition name="fade">
      <div v-show="localState.loading" class="organizations-manager__loader">
        <BIMDataSpinner />
      </div>
    </transition>

    <transition name="fade" mode="out-in">
      <component :is="currentView" />
    </transition>
  </div>
</template>

<script>
import { computed, provide, reactive, watch } from "vue";
import { useAppSidePanel } from "../../app/app-side-panel/app-side-panel.js";
// Components
import OrganizationDeleteGuard from "./organization-delete-guard/OrganizationDeleteGuard.vue";
import OrganizationForm from "./organization-form/OrganizationForm.vue";
import OrganizationsList from "./organizations-list/OrganizationsList.vue";
import OrganizationSpacesImport from "./organization-spaces-import/OrganizationSpacesImport.vue";
import OrganizationSpacesList from "./organization-spaces-list/OrganizationSpacesList.vue";

const localViews = {
  list: "OrganizationsList",
  form: "OrganizationForm",
  "delete-guard": "OrganizationDeleteGuard",
  "spaces-list": "OrganizationSpacesList",
  "spaces-import": "OrganizationSpacesImport"
};

export default {
  components: {
    OrganizationDeleteGuard,
    OrganizationForm,
    OrganizationsList,
    OrganizationSpacesImport,
    OrganizationSpacesList
  },
  props: {
    organizations: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const { closeSidePanel } = useAppSidePanel();

    const localState = reactive({
      organizations: [],
      organization: null,
      currentView: "list",
      loading: false
    });

    const currentView = computed(() => localViews[localState.currentView]);

    provide("localState", localState);

    watch(
      () => props.organizations,
      () => (localState.organizations = props.organizations),
      { immediate: true }
    );

    const reset = () => {
      localState.organization = null;
      localState.currentView = "list";
      localState.loading = false;
    };

    const back = () => {
      if (localState.currentView === "spaces-import") {
        localState.currentView = "spaces-list";
      } else {
        reset();
      }
    };

    const close = () => {
      reset();
      closeSidePanel();
    };

    return {
      // References
      currentView,
      localState,
      // Methods
      back,
      close,
      open
    };
  }
};
</script>

<style scoped lang="scss" src="./OrganizationsManager.scss"></style>
