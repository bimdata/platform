<template>
  <div class="visa-main">
    <template v-if="!visaId">
      <VisaAdd
        :baseInfo="baseInfo"
        :fileParentId="file.parentId"
        @close="$emit('close', $event)"
        @get-visa-id="getVisaId"
      />
    </template>
    <template v-else>
      <VisaSummary :baseInfo="baseInfo" :visaId="visaId" />
    </template>
  </div>
</template>

<script>
import { ref } from "vue";

import VisaAdd from "@/components/specific/visa/visa-add/VisaAdd";
import VisaSummary from "@/components/specific/visa/visa-summary/VisaSummary";

import { useSpaces } from "@/state/spaces";
import { useProjects } from "@/state/projects";

export default {
  components: {
    VisaAdd,
    VisaSummary
  },
  props: {
    file: {
      type: Object,
      required: true
    }
  },
  emits: ["close"],
  setup(props) {
    const { currentSpace } = useSpaces();
    const { currentProject } = useProjects();
    const visaId = ref(33);

    const getVisaId = event => (visaId.value = event);

    return {
      //references
      visaId,
      baseInfo: {
        cloudPk: currentSpace.value.id,
        projectPk: currentProject.value.id,
        documentPk: props.file.id
      },
      // methods
      getVisaId
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaMain.scss"></style>
