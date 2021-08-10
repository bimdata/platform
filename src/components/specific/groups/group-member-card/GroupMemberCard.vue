<template>
  <BIMDataCard class="group-member-card">
    <template #content>
      <!--
      <BIMDataButton
        class="group-member-card__btn-menu"
        ghost
        rounded
        icon
        @click.stop="() => {}"
      >
        <BIMDataIcon name="ellipsis" size="l" fill color="tertiary-dark" />
      </BIMDataButton>
      -->
      <UserAvatar :user="user" size="64" />
      <div class="group-member-card__info">
        <div class="group-member-card__info__name">
          {{ fullName }}
        </div>
        <div class="group-member-card__info__email">
          {{ user.email }}
        </div>
      </div>
    </template>
  </BIMDataCard>
</template>

<script>
import { computed } from "vue";
// Components
import UserAvatar from "@/components/specific/users/user-avatar/UserAvatar";

export default {
  components: {
    UserAvatar
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const fullName = computed(
      () => `${props.user.firstname || ""} ${props.user.lastname || ""}`
    );

    return {
      // References
      fullName
    };
  }
};
</script>

<style scoped lang="scss" src="./GroupMemberCard.scss"></style>
