<template>
  <div
    class="visa-add-summary-people"
    v-for="people in peopleList"
    :key="people.id"
  >
    <div class="visa-add-summary-people__left-side">
      <UserAvatar
        :user="people.validator || {}"
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
    <div class="visa-add-summary-people__right-side">
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
          style="margin: 2px 0px 0px 0px"
          @click="$emit('reset-val', people.id)"
        >
          <BIMDataIcon name="reset" size="xs" />
        </BIMDataButton>
      </template>
      <template v-if="people.hasAccess">
        <div :class="`visa-add-summary-people__right-side__${people.status}`">
          <span>
            {{
              $t(
                `Visa.summary.people.${
                  people.hasCommented &&
                  people.status === VALIDATION_STATUS.PENDING
                    ? "commented"
                    : people.status === VALIDATION_STATUS.PENDING
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
              people.hasCommented && people.status === VALIDATION_STATUS.PENDING
                ? 'comment'
                : people.status === VALIDATION_STATUS.PENDING
                ? 'sandglass'
                : people.status === VALIDATION_STATUS.ACCEPT
                ? 'visa'
                : 'failed'
            "
            size="xs"
            style="margin-top: 2px"
          />
        </div>
      </template>
      <template v-else>
        <div
          class="visa-add-summary-people__right-side__access-denied"
          :style="isAuthor ? 'right: -8px;' : 'right: -12px'"
          @mouseover="handleCurrentPerson(people.id)"
          @mouseleave="handleCurrentPerson()"
        >
          <BIMDataIcon
            name="warning"
            customSize="40"
            class="fill-warning"
            style="padding: 10px; z-index: 3"
          />
          <div
            v-if="isWarningHover && currentPeopleId === people.id"
            class="visa-add-summary-people__right-side__access-denied__hover"
            :style="isAuthor ? 'width: 345px; right: -36px' : 'width: 340px'"
          >
            <span>{{ $t("Visa.selectionValidator.warning") }}</span>
          </div>
        </div>
      </template>
      <template v-if="isAuthor && !isClosed">
        <div class="visa-add-summary-people__right-side__actions">
          <VisaSummaryPeopleActions
            :validationId="people.id"
            :hasAccess="people.hasAccess"
            @reset-val="$emit('reset-val', $event)"
            @delete-user="$emit('delete-user', $event)"
          />
        </div>
      </template>
    </div>
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
      // methods
      handleCurrentPerson
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaSummaryPeople.scss"></style>
