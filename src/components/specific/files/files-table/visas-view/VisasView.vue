<template>
  <BIMDataTable
    tableLayout="fixed"
    :columns="columns"
    :rows="visas"
    rowKey="id"
    :rowHeight="48"
    :selectable="true"
    class="files-table visas-view"
  >
    <template #cell-validation="{ row: visa }">
      <div class="validation-tag" :class="validationClasses(visa)">
        <BIMDataIcon :name="validationIcon(visa)" size="xs" fill color="default" margin="0 6px 0 0" />
        <span>{{ validationType(visa) }}</span>
      </div>
    </template>
    <template #cell-type="{ row: visa }">
      <BIMDataFileIcon :fileName="visa.document.name" :size="21.5" />
    </template>
    <template #cell-file="{ row: visa }">
      {{ visa.document.name }}
    </template>
    <template #cell-validator="{ row: visa }">
      <UserAvatarList
        class="group-card__avatars"
        :users="visa.validations.map((validation) => validation.validator)"
        itemSize="28"
        itemGap="18"
      />
    </template>
    <template #cell-due_date="{ row: visa }">
      {{ $d(visa.deadline, "short") }}
    </template>
    <template #cell-status="{ row: visa }">
      <div class="visas-view__status" :class="{'delay': isDelay(visa), [statusIcon(visa)]: true}">
        <BIMDataIcon :name="statusIcon(visa)" size="xs" fill color="default" margin="0 12px 0 0" />
        {{ statusType(visa) }}
      </div>
    </template>
    <template #cell-buttons="{ row: visa }">
      <BIMDataButton v-if="fullName(user) === fullName(visa.creator)" color="default" outline radius @click="$emit('reach-visa', visa)" class="validate-visa-btn">
        {{ $t("Visa.view.validateVisaBtn") }}
      </BIMDataButton>
      <BIMDataButton v-else color="primary" outline radius  @click="$emit('reach-visa', visa)">
        {{ $t("Visa.view.openVisaBtn") }}
      </BIMDataButton>
    </template>
    <template #cell-actions="{ row: visa }">
      <VisaActionsCell :visa="visa" />
    </template>
  </BIMDataTable>
</template>

<script>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import columnsDef from "./columns.js";
import { VISA_STATUS, VALIDATION_STATUS } from "../../../../../config/visa.js";
import { useUser } from "../../../../../state/user.js";
import { fullName } from "../../../../../utils/users";

import UserAvatarList from "../../../users/user-avatar-list/UserAvatarList.vue";
import VisaActionsCell from "../visa-actions-cell/VisaActionsCell.vue";

export default {
  components: {
    UserAvatarList,
    VisaActionsCell,
  },
  props: {
    visas: {
      type: Array,
      required: true,
    },
  },
  emits: ["reach-visa"],
  setup() {
    const { t } = useI18n();
    const { user } = useUser();

    const columns = computed(() => {
      return columnsDef.map((col) => ({
        ...col,
        label: col.label || t(col.text),
      }));
    });

    const validationClasses = visa => {
      if(visa.status === 'C') {
        return 'closed-visa';
      }
      if(fullName(user.value) === fullName(visa.creator)) {
        return 'ask-visa';
      } else {
        return 'waiting-visa';
      }
    }
    const validationType = (visa) => {
      if (visa.status === 'C') {
        return t("Visa.view.visaClosed")
      }
      if (fullName(user.value) === fullName(visa.creator)) {
        return t("Visa.view.myRequests");
      } else {
        return t("Visa.view.visaPending");
      }
    };
    const validationIcon = visa => {
      if(visa.status === 'C') {
        return 'visa';
      }
      if(fullName(user.value) === fullName(visa.creator)) {
        return 'user';
      } else {
        return 'visa';
      }
    }

    const isDelay = (visa) => {
      const todayDate = new Date();
      return visa.deadline < todayDate.setDate(todayDate.getDate() - 1);
    };

    const statusIcon = (visa) => {
      const visaStatuses = visa.validations.map((validation) => validation.status);

      if (visaStatuses.some((status) => status === VALIDATION_STATUS.DENY)) {
        return "failed";
      } else if (visaStatuses.some((status) => status === VALIDATION_STATUS.ACCEPT)) {
        return "success";
      } else if (visaStatuses.every((status) => status === VALIDATION_STATUS.PENDING)) {
        return "sandglass";
      }
    };
    const statusType = (visa) => {
      const visaStatuses = visa.validations.map((validation) => validation.status);
      if (isDelay(visa)) {
        return t("Visa.view.overdue");
      }
      if (visaStatuses.some((status) => status === VALIDATION_STATUS.DENY)) {
        return t("Visa.view.denied");
      } else if (visaStatuses.some((status) => status === VALIDATION_STATUS.ACCEPT)) {
        return t("Visa.view.valid");
      } else if (visaStatuses.every((status) => status === VALIDATION_STATUS.PENDING)) {
        return t("Visa.view.pending");
      }
    }

    return {
      columns,
      user,
      fullName,
      isDelay,
      statusIcon,
      statusType,
      validationClasses,
      validationIcon,
      validationType,
    };
  },
};
</script>

<style lang="scss" scoped src="./VisasView.scss"></style>
