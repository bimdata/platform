<template>
  <div class="organization-space-card">
    <div class="organization-space-card__image">
      <SpaceCardImage :space="space" />
    </div>
    <div class="organization-space-card__info">
      <div class="organization-space-card__info__name">
        <BIMDataTextBox maxWidth="260px" :text="space.name" />
      </div>
      <div class="organization-space-card__info__data">
        <span class="organization-space-card__info__data--date">
          {{ $d(space.created_at || space.createdAt, "short") }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
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
      projects
    };
  }
};
</script>

<style scoped lang="scss" src="./OrganizationSpaceCard.scss"></style>
