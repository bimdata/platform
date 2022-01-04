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
      <template v-if="people.isSelf && people.status != STATUS.PENDING">
        <BIMDataButton
          color="silver"
          radius
          ghost
          margin="0 10px 0 0"
          @click="$emit('reset-visa', people.id)"
        >
          <BIMDataIcon name="reset" size="xs" />
        </BIMDataButton>
      </template>
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
      <template v-if="isAuthor">
        <div class="visa-add-summary-people__right-side__actions">
          <VisaSummaryPeopleActions
            :validationId="people.id"
            @reset-visa="$emit('reset-visa', $event)"
            @delete-val="$emit('delete-val', $event)"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import UserAvatar from "@/components/specific/users/user-avatar/UserAvatar";
import VisaSummaryPeopleActions from "./visa-summary-people-actions/VisaSummaryPeopleActions.vue";

import STATUS from "@/config/visa-status";

export default {
  components: { UserAvatar, VisaSummaryPeopleActions },
  props: {
    peopleList: {
      type: Object,
      required: true
    },
    isAuthor: {
      type: Boolean,
      required: true
    }
  },
  emits: ["reset-visa", "delete-val"],
  setup() {
    return {
      // references
      STATUS
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaSummaryPeople.scss"></style>
