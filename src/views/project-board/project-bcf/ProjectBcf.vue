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
        <BIMDataButton color="default" fill square icon class="m-r-12">
          #
        </BIMDataButton>
        <BIMDataButton color="default" fill square icon class="m-r-12">
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
      <BcfTopics :project="project" />
    </div>
  </div>
</template>

<script>
import { useProjects } from "@/state/projects.js";

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

    return {
      project: currentProject
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectBcf.scss"></style>
