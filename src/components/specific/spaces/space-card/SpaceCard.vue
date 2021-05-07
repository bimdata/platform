<template>
  <BIMDataCard
    data-test="space-card"
    class="space-card"
    @click="goToSpaceBoard"
  >
    <template #right>
      <SpaceCardActionMenu v-if="actionMenu && space.isAdmin" :space="space" />
    </template>
    <template #content>
      <SpaceCardImage :space="space" />
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
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { routeNames } from "@/router";
import { useProjects } from "@/state/projects";
// Components
import BIMDataCard from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCard.js";
import TextBox from "@/components/generic/text-box/TextBox";
import SpaceCardActionMenu from "./space-card-action-menu/SpaceCardActionMenu";
import SpaceCardImage from "./space-card-image/SpaceCardImage";

export default {
  components: {
    BIMDataCard,
    TextBox,
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

    const nbProjects = ref(0);
    watchEffect(() => {
      nbProjects.value = userProjects.value.filter(
        p => p.cloud.id === props.space.id
      ).length;
    });

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
