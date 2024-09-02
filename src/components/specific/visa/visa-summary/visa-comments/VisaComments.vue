<template>
  <div class="visa-comments">
    <template v-if="!isCommenting && isVisaOpen">
      <BIMDataButton
        class="visa-comments__comment-button"
        data-test-id="visa-open-comments"
        color="primary"
        fill
        radius
        width="100%"
        @click="isCommenting = true"
      >
        {{ $t("t.comment") }}
      </BIMDataButton>
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
      data-test-id="visa-comments-thread-list"
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
import { computed, onMounted, ref } from "vue";
import { VISA_STATUS } from "../../../../../config/visa.js";
import { useUser } from "../../../../../state/user.js";
import { useVisa } from "../../../../../state/visa.js";
import { fullName } from "../../../../../utils/users.js";

// Components
import VisaCommentPost from "./visa-comment-post/VisaCommentPost.vue";
import VisaCommentsInput from "./visa-comments-input/VisaCommentsInput.vue";

export default {
  components: {
    VisaCommentPost,
    VisaCommentsInput
  },
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
    const { isSelf } = useUser();
    const { fetchAllComments, createComment } = useVisa();

    const isCommenting = ref(false);
    const commentList = ref([]);

    const isVisaOpen = computed(() => props.visa.status === VISA_STATUS.OPEN);

    const formatComments = comments => {
      return comments
        .sort((a, b) => (a.created_at > b.created_at ? -1 : 1))
        .map(comment => ({
          ...comment,
          fullName: fullName(comment.author),
          isSelf: isSelf(comment.author)
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
      isVisaOpen,
      // methods
      reloadComments,
      postComment,
      console
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaComments.scss"></style>
