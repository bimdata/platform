<template>
  <div
    class="visa-comments-list"
    :class="{ reply: isThread && index > 0 ? '__reply' : '' }"
    v-for="(comment, index) in commentsList"
    :key="comment.id"
  >
    <div class="visa-comments-list__header">
      <div class="visa-comments-list__header__left-side">
        <UserAvatar
          :user="comment.author"
          size="27"
          sizeInitials="14"
          color="silver-light"
          style="box-shadow: var(--box-shadow)"
        />
        <BIMDataTextBox
          class="visa-comments-list__header__left-side__name"
          :text="comment.fullName || comment.author.email"
          maxWidth="30%"
        />
        <span class="visa-comments-list__header__left-side__separator">•</span>
        <span class="visa-comments-list__header__left-side__date">{{
          formatDateDDMMYYYHHMM(comment.createdAt)
        }}</span>
      </div>
      <div class="visa-comments-list__header__right-side">
        <template v-if="comment.isSelf">
          <VisaCommentsListActons
            :commentId="comment.id"
            :commentToHandle="commentToHandle"
            @handle-edit="handleEdit"
            @handle-delete="handleDelete"
            @set-comment-to-handle="setCommentToHandle"
          />
        </template>
      </div>
    </div>
    <div class="visa-comments-list__content">
      <BIMDataTextarea
        v-model="comment.content"
        :class="{ editing: isEditing && commentToHandle.id === comment.id }"
        name="description"
        width="100%"
        :readonly="
          !isEditing ||
          (commentToHandle.id && commentToHandle.id !== comment.id)
        "
        :resizable="false"
        rows="1"
        fitContent
      />
    </div>
    <template
      v-if="!isEditing && !isReplying && index === commentsList.length - 1"
    >
      <BIMDataButton
        color="secondary"
        radius
        width="30%"
        style="margin: -6% 0 0 74%; font-size: 1.15em"
        @click="handleIsReplying(commentsList[0].id)"
        >{{ $t("Visa.comments.reply") }}</BIMDataButton
      >
    </template>
    <template
      v-if="
        isReplying && commentsList[commentsList.length - 1].id === comment.id
      "
    >
      <VisaCommentsInput
        :replyId="commentsList[0].id"
        :visaId="visaId"
        :baseInfo="baseInfo"
        @toggle-comments-input="handleIsReplying"
        @get-comments="$emit('get-comments')"
        style="margin-left: var(--spacing-unit)"
      />
    </template>
  </div>
</template>

<script>
import { ref } from "vue";
import UserAvatar from "@/components/specific/users/user-avatar/UserAvatar";
import VisaCommentsInput from "@/components/specific/visa/visa-summary/visa-comments/visa-comments-input/VisaCommentsInput.vue";

import VisaCommentsListActons from "./visa-comments-list-actions/VisaCommentsListActions.vue";
import { formatDateDDMMYYYHHMM } from "@/utils/date";
import { useVisa } from "@/state/visa";

export default {
  components: {
    UserAvatar,
    VisaCommentsListActons,
    VisaCommentsInput
  },
  props: {
    commentsList: {
      type: Array,
      required: true
    },
    isThread: {
      type: Boolean,
      required: true
    },
    visaId: {
      type: Number,
      required: true
    },
    baseInfo: {
      type: Object,
      required: true
    }
  },
  emits: ["get-comments"],
  setup(props, { emit }) {
    const { updateComment, deleteComment } = useVisa();

    const isEditing = ref(false);
    const isDeleting = ref(false);
    const isReplying = ref(false);
    const commentToHandle = ref(null);
    const copyOfContent = ref(null);

    const handleEdit = async commentId => {
      if (commentId === "cancel") {
        commentToHandle.value.content = copyOfContent.value;
        setCommentToHandle();
        isEditing.value = false;
      } else if (isEditing.value) {
        if (commentToHandle.value.content !== copyOfContent.value) {
          await updateComment(
            commentToHandle.value.id,
            props.visaId,
            props.baseInfo,
            {
              content: commentToHandle.value.content
            }
          );
        }
        isEditing.value = false;
        setCommentToHandle();
      } else if (!isEditing.value) {
        setCommentToHandle(commentId);
        copyOfContent.value = commentToHandle.value.content;
        isEditing.value = true;
      }
    };

    const handleDelete = async commentId => {
      if (commentId === "cancel") {
        isDeleting.value = false;
        setCommentToHandle();
      } else if (isDeleting.value) {
        await deleteComment(
          commentToHandle.value.id,
          props.visaId,
          props.baseInfo
        );
        await emit("get-comments");
        isDeleting.value = false;
        setCommentToHandle();
      } else if (!isDeleting.value) {
        setCommentToHandle(commentId);
        isDeleting.value = true;
      }
    };

    const handleIsReplying = commentId => {
      setCommentToHandle(commentId);
      return (isReplying.value = !isReplying.value);
    };

    const setCommentToHandle = commentId => {
      if (commentId) {
        commentToHandle.value = commentToHandle.value = props.commentsList.find(
          ({ id }) => id === commentId
        );
      } else {
        commentToHandle.value = null;
      }
    };

    return {
      //references
      isEditing,
      isDeleting,
      commentToHandle,
      isReplying,
      // methods
      formatDateDDMMYYYHHMM,
      setCommentToHandle,
      handleEdit,
      handleDelete,
      handleIsReplying
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaCommentsList.scss"></style>
