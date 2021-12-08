<template>
  <div class="visa-main">
    {{ console.log("file", file) }}
    <VisaAdd
      @close="$emit('close', $event)"
      :baseInfo="baseInfo"
      :fileParentId="file.parentId"
    />
  </div>
</template>

<script>
import VisaAdd from "@/components/specific/visa/visa-add/VisaAdd";
import { useSpaces } from "@/state/spaces";
import { useProjects } from "@/state/projects";

export default {
  components: {
    VisaAdd
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

    return {
      //references
      baseInfo: {
        cloudPk: currentSpace.value.id,
        projectPk: currentProject.value.id,
        documentPk: props.file.id
      },
      console
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaMain.scss"></style>
