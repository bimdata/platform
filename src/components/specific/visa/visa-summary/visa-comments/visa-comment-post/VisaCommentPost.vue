<template>
  <div
    ref="visaCommentPost"
    class="visa-comment-post"
    v-click-away="toggleCloseActions"
  >
    <div class="visa-comment-post__header">
      <div class="visa-comment-post__header__left-side">
        <UserAvatar
          class="visa-comment-post__header__left-side__user-avatar"
          :user="comment.author"
          size="27"
          initialsSize="14"
          color="silver-light"
        />
        <BIMDataTextbox
          class="visa-comment-post__header__left-side__name"
          :text="comment.fullName || comment.author.email"
          maxWidth="45%"
        />
        <span class="visa-comment-post__header__left-side__separator">•</span>
        <span class="visa-comment-post__header__left-side__date">{{
          $d(comment.createdAt, "long")
        }}</span>
      </div>
      <div class="visa-comment-post__header__right-side">
        <template v-if="comment.isSelf">
          <VisaCommentPostActions
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
  </div>
</template>

<script>
import { ref, watch } from "vue";
import UserAvatar from "@/components/specific/users/user-avatar/UserAvatar";

import VisaCommentPostActions from "./visa-comment-post-actions/VisaCommentPostActions.vue";
import { useVisa } from "@/state/visa";

export default {
  components: {
    UserAvatar,
    VisaCommentPostActions
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    project: {
      type: Object,
      required: true
    },
    visa: {
      type: Object,
      required: true
    }
  },
  emits: ["reload-comments"],
  setup(props, { emit }) {
    const { updateComment, deleteComment } = useVisa();

    const isEditing = ref(false);
    const commentContent = ref(props.comment.content);
    const areActionsClosed = ref(false);
    const textarea = ref(null);
    const visaCommentPost = ref(null);

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

    const toggleCloseActions = () =>
      (areActionsClosed.value = !areActionsClosed.value);

    watch(isEditing, () => isEditing.value && textarea.value.focus());

    return {
      //references
      isEditing,
      areActionsClosed,
      commentContent,
      textarea,
      visaCommentPost,
      // methods
      undoEdit,
      confirmEdit,
      confirmDelete,
      toggleCloseActions
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaCommentPost.scss"></style>
