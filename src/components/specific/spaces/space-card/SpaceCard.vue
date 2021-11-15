<template>
  <BIMDataCard
    :data-test="`space-card space-card-${space.id}`"
    class="space-card"
    @click="goToSpaceBoard"
  >
    <template #right>
      <SpaceCardActionMenu v-if="actionMenu && space.isAdmin" :space="space" />
    </template>
    <template #content>
      <div v-if="space.isFree" class="free-badge">
        {{ $t("SpaceCard.free") }}
      </div>
      <SpaceCardImage :space="space" topStripe />
    </template>
    <template #footer>
      <TextBox :text="space.name" :maxLength="30" />
      <div class="title-underline"></div>
      <div class="sub-title">
        <div class="sub-title__text">{{ $t("SpaceCard.projects") }}</div>
        <div class="sub-title__number">{{ nbProjects }}</div>
      </div>
    </template>
  </BIMDataCard>
</template>

<script>
import { computed } from "vue";
import { useRouter } from "vue-router";
import routeNames from "@/router/route-names.js";
import { useProjects } from "@/state/projects";
// Components
import SpaceCardActionMenu from "./space-card-action-menu/SpaceCardActionMenu";
import SpaceCardImage from "./space-card-image/SpaceCardImage";

export default {
  components: {
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
    const router = useRouter();
    const { userProjects } = useProjects();

    const nbProjects = computed(
      () => userProjects.value.filter(p => p.cloud.id === props.space.id).length
    );

    const goToSpaceBoard = () => {
      router.push({
        name: routeNames.spaceBoard,
        params: { spaceID: props.space.id }
      });
    };

    return {
      // References
      nbProjects,
      // Methods
      goToSpaceBoard
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceCard.scss"></style>
