<template>
  <AppLink
    :to="{
      name: routeNames.spaceBoard,
      params: {
        spaceID: space.id
      }
    }"
  >
    <div
      class="organization-space-card"
      :style="{ cursor: hasAccess ? 'pointer' : 'default' }"
    >
      <div class="organization-space-card__image">
        <SpaceCardImage :space="space" />
      </div>
      <div class="organization-space-card__info">
        <div class="organization-space-card__info__name">
          <BIMDataTextbox maxWidth="260px" :text="space.name" />
        </div>
        <div class="organization-space-card__info__data">
          <span class="organization-space-card__info__data--date">
            {{ $d(space.created_at || space.createdAt, "short") }}
          </span>
        </div>
      </div>
    </div>
  </AppLink>
</template>

<script>
import { computed } from "vue";
import { useSpaces } from "@/state/spaces.js";
import routeNames from "@/router/route-names.js";
// Components
import AppLink from "@/components/specific/app/app-link/AppLink.vue";
import SpaceCardImage from "@/components/specific/spaces/space-card/space-card-image/SpaceCardImage.vue";

export default {
  components: {
    AppLink,
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
  setup(props) {
    const { userSpaces } = useSpaces();

    const hasAccess = computed(() =>
      userSpaces.value.some(space => space.id === props.space.id)
    );

    return {
      // References
      hasAccess,
      routeNames
    };
  }
};
</script>

<style scoped lang="scss" src="./OrganizationSpaceCard.scss"></style>
