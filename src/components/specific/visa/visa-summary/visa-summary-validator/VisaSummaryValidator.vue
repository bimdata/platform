<template>
  <div
    class="visa-summary-validator"
    data-test-id="visa-summary-validator-item"
    v-for="user in userList"
    :key="user.id"
  >
    <div class="visa-summary-validator__left-side">
      <UserAvatar
        :user="user.validator || {}"
        size="27"
        initialsSize="14"
        color="silver-light"
        style="box-shadow: var(--box-shadow)"
      />
      <div class="visa-summary-validator__left-side__info">
        <BIMDataTextbox
          class="visa-summary-validator__left-side__info__name"
          :text="user.fullName || user.validator.email"
        />
        <template v-if="hasVoted(user)">
          <span>{{ $d(user.updated_at, "short") }}</span>
        </template>
      </div>
    </div>
    <div class="visa-summary-validator__right-side">
      <template v-if="!isClosed && user.isSelf && user.status != VALIDATION_STATUS.PENDING">
        <BIMDataButton
          data-test-id="btn-refresh-validation"
          radius
          ghost
          style="margin: 2px 0px 0px 0px"
          @click="$emit('reset-validation', user.id)"
        >
          <BIMDataIconReset size="xs" />
        </BIMDataButton>
      </template>
      <template v-if="user.hasAccess">
        <div
          :class="{
            [`visa-summary-validator__right-side__${user.status}`]: true,
            delayed: validationStatus(user) === 'delayed',
          }"
        >
          <span>
            {{ $t(`Visa.summary.validatorList.${validationStatus(user)}`) }}
          </span>
          <BIMDataIcon :name="iconStatus(user)" size="xs" style="margin-top: 2px" />
        </div>
      </template>
      <template v-else>
        <div
          class="visa-summary-validator__right-side__access-denied"
          :class="{ author: isAuthor, closed: isClosed }"
          @mouseover="hoveringValidator(user.id)"
          @mouseleave="hoveringValidator()"
        >
          <BIMDataIconWarning customSize="40" class="fill-warning" />
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
import { VALIDATION_STATUS } from "../../../../../config/visa.js";

// Components
import UserAvatar from "../../../users/user-avatar/UserAvatar.vue";
import VisaSummaryValidatorActions from "./visa-summary-validator-actions/VisaSummaryValidatorActions.vue";

export default {
  components: {
    UserAvatar,
    VisaSummaryValidatorActions,
  },
  props: {
    userList: {
      type: Object,
      required: true,
    },
    isAuthor: {
      type: Boolean,
      required: true,
    },
    isClosed: {
      type: Boolean,
      required: true,
    },
    visaDeadline: {
      type: Date,
      required: false,
    },
  },
  emits: ["reset-validation", "delete-validation"],
  setup(props) {
    const currentPeopleId = ref(null);
    const isWarningHover = ref(false);

    const hasVoted = (user) => user.status !== VALIDATION_STATUS.PENDING;

    const validationStatus = (user) => {
      const { hasCommented, status } = user;
      if (hasCommented && status === VALIDATION_STATUS.PENDING) {
        return "commented";
      } else if (
        props.visaDeadline &&
        new Date() > new Date(props.visaDeadline) &&
        status === VALIDATION_STATUS.PENDING
      ) {
        return "delayed";
      } else if (user.status === VALIDATION_STATUS.PENDING) {
        return "pending";
      } else if (user.status === VALIDATION_STATUS.ACCEPT) {
        return "accept";
      } else if (user.status === VALIDATION_STATUS.DENY) {
        return "deny";
      }
    };

    const iconStatus = (user) => {
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

    const hoveringValidator = (peopleId) => {
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
      iconStatus,
      hasVoted,
    };
  },
};
</script>

<style scoped lang="scss" src="./VisaSummaryValidator.scss"></style>
