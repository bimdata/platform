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
    <template v-if="commentsList.length > 0">
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
      class="visa-comments__comment-list"
      v-for="comments in commentsList"
      :key="comments[0].id"
    >
      <VisaCommentsList
        :commentsList="comments"
        :visaId="visaId"
        :baseInfo="baseInfo"
        :isThread="comments.length === 1 ? false : true"
        @get-comments="getComments"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import VisaCommentsList from "./visa-comments-list/VisaCommentsList.vue";
import VisaCommentsInput from "./visa-comments-input/VisaCommentsInput.vue";

import { useVisa } from "@/state/visa";
import { useUser } from "@/state/user";
import { fullName } from "@/utils/users";

export default {
  components: { VisaCommentsList, VisaCommentsInput },
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
    const commentsList = ref([]);

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

      commentsList.value = Object.keys(myStructure)
        .map(id => myStructure[id])
        .reverse();
    };

    const toggleCommentsInput = () =>
      (isCommenting.value = !isCommenting.value);

    onMounted(async () => getComments());

    return {
      // references
      isCommenting,
      commentsList,
      // methods
      getComments,
      toggleCommentsInput
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaComments.scss"></style>
