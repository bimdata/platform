<template>
  <AppLink
    data-test-id="space-card"
    :data-test-param="space.id"
    :to="{ name: routeNames.spaceBoard, params: { spaceID: space.id } }"
  >
    <BIMDataCard class="space-card" border-radius="13px">
      <template #right>
        <SpaceCardActionMenu v-if="actionMenu" :space="space" />
      </template>
      <template #content>
        <div v-if="isFreeSpace(space)" class="free-badge">
          {{ $t("SpaceCard.free") }}
        </div>
        <FavoriteBadge v-if="isFavoriteSpace(space)" />
        <SpaceCardImage :space="space" />
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
            {{ projectsCount[space.id] }}
          </div>
        </div>
        <div
          class="stripe"
          :style="{
            backgroundColor: stripeColor,
            width: '20px',
            height: '20px',
            borderRadius: '50%',
          }"
        ></div>
      </template>
    </BIMDataCard>
  </AppLink>
</template>

<script setup>
import seedrandom from "seedrandom";
import colors from "./space-card-image/colors.js";
import routeNames from "../../../../router/route-names.js";
import { useProjects } from "../../../../state/projects.js";
import { useSpaces } from "../../../../state/spaces.js";
import { useUser } from "../../../../state/user.js";
// Components
import AppLink from "../../app/app-link/AppLink.vue";
import FavoriteBadge from "../../../generic/favorite-badge/FavoriteBadge.vue";
import SpaceCardActionMenu from "./space-card-action-menu/SpaceCardActionMenu.vue";
import SpaceCardImage from "./space-card-image/SpaceCardImage.vue";

const props = defineProps({
  space: {
    type: Object,
    required: true,
  },
  actionMenu: {
    type: Boolean,
    default: true,
  },
});

const { isFavoriteSpace } = useUser();
const { isFreeSpace } = useSpaces();
const { projectsCount } = useProjects();

const rng = seedrandom(props.space.id.toString());
const randomNumber = (n) => Math.abs(rng.int32()) % n;
const svgColors = colors[randomNumber(colors.length)];
const svgColorCodes = Object.values(svgColors);
const stripeColor = svgColorCodes[randomNumber(svgColorCodes.length)];
</script>

<style scoped src="./SpaceCard.css"></style>
