<template>
  <div class="organization-spaces-manager">
    <div class="organization-spaces-manager__header">
      <BIMDataButton ghost radius :disabled="loading" @click="close">
        <BIMDataIcon name="arrow" size="xxs" margin="0 6px 0 0" />
        <span>{{ $t("OrganizationSpacesManager.backButtonText") }}</span>
      </BIMDataButton>
      <TextBox :text="organization.name" :maxLength="24" />
      <BIMDataButton ghost rounded icon :disabled="loading" @click="closePanel">
        <BIMDataIcon name="close" size="xxs" fill color="tertiary-dark" />
      </BIMDataButton>
    </div>

    <div class="organization-spaces-manager__content">
      <div class="actions-container">
        <BIMDataButton width="48%" color="primary" outline radius>
          {{ $t("OrganizationSpacesManager.importButtonText") }}
        </BIMDataButton>
        <BIMDataButton width="48%" color="secondary" fill radius>
          <BIMDataIcon name="plus" size="xxxs" margin="0 6px 0 0" />
          <span>{{ $t("OrganizationSpacesManager.addButtonText") }}</span>
        </BIMDataButton>
      </div>
      <BIMDataSearch
        width="100%"
        :placeholder="$t('OrganizationSpacesManager.searchInputPlaceholder')"
        v-model="searchText"
        clear
      />
      <div class="list-title">
        {{ $t("OrganizationSpacesManager.spaceListTitle") }}
      </div>
      <div class="list-container">
        <transition-group name="list">
          <OrganizationSpaceCard
            v-for="space of displayedSpaces"
            :key="space.id"
            :organization="organization"
            :space="space"
          />
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useListFilter } from "@/composables/list-filter.js";
import { useOrganizations } from "@/state/organizations.js";
// Components
import OrganizationSpaceCard from "@/components/specific/organizations/organization-space-card/OrganizationSpaceCard.vue";

export default {
  components: {
    OrganizationSpaceCard
  },
  props: {
    organization: {
      type: Object,
      required: true
    }
  },
  emits: ["close", "close-panel"],
  setup(props, { emit }) {
    const { getOrganizationSpaces } = useOrganizations();

    const loading = ref(false);

    const reset = () => {
      loading.value = false;
    };
    const close = () => {
      reset();
      emit("close");
    };
    const closePanel = () => {
      reset();
      emit("close-panel");
    };

    const { filteredList: displayedSpaces, searchText } = useListFilter(
      computed(() => getOrganizationSpaces(props.organization)),
      space => space.name
    );

    return {
      // References
      displayedSpaces,
      loading,
      searchText,
      // Methods
      close,
      closePanel
    };
  }
};
</script>

<style scoped lang="scss" src="./OrganizationSpacesManager.scss"></style>
