<template>
  <div class="overlay flex items-center justify-center">
    <div class="delete-modal flex items-center justify-center p-y-18">
      <BIMDataIcon name="warning" fill color="high" size="xs" />
      <span class="m-y-12">
        {{ $t("ModalDeleteTopic.deleteText", { name: bcfTopic.title }) }}
      </span>
      <div class="delete-modal__btns flex justify-center items-center">
        <BIMDataButton
          color="high"
          fill
          radius
          @click="removeTopic"
          class="m-r-18"
        >
          {{ $t("ModalDeleteTopic.deleteBcfButton") }}
        </BIMDataButton>
        <BIMDataButton color="primary" outline radius @click="$emit('close')">
          {{ $t("ModalDeleteTopic.keepBcfButton") }}
        </BIMDataButton>
      </div>
    </div>
    <div v-if="loading">
      <BIMDataLoading />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

import { useBcf } from "@/state/bcf.js";
import { useProjects } from "@/state/projects.js";

export default {
  props: {
    bcfTopic: {
      type: Object
    }
  },
  emits: ["close"],
  setup(props) {
    const loading = ref(false);
    const { currentProject } = useProjects();
    const { deleteTopic } = useBcf();
    const removeTopic = async () => {
      try {
        loading.value = true;
        await deleteTopic(currentProject.value, props.bcfTopic);
      } finally {
        loading.value = false;
      }
    };
    return {
      loading,
      removeTopic
    };
  }
};
</script>

<style scoped lang="scss" src="./ModalDeleteTopic.scss"></style>
