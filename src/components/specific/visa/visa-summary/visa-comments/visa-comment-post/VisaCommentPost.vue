<template>
  <div
    class="visa-comment-post"
    :class="{ reply: isAReply ? '' : '__reply' }"
    v-click-away="toggleClose"
  >
    <div class="visa-comment-post__header">
      <div class="visa-comment-post__header__left-side">
        <UserAvatar
          :user="comment.author"
          size="27"
          sizeInitials="14"
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
          formatDateDDMMYYYHHMM(comment.createdAt)
        }}</span>
      </div>
      <div class="visa-comment-post__header__right-side">
        <template v-if="comment.isSelf">
          <VisaCommentPostActions
            :commentId="comment.id"
            :commentToHandle="commentToHandle"
            :isAReply="isAReply"
            :isClosed="isClosed"
            @handle-edit="handleEdit"
            @handle-delete="handleDelete"
            @toggle-close="toggleClose"
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
        style="margin: -6% 0 0 74%; font-size: 1.15em"
        @click="toggleIsReplying(mainCommentId)"
        >{{ $t("Visa.comments.reply") }}</BIMDataButton
      >
    </template>
    <template v-if="isReplying">
      <VisaCommentsInput
        :replyId="mainCommentId"
        :visaId="visaId"
        :baseInfo="baseInfo"
        @toggle-comments-input="toggleIsReplying"
        @get-comments="$emit('get-comments')"
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
import { formatDateDDMMYYYHHMM } from "@/utils/date";
import { useVisa } from "@/state/visa";

export default {
  components: {
    UserAvatar,
    VisaCommentPostActions,
    VisaCommentsInput
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    isAReply: {
      type: Boolean,
      required: true
    },
    isLastComment: {
      type: Boolean,
      required: true
    },
    mainCommentId: {
      type: Number,
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
    const commentContent = ref(props.comment.content);
    const isClosed = ref(false);
    const textarea = ref(null);

    const handleEdit = async cancel => {
      if (cancel === "cancel") {
        commentContent.value = props.comment.content;
        isEditing.value = false;
      } else if (isEditing.value) {
        if (props.comment.content !== commentContent.value) {
          await updateComment(props.comment.id, props.visaId, props.baseInfo, {
            content: props.comment.content
          });
        }
        isEditing.value = false;
      } else if (!isEditing.value) {
        isEditing.value = true;
      }
    };

    const handleDelete = async cancel => {
      if (cancel === "cancel") {
        isDeleting.value = false;
      } else {
        await deleteComment(props.comment.id, props.visaId, props.baseInfo);
        await emit("get-comments");
        isDeleting.value = false;
      }
    };

    const toggleIsReplying = () => (isReplying.value = !isReplying.value);
    const toggleClose = () => (isClosed.value = !isClosed.value);

    watch(isEditing, () => isEditing.value && textarea.value.focus());

    return {
      //references
      isEditing,
      isDeleting,
      commentToHandle,
      isReplying,
      isClosed,
      commentContent,
      textarea,
      // methods
      formatDateDDMMYYYHHMM,
      handleEdit,
      handleDelete,
      toggleIsReplying,
      toggleClose,
      console
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaCommentPost.scss"></style>
