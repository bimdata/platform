<template>
  <AppLink
    data-test-id="space-card"
    :data-test-param="space.id"
    :to="{ name: routeNames.spaceBoard, params: { spaceID: space.id } }"
  >
    <BIMDataCard class="space-card">
      <template #right>
        <SpaceCardActionMenu
          v-if="actionMenu && space.isAdmin"
          :space="space"
        />
      </template>
      <template #content>
        <div v-if="space.isFree" class="free-badge">
          {{ $t("SpaceCard.free") }}
        </div>
        <SpaceCardImage :space="space" topStripe />
      </template>
      <template #footer>
        <div class="space-card__title">
          <BIMDataTextbox :text="space.name" />
        </div>
        <div class="space-card__title-underline"></div>
        <div class="space-card__sub-title">
          <div class="space-card__sub-title__text">
            {{ $t("SpaceCard.projects") }}
          </div>
          <div class="space-card__sub-title__number">
            {{ nbProjects }}
          </div>
        </div>
      </template>
    </BIMDataCard>
  </AppLink>
</template>

<script>
import { computed } from "vue";
import routeNames from "../../../../router/route-names.js";
import { useProjects } from "../../../../state/projects.js";
// Components
import AppLink from "../../app/app-link/AppLink.vue";
import SpaceCardActionMenu from "./space-card-action-menu/SpaceCardActionMenu.vue";
import SpaceCardImage from "./space-card-image/SpaceCardImage.vue";

export default {
  components: {
    AppLink,
    SpaceCardActionMenu,
    SpaceCardImage
  },
  props: {
    space: {
      type: Object,
      required: true
    },
    actionMenu: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const { projectsBySpace } = useProjects();

    const nbProjects = computed(
      () => projectsBySpace.value[props.space.id]?.length ?? 0
    );

    return {
      // References
      nbProjects,
      routeNames
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceCard.scss"></style>
