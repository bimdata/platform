<template>
  <div class="visa-comments-input">
    <BIMDataTextarea
      v-model="textContent"
      :placeholder="$t('Visa.comments.placeholder')"
      name="comment"
      width="100%"
      :autofocus="true"
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
import { ref } from "vue";
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

    const textContent = ref(null);

    const pushComment = async () => {
      if (textContent.value) {
        const data = {
          content: textContent.value,
          replyToCommentId:
            typeof props.replyId === "number" ? props.replyId : null
        };
        await createComment(props.visaId, props.baseInfo, data);
        textContent.value = null;
        emit("toggle-comments-input");
        emit("get-comments");
      }
    };

    return {
      // methods
      pushComment,
      // references
      textContent
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaCommentsInput.scss"></style>
