<script setup>
import routeNames from "../../../../../router/route-names.js";
import { useUser } from "../../../../../state/user.js";
// Components
import AppLink from "../../../app/app-link/AppLink.vue";

defineProps({
  project: {
    type: Object,
    required: true
  }
});

const { removeFavoriteProject } = useUser();
</script>

<template>
  <div class="favorite-project-card">
    <div class="card__icon">&starf;</div>
    <div class="card__image">
      <BIMDataIconProject size="l" />
    </div>
    <AppLink
      class="card__info"
      :to="{
        name: routeNames.projectBoard,
        params: {
          spaceID: project.cloud.id,
          projectID: project.id
        }
      }"
    >
      <BIMDataTextbox maxWidth="260px" :text="project.name" />
    </AppLink>
    <BIMDataButton
      ghost
      rounded
      icon
      @click.stop="removeFavoriteProject(project)"
    >
      <BIMDataIconDelete size="xs" />
    </BIMDataButton>
  </div>
</template>

<style scoped>
.favorite-project-card {
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
    border-radius: 4px;
    box-shadow: var(--box-shadow);
    background-color: var(--color-silver-light);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card__info {
    flex-grow: 1;
    padding: 0 var(--spacing-unit);
    line-height: 18px;
    font-weight: bold;
  }
}
</style>
