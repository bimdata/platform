<template>
  <div
    class="visa-add-summary-people"
    v-for="people in peopleList"
    :key="people.id"
  >
    <div class="visa-add-summary-people__left-side">
      <UserAvatar
        :user="people.validator"
        size="27"
        sizeInitials="14"
        color="silver-light"
        style="box-shadow: var(--box-shadow)"
      />
      <BIMDataTextBox
        class="visa-add-summary-people__left-side__name"
        :text="people.fullName || people.validator.email"
      />
    </div>
    <template v-if="!people.hasAccess">
      <div
        class="visa-add-summary-people__right-side__access-denied"
        :class="`visa-add-summary-people__right-side__access-denied${
          isAuthor ? '__author' : ''
        }`"
        @mouseover="handleCurrentPerson(people.id)"
        @mouseleave="handleCurrentPerson()"
      >
        <BIMDataIcon
          name="warning"
          size="xl"
          class="fill-warning"
          style="padding: 10px"
        />
        <div
          v-if="isWarningHover && currentPeopleId === people.id"
          class="visa-add-summary-people__right-side__access-denied__hover"
        >
          <span
            class="visa-add-summary-people__right-side__access-denied__hover__message"
            >{{ $t("Visa.selectionValidator.warning") }}</span
          >
        </div>
      </div>
    </template>
    <template v-else>
      <div
        class="visa-add-summary-people__right-side"
        :class="`visa-add-summary-people__right-side__${people.status}`"
      >
        <template
          v-if="
            !isClosed &&
            people.isSelf &&
            people.status != VALIDATION_STATUS.PENDING
          "
        >
          <BIMDataButton
            radius
            ghost
            margin="0 10px 0 0"
            @click="$emit('reset-val', people.id)"
          >
            <BIMDataIcon name="reset" size="xs" />
          </BIMDataButton>
        </template>
        <span>
          {{
            $t(
              `Visa.summary.people.${
                people.status === VALIDATION_STATUS.PENDING
                  ? "pending"
                  : people.status === VALIDATION_STATUS.ACCEPT
                  ? "accept"
                  : "deny"
              }`
            )
          }}
        </span>
        <BIMDataIcon
          :name="
            people.status === VALIDATION_STATUS.PENDING
              ? 'sandglass'
              : people.status === VALIDATION_STATUS.ACCEPT
              ? 'visa'
              : 'failed'
          "
          size="xs"
        />
        <template v-if="isAuthor && !isClosed">
          <div class="visa-add-summary-people__right-side__actions">
            <VisaSummaryPeopleActions
              :validationId="people.id"
              @reset-val="$emit('reset-val', $event)"
              @delete-user="$emit('delete-user', $event)"
            />
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { ref } from "vue";
import UserAvatar from "@/components/specific/users/user-avatar/UserAvatar";
import VisaSummaryPeopleActions from "./visa-summary-people-actions/VisaSummaryPeopleActions.vue";

import VALIDATION_STATUS from "@/config/visa-validation-status";

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
    },
    isClosed: {
      type: Boolean,
      required: true
    }
  },
  emits: ["reset-val", "delete-user"],
  setup() {
    const currentPeopleId = ref(null);
    const isWarningHover = ref(false);

    const handleCurrentPerson = peopleId => {
      if (peopleId) {
        isWarningHover.value = true;
        currentPeopleId.value = peopleId;
      } else {
        isWarningHover.value = false;
        currentPeopleId.value = null;
      }
    };

    return {
      // references
      VALIDATION_STATUS,
      isWarningHover,
      currentPeopleId,
      console,
      // methods
      handleCurrentPerson
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaSummaryPeople.scss"></style>
