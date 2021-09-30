<template>
  <div class="organization-card">
    <div class="organization-card__image">
      <img :src="organization.logo" />
    </div>
    <div class="organization-card__info">
      <div class="organization-card__info__name">
        {{ organization.name }}
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
    <div class="organization-card__action">
      <BIMDataButton ghost rounded icon @click="() => {}">
        <BIMDataIcon name="ellipsis" size="l" fill color="tertiary-dark" />
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useOrganizations } from "@/state/organizations.js";
import { formatDate } from "@/utils/date.js";

export default {
  props: {
    organization: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { getOrganizationSpaces } = useOrganizations();

    const spaces = ref([]);
    spaces.value = getOrganizationSpaces(props.organization);

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
