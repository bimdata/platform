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

    <!-- Input create a comment -->
    <div class="bcf-comments__post-comment m-t-24" v-if="isBcfCommentOpen">
      <p class="color-granite m-b-24">Commentaire</p>
      <div class="bcf-comment-input m-t-24">
        <BIMDataTextarea
          ref="textarea"
          label="Poster un commentaire"
          name="example"
          v-model="topicComment"
          autofocus
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
            @click="isBcfCommentOpen = false"
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
    </div>

    <!-- list of comments -->
    <div v-if="bcfTopic.comments?.length" class="bcf-comments__list m-t-18">
      <p class="color-granite">
        {{
          bcfTopic.comments?.length
            ? bcfTopic.comments.length + " Commentaires"
            : "0 Commentaire"
        }}
      </p>
      <BcfComment
        v-for="comment in bcfTopic.comments"
        :key="comment"
        :bcfTopic="bcfTopic"
        :comment="comment"
      />
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useBcf } from "@/state/bcf.js";
import { useProjects } from "@/state/projects.js";

import BcfComment from "./bcf-comment/BcfComment.vue";

export default {
  components: {
    BcfComment
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
    const { createComment, fetchAllComments } = useBcf();

    watch(
      [currentProject, () => props.bcfTopic],
      async () => {
        await fetchAllComments(currentProject.value, props.bcfTopic);
      },
      { immediate: true }
    );

    const textarea = ref(null);
    watch(isBcfCommentOpen, () =>
      setTimeout(() => isBcfCommentOpen.value && textarea.value.focus(), 100)
    );

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
      textarea,
      topicComment,
      isBcfCommentOpen,
      publishComment
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfComments.scss"></style>
