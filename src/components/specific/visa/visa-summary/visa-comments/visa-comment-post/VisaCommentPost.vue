<template>
  <div
    class="visa-comment-post"
    :class="`visa-comment-post${isAReply ? '__reply' : ''}`"
    v-click-away="toggleCloseActions"
  >
    <div class="visa-comment-post__header">
      <div class="visa-comment-post__header__left-side">
        <UserAvatar
          :user="comment.author"
          size="27"
          initialsSize="14"
          color="silver-light"
          style="box-shadow: var(--box-shadow)"
        />
        <BIMDataTextBox
          class="visa-comment-post__header__left-side__name"
          :text="comment.fullName || comment.author.email"
          maxWidth="30%"
        />
        <span class="visa-comment-post__header__left-side__separator">•</span>
        <span class="visa-comment-post__header__left-side__date">{{
          $d(comment.createdAt, "long")
        }}</span>
      </div>
      <div class="visa-comment-post__header__right-side">
        <template v-if="comment.isSelf">
          <VisaCommentPostActions
            :isAReply="isAReply"
            :areActionsClosed="areActionsClosed"
            @init-edit="isEditing = true"
            @undo-edit="undoEdit"
            @confirm-edit="confirmEdit"
            @confirm-delete="confirmDelete"
            @toggle-close="toggleCloseActions"
          />
        </template>
      </div>
    </div>
    <div class="visa-comment-post__content">
      <BIMDataTextarea
        ref="textarea"
        v-model="commentContent"
        :class="{ editing: isEditing }"
        name="description"
        width="100%"
        :readonly="!isEditing"
        :resizable="false"
        rows="1"
        fitContent
        autofocus
      />
    </div>
    <template v-if="isLastComment && !isEditing && !isReplying">
      <BIMDataButton
        color="secondary"
        radius
        width="30%"
        style="margin: -5% 0 0 74%; font-size: 1.15em"
        @click="isReplying = true"
        >{{ $t("Visa.comments.reply") }}</BIMDataButton
      >
    </template>
    <template v-if="isReplying">
      <VisaCommentsInput
        :mainComment="mainComment"
        @post-comment="replyComment"
        @close-comments-input="isReplying = false"
        style="margin-left: var(--spacing-unit)"
      />
    </template>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import UserAvatar from "@/components/specific/users/user-avatar/UserAvatar";
import VisaCommentsInput from "@/components/specific/visa/visa-summary/visa-comments/visa-comments-input/VisaCommentsInput.vue";

import VisaCommentPostActions from "./visa-comment-post-actions/VisaCommentPostActions.vue";
import { useVisa } from "@/state/visa";

export default {
  components: {
    UserAvatar,
    VisaCommentPostActions,
    VisaCommentsInput
  },
  props: {
    mainComment: {
      type: Object,
      required: true
    },
    comment: {
      type: Object,
      required: true
    },
    isAReply: {
      type: Boolean,
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
    isLastComment: {
      type: Boolean,
      required: true
    }
  },
  emits: ["reload-comments"],
  setup(props, { emit }) {
    const { updateComment, deleteComment, createComment } = useVisa();

    const isEditing = ref(false);
    const isReplying = ref(false);
    const commentToHandle = ref(null);
    const commentContent = ref(props.comment.content);
    const areActionsClosed = ref(false);
    const textarea = ref(null);

    const undoEdit = () => {
      commentContent.value = props.comment.content;
      isEditing.value = false;
    };

    const confirmEdit = async () => {
      if (props.comment.content !== commentContent.value) {
        await updateComment(
          props.project,
          props.visa.document,
          props.visa,
          props.comment,
          {
            content: commentContent.value
          }
        );
      }
      isEditing.value = false;
    };

    const confirmDelete = async () => {
      await deleteComment(
        props.project,
        props.visa.document,
        props.visa,
        props.comment
      );
      emit("reload-comments");
    };

    const replyComment = async data => {
      await createComment(props.project, props.visa.document, props.visa, data);
      isReplying.value = false;
      emit("reload-comments");
    };

    const toggleCloseActions = () =>
      (areActionsClosed.value = !areActionsClosed.value);

    watch(isEditing, () => isEditing.value && textarea.value.focus());

    return {
      //references
      isEditing,
      commentToHandle,
      isReplying,
      areActionsClosed,
      commentContent,
      textarea,
      // methods
      undoEdit,
      confirmEdit,
      confirmDelete,
      toggleCloseActions,
      replyComment
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaCommentPost.scss"></style>
