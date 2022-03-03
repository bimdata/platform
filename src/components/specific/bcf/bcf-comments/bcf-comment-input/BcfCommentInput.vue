<template>
  <div class="bcf-comment-input m-t-24">
    <BIMDataTextarea
      label="Poster un commentaire"
      name="example"
      v-model="topicComment"
      :autofocus="true"
      resizable
      width="100%"
    />
    <div></div>
    <div class="flex items-center justify-end">
      <BIMDataButton
        color="primary"
        ghost
        radius
        class="m-r-6"
        @click="$emit('close')"
      >
        Annuler
      </BIMDataButton>
      <BIMDataButton
        color="primary"
        fill
        radius
        width="135px"
        @click="publishComment"
      >
        Publier
      </BIMDataButton>
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
      type: Object,
      required: true
    }
  },
  emits: ["close"],
  setup(props) {
    const { currentProject } = useProjects();
    const { createComment } = useBcf();

    const topicComment = ref("");
    const publishComment = async () => {
      try {
        await createComment(currentProject.value, props.bcfTopic, {
          comment: topicComment.value
        });
      } finally {
        topicComment.value = null;
      }
    };
    return {
      topicComment,
      publishComment
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfCommentInput.scss"></style>
