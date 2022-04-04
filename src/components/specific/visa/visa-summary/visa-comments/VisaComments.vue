<template>
  <div class="visa-comments">
    <template v-if="!isCommenting">
      <BIMDataButton
        class="visa-comments__comment-button"
        color="primary"
        fill
        radius
        width="100%"
        @click="isCommenting = true"
        >{{ $t("Visa.comments.comment") }}</BIMDataButton
      >
    </template>
    <template v-if="commentList.length > 0">
      <div class="visa-comments__comment-title">
        <span>{{ $t("Visa.comments.commentary") }}</span>
      </div>
    </template>
    <template v-if="isCommenting">
      <VisaCommentsInput
        @post-comment="postComment"
        @close-comments-input="isCommenting = false"
      />
    </template>
    <div
      class="visa-comments__thread-list"
      v-for="comment in commentList"
      :key="comment.id"
    >
      <VisaCommentPost
        :comment="comment"
        :project="project"
        :visa="visa"
        @reload-comments="reloadComments"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import VisaCommentPost from "./visa-comment-post/VisaCommentPost.vue";
import VisaCommentsInput from "./visa-comments-input/VisaCommentsInput.vue";

import { useVisa } from "@/state/visa";
import { useUser } from "@/state/user";
import { fullName } from "@/utils/users";

export default {
  components: { VisaCommentPost, VisaCommentsInput },
  props: {
    comments: {
      type: Array,
      required: true
    },
    project: {
      type: Object,
      required: true
    },
    visa: {
      type: Object,
      required: true
    },
    isAuthor: {
      type: Boolean,
      required: true
    }
  },
  emits: [],
  setup(props) {
    const { fetchAllComments, createComment } = useVisa();
    const { user } = useUser();

    const isCommenting = ref(false);
    const commentList = ref([]);

    const { id: currentUserId } = user.value;

    const formatComments = comments => {
      return comments
        .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
        .map(comment => ({
          ...comment,
          fullName: fullName(comment.author),
          isSelf: comment.author.userId === currentUserId
        }));
    };

    onMounted(() => (commentList.value = formatComments(props.comments)));

    const reloadComments = async () => {
      const comments = await fetchAllComments(
        props.project,
        props.visa.document,
        props.visa
      );
      commentList.value = formatComments(comments);
    };

    const postComment = async data => {
      await createComment(props.project, props.visa.document, props.visa, data);
      isCommenting.value = false;
      reloadComments();
    };

    return {
      // references
      isCommenting,
      commentList,
      // methods
      reloadComments,
      postComment,
      console
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaComments.scss"></style>
