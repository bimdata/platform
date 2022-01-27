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
        initialsSize="14"
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
            {{ $t(`Visa.summary.people.${validationStatus(people)}`) }}
          </span>
          <BIMDataIcon
            :name="iconStatus(people)"
            size="xs"
            style="margin-top: 2px"
          />
        </div>
      </template>
      <template v-else>
        <div
          class="visa-add-summary-people__right-side__access-denied"
          :class="{ author: isAuthor, closed: isClosed }"
          @mouseover="handleCurrentPerson(people.id)"
          @mouseleave="handleCurrentPerson()"
        >
          <BIMDataIcon name="warning" customSize="40" class="fill-warning" />
          <div
            v-if="isWarningHover && currentPeopleId === people.id"
            class="visa-add-summary-people__right-side__access-denied__hover"
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

    const validationStatus = people => {
      const { hasCommented, status } = people;

      if (hasCommented && status === VALIDATION_STATUS.PENDING) {
        return "commented";
      } else if (people.status === VALIDATION_STATUS.PENDING) {
        return "pending";
      } else if (people.status === VALIDATION_STATUS.ACCEPT) {
        return "accept";
      } else if (people.status === VALIDATION_STATUS.DENY) {
        return "deny";
      }
    };

    const iconStatus = people => {
      const { hasCommented, status } = people;

      if (hasCommented && status === VALIDATION_STATUS.PENDING) {
        return "comment";
      } else if (people.status === VALIDATION_STATUS.PENDING) {
        return "sandglass";
      } else if (people.status === VALIDATION_STATUS.ACCEPT) {
        return "visa";
      } else if (people.status === VALIDATION_STATUS.DENY) {
        return "failed";
      }
    };

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
      handleCurrentPerson,
      validationStatus,
      iconStatus
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaSummaryPeople.scss"></style>
