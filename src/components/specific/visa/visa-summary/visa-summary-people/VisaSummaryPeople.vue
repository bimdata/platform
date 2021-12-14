<template>
  <div
    class="visa-add-summary-people"
    v-for="people in peopleList"
    :key="people.id"
  >
    <div class="visa-add-summary-people__left-side">
      <UserAvatar :user="people.validator" size="25" />
      <span>{{ people.fullName || people.validator.email }}</span>
    </div>
    <div
      class="visa-add-summary-people__right-side"
      :class="`visa-add-summary-people__right-side__${people.status}`"
    >
      <span>
        {{
          $t(
            `Visa.summary.people.${
              people.status === STATUS.PENDING
                ? "pending"
                : people.status === STATUS.ACCEPT
                ? "accept"
                : "deny"
            }`
          )
        }}
      </span>
      <BIMDataIcon
        :name="
          people.status === STATUS.PENDING
            ? 'sandglass'
            : people.status === STATUS.ACCEPT
            ? 'visa'
            : 'failed'
        "
        size="xs"
      />
    </div>
  </div>
</template>

<script>
import UserAvatar from "@/components/specific/users/user-avatar/UserAvatar";

import STATUS from "@/config/visa-status";
export default {
  components: { UserAvatar },
  props: {
    peopleList: {
      type: Object,
      required: true
    }
  },
  setup() {
    return {
      // references
      STATUS
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaSummaryPeople.scss"></style>
