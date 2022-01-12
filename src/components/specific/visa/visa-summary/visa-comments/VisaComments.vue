<template>
  <div class="visa-comments">
    <template v-if="isAuthor && !isAuthorCommenting">
      <BIMDataButton
        class="visa-comments__comment-button"
        color="primary"
        fill
        radius
        width="100%"
        @click="isAuthorCommenting = true"
        >{{ $t("Visa.comments.comment") }}</BIMDataButton
      >
    </template>
    <template v-if="!isAuthor || isAuthorCommenting">
      <div class="visa-comments__comments-handler">
        <span>{{ $t("Visa.comments.commentary") }}</span>
        <BIMDataTextarea
          v-model="textContent"
          :placeholder="$t('Visa.comments.placeholder')"
          name="comment"
          width="100%"
          :resizable="false"
          rows="1"
          fitContent
        />
        <div class="visa-comments__comments-handler__action-button">
          <BIMDataButton
            v-if="isAuthor && isAuthorCommenting"
            color="secondary"
            radius
            width="30%"
            @click="isAuthorCommenting = false"
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
    <div class="visa-comments__comment-list">
      <VisaCommentsList
        :commentsList="commentsList"
        :visaId="visaId"
        :baseInfo="baseInfo"
        @get-comments="getComments"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import VisaCommentsList from "./visa-comments-list/VisaCommentsList.vue";
import { useVisa } from "@/state/visa";
import { useUser } from "@/state/user";
import { fullName } from "@/utils/users";

export default {
  components: { VisaCommentsList },
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
    const { fetchAllComments, createComment } = useVisa();
    const { user } = useUser();

    const isAuthorCommenting = ref(false);
    const textContent = ref(null);
    const commentsList = ref([]);

    const { id: currentUserId } = user.value;

    const getComments = async () => {
      const res = await fetchAllComments(props.visaId, props.baseInfo);

      commentsList.value = res
        .map(elem => ({
          ...elem,
          fullName: fullName(elem.author),
          isSelf: elem.author.userId === currentUserId
        }))
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      console.log("commentsList", commentsList);
    };

    const pushComment = async () => {
      if (textContent.value) {
        const data = {
          content: textContent.value
        };
        await createComment(props.visaId, props.baseInfo, data);
        textContent.value = null;
        await getComments();
      }
    };

    onMounted(async () => getComments());

    return {
      // references
      isAuthorCommenting,
      textContent,
      commentsList,
      // methods
      pushComment,
      getComments
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaComments.scss"></style>
