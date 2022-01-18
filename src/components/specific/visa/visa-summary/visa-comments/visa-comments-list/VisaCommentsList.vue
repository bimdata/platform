<template>
  <transition name="fade">
    <template v-if="isSafeZone">
      <div class="safe-zone">
        <VisaSafeZone actionType="deleteComment" @onClose="onSafeZone" />
      </div>
    </template>
  </transition>
  <div
    class="visa-comments-list"
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
        <template v-if="isEditing && commentToHandle.id === comment.id">
          <BIMDataButton ghost rounded icon @click="handleEdit(null, 'undo')">
            <BIMDataIcon
              name="undo"
              size="xxs"
              fill
              color="granite-light"
              @click="handleEdit(null, 'undo')"
            />
          </BIMDataButton>
          <BIMDataButton ghost rounded icon @click="handleEdit(comment.id)">
            <BIMDataIcon
              name="validate"
              size="xxs"
              fill
              color="granite-light"
            />
          </BIMDataButton>
        </template>
        <template v-if="!isEditing && comment.isSelf">
          <VisaCommentsListActons
            :commentId="comment.id"
            @handle-edit="handleEdit"
            @safe-zone-handler="safeZoneHandler"
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
      />
    </template>
  </div>
</template>

<script>
import { ref } from "vue";
import UserAvatar from "@/components/specific/users/user-avatar/UserAvatar";
import VisaSafeZone from "@/components/specific/visa/visa-safe-zone/VisaSafeZone.vue";
import VisaCommentsInput from "@/components/specific/visa/visa-summary/visa-comments/visa-comments-input/VisaCommentsInput.vue";

import VisaCommentsListActons from "./visa-comments-list-actions/VisaCommentsListActions.vue";
import { formatDateDDMMYYYHHMM } from "@/utils/date";
import { useVisa } from "@/state/visa";

export default {
  components: {
    UserAvatar,
    VisaCommentsListActons,
    VisaSafeZone,
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
    const isReplying = ref(false);
    const commentToHandle = ref(null);
    const copyOfContent = ref(null);
    const isSafeZone = ref(false);

    const handleEdit = async (commentId, undo) => {
      if (undo === "undo") {
        commentToHandle.value.content = copyOfContent.value;
        isEditing.value = false;
      } else if (isEditing.value) {
        if (commentToHandle.value.content !== copyOfContent.value) {
          await updateComment(commentId, props.visaId, props.baseInfo, {
            content: commentToHandle.value.content
          });
        }
        isEditing.value = false;
        commentToHandle.value = null;
      } else if (!isEditing.value) {
        commentToHandle.value = props.commentsList.find(
          ({ id }) => id === commentId
        );
        copyOfContent.value = commentToHandle.value.content;
        isEditing.value = true;
      }
    };

    const safeZoneHandler = commentId => {
      commentToHandle.value = props.commentsList.find(
        ({ id }) => id === commentId
      );
      isSafeZone.value = true;
    };

    const onSafeZone = async type => {
      if (type) {
        await deleteComment(
          commentToHandle.value.id,
          props.visaId,
          props.baseInfo
        );
        await emit("get-comments");
        commentToHandle.value = null;
      }
      isSafeZone.value = false;
    };

    const handleIsReplying = commentId => {
      if (commentId) {
        commentToHandle.value = props.commentsList.find(
          ({ id }) => id === commentId
        );
      } else {
        commentToHandle.value = null;
      }

      return (isReplying.value = !isReplying.value);
    };

    return {
      //references
      isEditing,
      commentToHandle,
      isSafeZone,
      isReplying,
      // methods
      formatDateDDMMYYYHHMM,
      handleEdit,
      safeZoneHandler,
      onSafeZone,
      handleIsReplying
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaCommentsList.scss"></style>
