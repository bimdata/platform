<template>
  <div class="organization-space-card">
    <div class="organization-space-card__image">
      <SpaceCardImage :space="space" />
    </div>
    <div class="organization-space-card__info">
      <div class="organization-space-card__info__name">
        <TextBox :text="space.name" :maxLength="36" />
      </div>
      <div class="organization-space-card__info__data">
        <!-- <span class="organization-space-card__info__data--projects">
          {{
            $t("OrganizationSpaceCard.projects", { number: projects.length })
          }}
        </span> -->
        <span class="organization-space-card__info__data--date">
          {{ formatDate(space.created_at) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { formatDateShort } from "@/utils/date.js";
// Components
import SpaceCardImage from "@/components/specific/spaces/space-card/space-card-image/SpaceCardImage.vue";

export default {
  components: {
    SpaceCardImage
  },
  props: {
    organization: {
      type: Object,
      required: true
    },
    space: {
      type: Object,
      required: true
    }
  },
  setup() {
    const projects = ref([]);

    return {
      // References
      projects,
      // Methods
      formatDate: formatDateShort
    };
  }
};
</script>

<style scoped lang="scss" src="./OrganizationSpaceCard.scss"></style>
