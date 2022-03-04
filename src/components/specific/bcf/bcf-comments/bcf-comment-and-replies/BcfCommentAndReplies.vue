<template>
  <div class="bcf-comment-replies m-y-18">
    <BcfComment :bcfTopic="bcfTopic" :comment="comment" />
    <div class="replies m-l-42">
      <BcfComment
        v-for="reply in comment.replies"
        :bcfTopic="bcfTopic"
        :key="reply.guid"
        :comment="reply"
        class="reply"
      />
    </div>
    <BcfCommentInput
      v-if="isReplying"
      :bcfTopic="bcfTopic"
      :comment="comment"
      :isAReply="isReplying"
      @close="isReplying = false"
      :class="{ 'm-l-42': comment.replies?.length }"
    />
    <div class="flex items-center justify-end">
      <BIMDataButton
        v-if="!isReplying && comment.replyToCommentGuid === undefined"
        color="secondary"
        radius
        width="30%"
        @click="isReplying = true"
      >
        Répondre
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

import BcfComment from "./bcf-comment/BcfComment.vue";
import BcfCommentInput from "../bcf-comment-input/BcfCommentInput.vue";

export default {
  components: {
    BcfComment,
    BcfCommentInput
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
  setup() {
    const isReplying = ref(false);

    return {
      isReplying
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfCommentAndReplies.scss"></style>
