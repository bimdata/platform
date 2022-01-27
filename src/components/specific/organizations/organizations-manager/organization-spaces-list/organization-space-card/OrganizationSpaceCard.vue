<template>
  <div
    class="organization-space-card"
    :style="{ cursor: hasAccess ? 'pointer' : 'normal' }"
    @click="goToSpaceBoard"
  >
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
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useSpaces } from "@/state/spaces.js";
import routeNames from "@/router/route-names.js";
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
  setup(props) {
    const { router } = useRouter();
    const { userSpaces } = useSpaces();

    const hasAccess = computed(() =>
      userSpaces.value.some(space => space.id === props.space.id)
    );

    const goToSpaceBoard = () => {
      if (hasAccess.value) {
        router.push({
          name: routeNames.goToSpaceBoard,
          params: {
            spaceID: props.space.id
          }
        });
      }
    };

    return {
      // References
      hasAccess,
      // Methods
      goToSpaceBoard
    };
  }
};
</script>

<style scoped lang="scss" src="./OrganizationSpaceCard.scss"></style>
