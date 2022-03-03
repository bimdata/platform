<template>
  <div class="bcf-comment-replies m-y-12">
    <BcfComment
      :comment="comment"
      @confirm-delete="confirmDelete($event)"
      @confirm-edit="confirmEdit($event)"
    />
    <!-- <BcfReplies /> -->
    <BcfCommentInput
      v-if="isReplying"
      :bcfTopic="bcfTopic"
      @close="isReplying = false"
    />
    <div class="flex items-center justify-end">
      <BIMDataButton
        v-if="!isReplying"
        color="secondary"
        radius
        width="30%"
        @click="isReplying = true"
        >Répondre</BIMDataButton
      >
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

import BcfComment from "./bcf-comment/BcfComment.vue";
import BcfCommentInput from "../bcf-comment-input/BcfCommentInput.vue";

// import BcfReplies from "./bcf-replies/BcfReplies.vue";

export default {
  components: {
    BcfComment,
    BcfCommentInput
    // BcfReplies
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    bcfTopic: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { currentProject } = useProjects();
    const { deleteComment, updateComment } = useBcf();

    const isReplying = ref(false);
    const loading = ref(false);

    const confirmDelete = async commentContent => {
      try {
        loading.value = true;
        await deleteComment(
          currentProject.value,
          props.bcfTopic,
          commentContent
        );
      } finally {
        loading.value = false;
      }
    };

    const confirmEdit = async commentContent => {
      console.log({ commentContent });
      if (props.comment.comment !== commentContent) {
        await updateComment(
          currentProject.value,
          props.bcfTopic,
          props.comment,
          {
            comment: commentContent
          }
        );
      }
    };
    return {
      loading,
      isReplying,
      // methods
      confirmDelete,
      confirmEdit
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfCommentAndReplies.scss"></style>
