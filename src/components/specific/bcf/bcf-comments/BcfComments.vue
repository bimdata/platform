<template>
  <div class="bcf-comments">
    <BIMDataButton
      v-if="!isBcfCommentOpen"
      width="100%"
      color="primary"
      fill
      radius
      @click="isBcfCommentOpen = true"
    >
      {{ $t("OpenTopicIssue.commentButton") }}
    </BIMDataButton>

    <!-- Input first level comment -->
    <div class="bcf-comments__post-comment m-t-24" v-if="isBcfCommentOpen">
      <p class="color-granite m-b-24">Commentaire</p>
      <BcfCommentInput
        :bcfTopic="bcfTopic"
        @close="isBcfCommentOpen = false"
        :isAReply="false"
      />
    </div>

    <!-- list of comments -->
    <div v-if="bcfTopic.comments?.length" class="bcf-comments__list m-t-18">
      <p class="color-granite">
        {{
          bcfTopic.comments?.length > 1
            ? bcfTopic.comments.length + " Commentaires"
            : "0 Commentaire"
        }}
      </p>
      <BcfCommentAndReplies
        v-for="comment in bcfTopic.comments"
        :key="comment"
        :comment="comment"
        :bcfTopic="bcfTopic"
      />
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useBcf } from "@/state/bcf.js";
import { useProjects } from "@/state/projects.js";

import BcfCommentAndReplies from "./bcf-comment-and-replies/BcfCommentAndReplies.vue";
import BcfCommentInput from "./bcf-comment-input/BcfCommentInput.vue";

export default {
  components: {
    BcfCommentAndReplies,
    BcfCommentInput
  },
  props: {
    bcfTopic: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const isBcfCommentOpen = ref(false);
    const topicComment = ref("");
    const { currentProject } = useProjects();
    const { fetchAllComments } = useBcf();

    watch(
      [currentProject, () => props.bcfTopic],
      async () => {
        await fetchAllComments(currentProject.value, props.bcfTopic);
      },
      { immediate: true }
    );

    return {
      isBcfCommentOpen,
      topicComment
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfCommentReplies.scss"></style>
