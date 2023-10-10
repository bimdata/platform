<script setup>
import { computed } from "vue";
import routeNames from "../../../../../router/route-names.js";
import { useProjects } from "../../../../../state/projects.js";
import { useUser } from "../../../../../state/user.js";
// Components
import AppLink from "../../../app/app-link/AppLink.vue";
import SpaceCardImage from "../../../spaces/space-card/space-card-image/SpaceCardImage.vue";

const props = defineProps({
  space: {
    type: Object,
    required: true
  }
});

const { removeFavoriteSpace } = useUser();
const { projectsBySpace } = useProjects();

const nbProjects = computed(
  () => projectsBySpace.value[props.space.id]?.length ?? 0
);
</script>

<template>
  <div class="favorite-space-card">
    <div class="card__icon">&starf;</div>
    <div class="card__image">
      <SpaceCardImage :space="space" />
    </div>
    <AppLink
      class="card__info"
      :to="{
        name: routeNames.spaceBoard,
        params: {
          spaceID: space.id
        }
      }"
    >
      <div class="card__info__name">
        <BIMDataTextbox maxWidth="260px" :text="space.name" />
      </div>
      <div class="card__info__data">
        {{ nbProjects + " " + $t("t.projects") }}
      </div>
    </AppLink>
    <BIMDataButton ghost rounded icon @click.stop="removeFavoriteSpace(space)">
      <BIMDataIconDelete size="xs" />
    </BIMDataButton>
  </div>
</template>

<style scoped>
.favorite-space-card {
  position: relative;
  min-height: 64px;
  height: 64px;

  display: flex;
  align-items: center;

  .card__icon {
    margin-right: var(--spacing-unit);
    padding-bottom: 2px;
    font-size: 1.75rem;
    color: var(--color-secondary);
  }

  .card__image {
    min-width: 44px;
    width: 44px;
    height: 44px;
    padding: 2px;
    border-radius: 4px;
    box-shadow: var(--box-shadow);
  }

  .card__info {
    flex-grow: 1;
    padding: 0 var(--spacing-unit);
    line-height: 18px;

    .card__info__name {
      font-weight: bold;
    }

    .card__info__data {
      font-size: 12px;
      color: var(--color-granite-light);
    }
  }
}
</style>
