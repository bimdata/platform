<template>
  <div class="visa-summary-validator" v-for="user in userList" :key="user.id">
    <div class="visa-summary-validator__left-side">
      <UserAvatar
        :user="user.validator || {}"
        size="27"
        initialsSize="14"
        color="silver-light"
        style="box-shadow: var(--box-shadow)"
      />
      <BIMDataTextbox
        class="visa-summary-validator__left-side__name"
        :text="user.fullName || user.validator.email"
      />
    </div>
    <div class="visa-summary-validator__right-side">
      <template
        v-if="
          !isClosed && user.isSelf && user.status != VALIDATION_STATUS.PENDING
        "
      >
        <BIMDataButton
          radius
          ghost
          style="margin: 2px 0px 0px 0px"
          @click="$emit('reset-validation', user.id)"
        >
          <BIMDataIcon name="reset" size="xs" />
        </BIMDataButton>
      </template>
      <template v-if="user.hasAccess">
        <div :class="`visa-summary-validator__right-side__${user.status}`">
          <span>
            {{ $t(`Visa.summary.validatorList.${validationStatus(user)}`) }}
          </span>
          <BIMDataIcon
            :name="iconStatus(user)"
            size="xs"
            style="margin-top: 2px"
          />
        </div>
      </template>
      <template v-else>
        <div
          class="visa-summary-validator__right-side__access-denied"
          :class="{ author: isAuthor, closed: isClosed }"
          @mouseover="hoveringValidator(user.id)"
          @mouseleave="hoveringValidator()"
        >
          <BIMDataIcon name="warning" customSize="40" class="fill-warning" />
          <div
            v-if="isWarningHover && currentPeopleId === user.id"
            class="visa-summary-validator__right-side__access-denied__hover"
          >
            <span>{{ $t("Visa.selectionValidator.warning") }}</span>
          </div>
        </div>
      </template>
      <template v-if="isAuthor && !isClosed">
        <div class="visa-summary-validator__right-side__actions">
          <VisaSummaryValidatorActions
            :validationId="user.id"
            :hasAccess="user.hasAccess"
            @reset-validation="$emit('reset-validation', $event)"
            @delete-validation="$emit('delete-validation', $event)"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import UserAvatar from "@/components/specific/users/user-avatar/UserAvatar";
import VisaSummaryValidatorActions from "./visa-summary-validator-actions/VisaSummaryValidatorActions.vue";

import { VALIDATION_STATUS } from "@/config/visa";

export default {
  components: { UserAvatar, VisaSummaryValidatorActions },
  props: {
    userList: {
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
  emits: ["reset-validation", "delete-validation"],
  setup() {
    const currentPeopleId = ref(null);
    const isWarningHover = ref(false);

    const validationStatus = user => {
      const { hasCommented, status } = user;

      if (hasCommented && status === VALIDATION_STATUS.PENDING) {
        return "commented";
      } else if (user.status === VALIDATION_STATUS.PENDING) {
        return "pending";
      } else if (user.status === VALIDATION_STATUS.ACCEPT) {
        return "accept";
      } else if (user.status === VALIDATION_STATUS.DENY) {
        return "deny";
      }
    };

    const iconStatus = user => {
      const { hasCommented, status } = user;

      if (hasCommented && status === VALIDATION_STATUS.PENDING) {
        return "comment";
      } else if (user.status === VALIDATION_STATUS.PENDING) {
        return "sandglass";
      } else if (user.status === VALIDATION_STATUS.ACCEPT) {
        return "visa";
      } else if (user.status === VALIDATION_STATUS.DENY) {
        return "failed";
      }
    };

    const hoveringValidator = peopleId => {
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
      hoveringValidator,
      validationStatus,
      iconStatus
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaSummaryValidator.scss"></style>
