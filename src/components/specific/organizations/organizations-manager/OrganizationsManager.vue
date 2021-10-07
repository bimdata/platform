<template>
  <div class="organizations-manager">
    <transition name="fade" mode="out-in">
      <template v-if="showForm">
        <div class="organizations-manager__form">
          <OrganizationForm
            :organization="selectedOrganization"
            @close="closeForm"
            @close-panel="closePanel"
          />
        </div>
      </template>

      <template v-else-if="showSpaces">
        <div class="organizations-manager__spaces">
          <OrganizationSpacesManager
            :organization="selectedOrganization"
            @close="closeSpaces"
            @close-panel="closePanel"
          />
        </div>
      </template>

      <template v-else-if="showDeleteGuard">
        <div class="organizations-manager__delete-guard">
          <!-- <OrganizationDeleteGuard
            :organization="selectedOrganization"
            @close="closeDeleteGuard"
            @close-panel="closePanel"
          /> -->
        </div>
      </template>

      <template v-else>
        <div class="organizations-manager__list">
          <BIMDataButton outline radius color="primary" @click="openForm()">
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
            <transition-group name="list">
              <OrganizationCard
                v-for="orga in displayedOrganizations"
                :key="orga.id"
                :organization="orga"
                @click="openSpaces(orga)"
                @update="openForm(orga)"
                @delete="openDeleteGuard(orga)"
              />
            </transition-group>
          </div>
        </div>
      </template>
    </transition>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useListFilter } from "@/composables/list-filter.js";
import { useSidePanel } from "@/composables/side-panel.js";
// Components
import OrganizationCard from "@/components/specific/organizations/organization-card/OrganizationCard.vue";
// import OrganizationDeleteGuard from "@/components/specific/organizations/organization-delete-guard/OrganizationDeleteGuard.vue";
import OrganizationForm from "@/components/specific/organizations/organization-form/OrganizationForm.vue";
import OrganizationSpacesManager from "@/components/specific/organizations/organization-spaces-manager/OrganizationSpacesManager.vue";

export default {
  components: {
    OrganizationCard,
    // OrganizationDeleteGuard,
    OrganizationForm,
    OrganizationSpacesManager
  },
  props: {
    organizations: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const { closeSidePanel } = useSidePanel();

    const selectedOrganization = ref(null);

    const showForm = ref(false);
    const showSpaces = ref(false);
    const showDeleteGuard = ref(false);
    const reset = () => {
      selectedOrganization.value = null;
      showForm.value = false;
      showSpaces.value = false;
      showDeleteGuard.value = false;
    };

    const openForm = orga => {
      reset();
      selectedOrganization.value = orga;
      showForm.value = true;
    };

    const openSpaces = orga => {
      reset();
      selectedOrganization.value = orga;
      showSpaces.value = true;
    };

    const openDeleteGuard = orga => {
      reset();
      selectedOrganization.value = orga;
      showDeleteGuard.value = true;
    };

    const closePanel = () => {
      reset();
      closeSidePanel();
    };

    const { filteredList: displayedOrganizations, searchText } = useListFilter(
      computed(() => props.organizations),
      organization => organization.name
    );

    return {
      // References
      displayedOrganizations,
      searchText,
      selectedOrganization,
      showDeleteGuard,
      showForm,
      showSpaces,
      // Methods
      closeDeleteGuard: reset,
      closeForm: reset,
      closePanel,
      closeSpaces: reset,
      openDeleteGuard,
      openForm,
      openSpaces
    };
  }
};
</script>

<style scoped lang="scss" src="./OrganizationsManager.scss"></style>
