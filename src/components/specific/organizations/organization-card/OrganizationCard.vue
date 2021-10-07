<template>
  <div class="organization-card">
    <div class="organization-card__image">
      <img :src="organization.logo" />
    </div>
    <div class="organization-card__info">
      <div class="organization-card__info__name">
        <TextBox :text="organization.name" :maxLength="32" />
      </div>
      <div class="organization-card__info__data">
        <span class="organization-card__info__data--spaces">
          {{ $t("OrganizationCard.spaces", { number: spaces.length }) }}
        </span>
        <span class="organization-card__info__data--date">
          {{ formatDate(organization.created_at) }}
        </span>
      </div>
    </div>
    <OrganizationCardActionMenu
      @click.stop="() => {}"
      @update="$emit('update')"
      @delete="$emit('delete')"
    />
  </div>
</template>

<script>
import { computed, onBeforeMount } from "vue";
import { useOrganizations } from "@/state/organizations.js";
import { formatDate } from "@/utils/date.js";
// Components
import OrganizationCardActionMenu from "./organization-card-action-menu/OrganizationCardActionMenu.vue";

export default {
  components: {
    OrganizationCardActionMenu
  },
  props: {
    organization: {
      type: Object,
      required: true
    }
  },
  emits: ["delete", "update"],
  setup(props) {
    const { getOrganizationSpaces, retrieveOrganizationSpaces } =
      useOrganizations();

    const spaces = computed(() => getOrganizationSpaces(props.organization));

    onBeforeMount(async () => {
      await retrieveOrganizationSpaces(props.organization);
    });

    return {
      // References
      spaces,
      // Methods
      formatDate
    };
  }
};
</script>

<style scoped lang="scss" src="./OrganizationCard.scss"></style>
