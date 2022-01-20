<template>
  <div class="visa-comments-input">
    <BIMDataTextarea
      ref="textarea"
      v-model="textAreaContent"
      :placeholder="
        $t(`Visa.comments.${replyId ? 'replyComment' : 'postComment'}`)
      "
      name="comment"
      width="100%"
      :resizable="false"
      rows="1"
      fitContent
    />
    <div class="visa-comments-input__action-button">
      <BIMDataButton
        color="secondary"
        radius
        width="30%"
        @click="$emit('toggle-comments-input')"
        >{{ $t("Visa.comments.cancel") }}</BIMDataButton
      >
      <BIMDataButton
        color="primary"
        fill
        radius
        width="30%"
        @click="pushComment"
        >{{ $t("Visa.comments.publish") }}</BIMDataButton
      >
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useVisa } from "@/state/visa";

export default {
  props: {
    visaId: {
      type: Number,
      required: true
    },
    baseInfo: {
      type: Object,
      required: true
    },
    replyId: {
      type: Number,
      default: () => null
    }
  },
  emits: ["toggle-comments-input", "get-comments"],
  setup(props, { emit }) {
    const { createComment } = useVisa();
    const textarea = ref(null);
    const textAreaContent = ref(null);

    const pushComment = async () => {
      if (textAreaContent.value) {
        const data = {
          content: textAreaContent.value,
          replyToCommentId:
            typeof props.replyId === "number" ? props.replyId : null
        };
        await createComment(props.visaId, props.baseInfo, data);
        textAreaContent.value = null;
        emit("toggle-comments-input");
        emit("get-comments");
      }
    };

    onMounted(() => setTimeout(textarea.value.focus(), 200));

    return {
      // methods
      pushComment,
      // references
      textarea,
      textAreaContent
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaCommentsInput.scss"></style>
