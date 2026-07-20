<template>
  <div class="dashboard-project-list">
    <AppLink class="dashboard-project-list__title" :to="{ name: routeNames.userProjects }">
      <span>{{ $t("DashboardProjectList.title") }}</span>
      <BIMDataIconChevron size="xxs" />
    </AppLink>
    <div ref="contentEl" class="dashboard-project-list__content">
      <ProjectCard v-for="project in displayedProjects" :key="project.id" :project="project" />
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, watchEffect } from "vue";
import routeNames from "../../../../router/route-names.js";
// Components
import AppLink from "../../app/app-link/AppLink.vue";
import ProjectCard from "../../projects/project-card/ProjectCard.vue";

// Keep in sync with ProjectCard --card-width and DashboardProjectList.scss content gap.
const CARD_WIDTH = 320;
const CARD_GAP = 8;
const MIN_CARDS = 1;

export default {
  components: {
    AppLink,
    ProjectCard,
  },
  props: {
    projects: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const contentEl = ref(null);
    const maxCards = ref(MIN_CARDS);
    const displayedProjects = ref([]);

    const computeMaxCards = (width) => {
      if (!width) return;
      const fit = Math.floor((width + CARD_GAP) / (CARD_WIDTH + CARD_GAP));
      maxCards.value = Math.max(MIN_CARDS, fit);
    };

    let observer;
    onMounted(() => {
      observer = new ResizeObserver((entries) => {
        computeMaxCards(entries[0].contentRect.width);
      });
      if (contentEl.value) {
        observer.observe(contentEl.value);
        computeMaxCards(contentEl.value.clientWidth);
      }
    });
    onUnmounted(() => observer && observer.disconnect());

    watchEffect(() => {
      if (props.projects) {
        displayedProjects.value = props.projects
          .slice()
          .sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1))
          .slice(0, maxCards.value);
      }
    });

    return {
      contentEl,
      displayedProjects,
      routeNames,
    };
  },
};
</script>

<style scoped lang="scss" src="./DashboardProjectList.scss"></style>
