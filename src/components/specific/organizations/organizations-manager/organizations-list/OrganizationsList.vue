<template>
  <div class="organizations-list">
    <BIMDataButton outline radius color="primary" @click="open('form')">
      <BIMDataIcon name="plus" size="xxxs" margin="0 6px 0 0" />
      <span>{{ $t("OrganizationsList.createButtonText") }}</span>
    </BIMDataButton>

    <BIMDataText color="color-granite-light">
      {{ $t("OrganizationsList.explanationText") }}
    </BIMDataText>

    <BIMDataSearch
      width="100%"
      :placeholder="$t('OrganizationsList.searchInputPlaceholder')"
      v-model="searchText"
      clear
    />

    <div class="list-container">
      <transition-group name="list">
        <OrganizationCard
          v-for="orga in displayedOrganizations"
          :key="orga.id"
          :organization="orga"
          @click="open('spaces-list', orga)"
          @update="open('form', orga)"
          @delete="open('delete-guard', orga)"
        />
      </transition-group>
    </div>
  </div>
</template>

<script>
import { computed, inject } from "vue";
import { useListFilter } from "../../../../../composables/list-filter.js";
// Components
import OrganizationCard from "./organization-card/OrganizationCard.vue";

export default {
  components: {
    OrganizationCard
  },
  setup() {
    const localState = inject("localState");

    const open = (view, orga) => {
      localState.organization = orga;
      localState.currentView = view;
    };

    const { filteredList: displayedOrganizations, searchText } = useListFilter(
      computed(() => localState.organizations),
      organization => organization.name
    );

    return {
      // References
      displayedOrganizations,
      localState,
      searchText,
      // Methods
      open
    };
  }
};
</script>

<style scoped lang="scss" src="./OrganizationsList.scss"></style>
