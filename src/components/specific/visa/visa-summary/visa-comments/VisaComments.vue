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
    <template v-if="threadList.length > 0">
      <span>{{ $t("Visa.comments.commentary") }}</span>
    </template>
    <template v-if="isCommenting">
      <VisaCommentsInput
        @post-comment="postComment"
        @close-comments-input="isCommenting = false"
      />
    </template>
    <div
      class="visa-comments__thread-list"
      v-for="commentList in threadList"
      :key="commentList[0].id"
    >
      <div
        class="visa-comments__comment-list"
        v-for="(comment, index) in commentList"
        :key="comment.id"
      >
        <VisaCommentPost
          :mainComment="commentList[0]"
          :comment="comment"
          :project="project"
          :visa="visa"
          :isAReply="commentList.length > 1 && index > 0"
          :isLastComment="commentList.length === index + 1"
          @reload-comments="reloadComments"
        />
      </div>
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
    const threadList = ref([]);

    const { id: currentUserId } = user.value;

    const formatComments = comments => {
      const threadCreator = {};
      comments
        .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1))
        .map(comment => ({
          ...comment,
          fullName: fullName(comment.author),
          isSelf: comment.author.userId === currentUserId
        }))
        .forEach(comment => {
          if (comment.replyToCommentId) {
            threadCreator[comment.replyToCommentId].push(comment);
          } else {
            threadCreator[comment.id] = [comment];
          }
        });

      return Object.keys(threadCreator)
        .sort((a, b) => (a < b ? 1 : -1))
        .map(id => threadCreator[id]);
    };

    onMounted(() => (threadList.value = formatComments(props.comments)));

    const reloadComments = async () => {
      const comments = await fetchAllComments(
        props.project,
        props.visa.document,
        props.visa
      );
      threadList.value = formatComments(comments);
    };

    const postComment = async data => {
      await createComment(props.project, props.visa.document, props.visa, data);
      isCommenting.value = false;
      reloadComments();
    };

    return {
      // references
      isCommenting,
      threadList,
      // methods
      reloadComments,
      postComment
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaComments.scss"></style>
