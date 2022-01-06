<template>
  <div class="project-bcf">
    <app-slot-content name="project-board-action">
      <BIMDataButton width="140px" color="primary" fill radius>
        <BIMDataIcon name="plus" size="xxxs" margin="0 6px 0 0" />
        <span>Ajouter un BCF</span>
      </BIMDataButton>
    </app-slot-content>
    <div class="flex justify-between m-t-24">
      <BIMDataSearch placeholder="Search" color="secondary" radius width="35%">
      </BIMDataSearch>
      <div class="flex">
        <BIMDataButton
          data-test="btn-sort"
          color="default"
          fill
          square
          icon
          class="m-r-12"
          @click="sortByIndex"
        >
          #
        </BIMDataButton>
        <BIMDataButton
          data-test="btn-sort"
          color="default"
          fill
          square
          icon
          class="m-r-12"
          @click="sortByName"
        >
          <BIMDataIcon name="alphabeticalSort" fill color="default" />
        </BIMDataButton>
        <BIMDataButton color="default" fill square icon class="m-r-12">
          Date
        </BIMDataButton>
        <BIMDataButton color="default" fill square icon class="m-r-12">
          List
        </BIMDataButton>
        <BIMDataButton color="default" fill square width="124px">
          Filters
        </BIMDataButton>
      </div>
    </div>
    <div class="project-bcf__content flex m-t-36">
      <div
        class="project-bcf__content__metrics flex items-center justify-center"
        style="width: 701px; background-color: white"
      >
        Some stats here
      </div>
      <BcfTopics
        v-for="bcfTopic in bcfTopics"
        :key="bcfTopic.index"
        :project="project"
        :bcfTopic="bcfTopic"
      />
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useProjects } from "@/state/projects.js";
import { useListSort } from "@/composables/list-sort.js";
import { useBcf } from "@/state/bcf.js";

import AppSlotContent from "@/components/generic/app-slot/AppSlotContent.vue";

// Components
import BcfTopics from "../../../components/specific/bcf/bcf-topics/BcfTopics.vue";

export default {
  components: {
    BcfTopics,
    AppSlotContent
  },
  setup() {
    const { currentProject } = useProjects();
    const { loadBcfTopics } = useBcf();
    const bcfTopics = ref([]);

    watch(
      () => currentProject.value,
      async () => {
        bcfTopics.value = await loadBcfTopics(currentProject.value);
      },
      { immediate: true }
    );
    const { sortToggle: sortByName } = useListSort(
      bcfTopics,
      topic => topic.name
    );
    const { sortToggle: sortByIndex } = useListSort(
      bcfTopics,
      topic => topic.index
    );
    return {
      project: currentProject,
      bcfTopics,
      sortByName,
      sortByIndex
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectBcf.scss"></style>
