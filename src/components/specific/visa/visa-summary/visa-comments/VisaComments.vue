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
        :visaId="visaId"
        :baseInfo="baseInfo"
        @toggle-comments-input="toggleCommentsInput"
        @get-comments="getComments"
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
          :comment="comment"
          :visaId="visaId"
          :baseInfo="baseInfo"
          :isAReply="commentList.length > 1 && index > 0 ? false : true"
          :isLastComment="commentList.length === index + 1"
          :mainCommentId="commentList[0].id"
          @get-comments="getComments"
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
    isAuthor: {
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
  emits: [],
  setup(props) {
    const { fetchAllComments } = useVisa();
    const { user } = useUser();

    const isCommenting = ref(false);
    const threadList = ref([]);

    const { id: currentUserId } = user.value;

    const getComments = async () => {
      const myStructure = {};
      const res = await fetchAllComments(props.visaId, props.baseInfo);

      res
        .sort((a, b) => (a.id < b.id ? -1 : 1))
        .forEach(elem => {
          const comment = {
            ...elem,
            fullName: fullName(elem.author),
            isSelf: elem.author.userId === currentUserId
          };
          if (comment.replyToCommentId) {
            myStructure[comment.replyToCommentId].push(comment);
          } else {
            myStructure[comment.id] = [comment];
          }
        });

      threadList.value = Object.keys(myStructure)
        .map(id => myStructure[id])
        .reverse();
    };

    const toggleCommentsInput = () =>
      (isCommenting.value = !isCommenting.value);

    onMounted(async () => getComments());

    return {
      // references
      isCommenting,
      threadList,
      // methods
      getComments,
      toggleCommentsInput
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaComments.scss"></style>
