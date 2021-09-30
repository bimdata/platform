<template>
  <div class="organizations-manager">
    <BIMDataButton outline radius color="primary" @click="() => {}">
      <BIMDataIcon name="plus" size="xxxs" margin="0 6px 0 0" />
      <span>{{ $t("OrganizationsManager.createButtonText") }}</span>
    </BIMDataButton>

    <!-- <BIMDataText color="color-tertiary-dark"> -->
    <p class="color-tertiary-dark">
      {{ $t("OrganizationsManager.explanationText") }}
    </p>
    <!-- </BIMDataText> -->

    <BIMDataSearch
      width="100%"
      :placeholder="$t('OrganizationsManager.searchInputPlaceholder')"
      v-model="searchText"
      clear
    />

    <div class="list-container">
      <OrganizationCard
        v-for="orga in displayedOrganizations"
        :key="orga.id"
        :organization="orga"
      />
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useListFilter } from "@/composables/list-filter.js";
// Components
import OrganizationCard from "@/components/specific/organizations/organization-card/OrganizationCard.vue";

export default {
  components: {
    OrganizationCard
  },
  props: {
    organizations: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const { filteredList: displayedOrganizations, searchText } = useListFilter(
      computed(() => props.organizations),
      organization => organization.name
    );

    return {
      // References
      displayedOrganizations,
      searchText
    };
  }
};
</script>

<style scoped lang="scss" src="./OrganizationsManager.scss"></style>
