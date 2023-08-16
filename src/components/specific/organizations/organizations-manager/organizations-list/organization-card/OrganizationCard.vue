<template>
  <div class="organization-card">
    <div class="organization-card__image">
      <img v-if="organization.logo" :src="organization.logo" />
      <BIMDataIconOrganization v-else margin="4px 0 0 3px" size="xxl" />
    </div>
    <div class="organization-card__info">
      <div class="organization-card__info__name">
        <BIMDataTextbox maxWidth="220px" :text="organization.name" />
      </div>
      <div class="organization-card__info__data">
        <span class="organization-card__info__data--spaces">
          {{ $t("OrganizationCard.spaces", { number: spaces.length }) }}
        </span>
        <span class="organization-card__info__data--date">
          {{ $d(organization.created_at, "short") }}
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
import { computed } from "vue";
import { useOrganizations } from "../../../../../../state/organizations.js";
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
    const { getOrganizationSpaces } = useOrganizations();

    const spaces = computed(() => getOrganizationSpaces(props.organization));

    return {
      // References
      spaces
    };
  }
};
</script>

<style scoped lang="scss" src="./OrganizationCard.scss"></style>
