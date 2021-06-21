<template>
  <div class="project-groups">
    <!-- TODO -->
    <GroupCard v-for="group of groups" :key="group.id" :group="group" />
  </div>
</template>

<script>
import { onMounted } from "vue";
import { useGroups } from "@/state/groups";
import { useProjects } from "@/state/projects";
// Components
import GroupCard from "@/components/specific/groups/group-card/GroupCard";

export default {
  components: {
    GroupCard
  },
  setup() {
    const { currentProject } = useProjects();
    const { projectGroups, loadProjectGroups } = useGroups();

    onMounted(() => {
      loadProjectGroups(currentProject.value);
    });

    return {
      groups: projectGroups,
      project: currentProject
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectGroups.scss"></style>
