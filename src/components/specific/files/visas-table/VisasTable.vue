<template>
  <BIMDataTable
    class="files-table visas-table"
    data-test-id="visas-table"
    tableLayout="fixed"
    :columns="columns"
    :rows="enhancedVisas"
    rowKey="id"
    :rowHeight="48"
    :selectable="true"
    @selection-changed="$emit('selection-changed', $event)"
    :placeholder="$t('t.emptyFolder')"
  >
    <template #cell-validationType="{ row: visa }">
      <div class="validation-tag" :class="validationClasses(visa)">
        <BIMDataIcon
          :name="validationIcon(visa)"
          size="xs"
          fill
          color="default"
          margin="0 6px 0 0"
        />
        <span>{{ visa.validationType }}</span>
      </div>
    </template>
    <template #cell-type="{ row: visa }">
      <BIMDataFileIcon :fileName="visa.document.name" :size="21.5" />
    </template>
    <template #cell-file="{ row: visa }">
      {{ visa.document.name }}
    </template>
    <template #cell-validators="{ row: visa }">
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
    <template #cell-statutType="{ row: visa }">
      <div class="visas-table__status" :class="statusClasses(visa)">
        <BIMDataIcon :name="statusIcon(visa)" size="xs" fill color="default" margin="0 6px 0 0" />
        <span>{{ visa.statutType }}</span>
      </div>
    </template>
    <template #cell-buttons="{ row: visa }">
      <BIMDataButton
        v-if="fullName(user) === fullName(visa.creator)"
        color="default"
        outline
        radius
        @click="$emit('reach-visa', visa)"
        class="validate-visa-btn"
        data-test-id="btn-open-visa-list"
        width="100px"
      >
        {{ $t("Visa.view.validateVisaBtn") }}
      </BIMDataButton>
      <BIMDataButton
        v-else
        color="primary"
        outline
        radius
        @click="$emit('reach-visa', visa)"
        data-test-id="btn-open-visa-list"
        width="100px"
      >
        {{ $t("Visa.view.openVisaBtn") }}
      </BIMDataButton>
    </template>
    <template #cell-actions="{ row: visa }">
      <VisaActionsCell
        v-if="fullName(user) === fullName(visa.creator)"
        :visa="visa"
        @delete="$emit('delete', visa)"
        @edit-visa="$emit('reach-visa', visa)"
      />
    </template>
  </BIMDataTable>
</template>

<script>
import { computed, watch, ref } from "vue";
import { useI18n } from "vue-i18n";
import columnsDef from "./columns.js";
import { VISA_STATUS, VALIDATION_STATUS } from "../../../../config/visa.js";
import { enhanceVisa } from "../../../../utils/visas.js";
import { useUser } from "../../../../state/user.js";
import { fullName } from "../../../../utils/users.js";

import UserAvatarList from "../../users/user-avatar-list/UserAvatarList.vue";
import VisaActionsCell from "./visa-actions-cell/VisaActionsCell.vue";

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
    selection: {
      type: Array,
    },
  },
  emits: ["delete", "reach-visa", "selection-changed"],
  setup(props) {
    const { t } = useI18n();
    const { user } = useUser();

    const enhancedVisas = ref([]);

    watch(
      () => props.visas,
      (newVisas) => {
        enhancedVisas.value = newVisas.map((visa) => enhanceVisa(visa, user.value, t));
      },
      { immediate: true }
    );

    const columns = computed(() => {
      return columnsDef.map((col) => ({
        ...col,
        label: col.label || t(col.text),
      }));
    });

    const validationClasses = (visa) => {
      if (visa.status === VISA_STATUS.CLOSE) {
        return "closed-visa";
      }
      if (fullName(user.value) === fullName(visa.creator)) {
        return "ask-visa";
      } else {
        return "waiting-visa";
      }
    };
    const validationIcon = (visa) => {
      if (visa.status === VISA_STATUS.CLOSE) {
        return "visa";
      }
      if (fullName(user.value) === fullName(visa.creator)) {
        return "unknownFile";
      } else {
        return "visa";
      }
    };

    const isDelay = (visa) => {
      const todayDate = new Date();
      return visa.deadline < todayDate.setDate(todayDate.getDate() - 1);
    };

    const statusIcon = (visa) => {
      const visaStatuses = visa.validations.map((validation) => validation.status);
      if (visa.status === VISA_STATUS.CLOSE) {
        return "success";
      }
      if (visaStatuses.some((status) => status === VALIDATION_STATUS.DENY)) {
        return "failed";
      } else if (visaStatuses.some((status) => status === VALIDATION_STATUS.ACCEPT)) {
        return "success";
      } else if (visaStatuses.every((status) => status === VALIDATION_STATUS.PENDING)) {
        return "sandglass";
      }
    };
    const statusClasses = (visa) => {
      const visaStatuses = visa.validations.map((validation) => validation.status);
      if (isDelay(visa) && (visaStatuses.every((status) => status === VALIDATION_STATUS.PENDING) && visa.status !== VISA_STATUS.CLOSE)) {
        return "delay";
      } else {
        return statusIcon(visa);
      }
    };

    return {
      columns,
      user,
      fullName,
      enhancedVisas,
      isDelay,
      statusClasses,
      statusIcon,
      validationClasses,
      validationIcon,
    };
  },
};
</script>

<style lang="scss" scoped src="./VisasTable.scss"></style>
