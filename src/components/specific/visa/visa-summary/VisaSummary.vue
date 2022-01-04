<template>
  <template v-if="visa">
    <div class="visa-summary">
      <div class="visa-summary__header">
        <div class="visa-summary__header__left-side">
          <BIMDataIcon name="visa" size="s" />
          <span>{{ $t("Visa.summary.title") }}</span>
        </div>
        <div class="visa-summary__header__right-side">
          <BIMDataButton ghost rounded icon @click="onClose">
            <BIMDataIcon name="close" size="xxxs" />
          </BIMDataButton>
        </div>
      </div>
      <div class="visa-summary__content">
        <div class="visa-summary__content__applicant">
          {{ $t("Visa.summary.appliedBy") }}
          <span>{{ visa.creator.fullName }}</span>
        </div>
        <div v-if="visa.description" class="visa-summary__content__desc">
          <BIMDataTextarea
            v-model="visa.description"
            name="description"
            width="100%"
            readonly="true"
          />
        </div>
        <div class="visa-summary__content__deadline">
          <span class="visa-summary__content__deadline__title">{{
            $t("Visa.summary.term")
          }}</span>
          <span class="visa-summary__content__deadline__date">{{
            visa.deadline
          }}</span>
        </div>
      </div>
      <div class="visa-summary__action-button">
        <BIMDataButton
          class="visa-summary__action-button__validate"
          :class="{ active: isValidateButtonClicked }"
          color="success"
          fill
          radius
          @click="validateVisa"
          >{{ $t("Visa.summary.validate") }}</BIMDataButton
        >
        <BIMDataButton
          class="visa-summary__action-button__deny"
          :class="{ active: isDenyButtonClicked }"
          color="high"
          fill
          radius
          @click="refuseVisa"
          >{{ $t("Visa.summary.deny") }}</BIMDataButton
        >
        <BIMDataButton color="primary" fill radius>{{
          $t("Visa.summary.comment")
        }}</BIMDataButton>
      </div>
      <div class="visa-summary__file">
        <BIMDataFileIcon :fileName="visa.document.fileName" :size="20" />
        <span>{{ visa.document.fileName }}</span>
      </div>
      <div class="visa-summary__validator">
        <span class="visa-summary__validator__title">{{
          $t("Visa.summary.validator")
        }}</span>
        <div class="visa-summary__validator__people-list">
          <VisaSummaryPeople
            :peopleList="visa.validations"
            @reset-visa="restoreVisa"
          />
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import STATUS from "@/config/visa-status";
import VisaSummaryPeople from "./visa-summary-people/VisaSummaryPeople";

import { useVisa } from "@/state/visa";
import { useUser } from "@/state/user";

import { fullName } from "@/utils/users";
import { formatDateDDMMYYY } from "@/utils/date";

export default {
  components: { VisaSummaryPeople },
  props: {
    baseInfo: {
      type: Object,
      required: true
    },
    visaId: {
      type: Number,
      required: true
    },
    isVisaList: {
      type: Boolean,
      required: true
    }
  },
  emits: ["close", "set-visa-id", "set-is-visa-list"],
  setup(props, { emit }) {
    const { fetchVisa, acceptVisa, denyVisa, resetVisa } = useVisa();
    const { loadUser } = useUser();
    const isValidateButtonClicked = ref(false);
    const isDenyButtonClicked = ref(false);
    const visa = ref(null);
    const validationUserId = ref(null);

    const getVisa = async () => {
      try {
        const { id } = await loadUser();

        const res = await fetchVisa(props.visaId, props.baseInfo);
        visa.value = {
          ...res,
          deadline: formatDateDDMMYYY(res.deadline),
          creator: {
            ...res.creator,
            fullName: fullName(res.creator)
          },
          validations: res.validations
            .map(elem => ({
              ...elem,
              userId: elem.validator.userId,
              fullName: fullName(elem.validator),
              isSelf: elem.validator.userId === id
            }))
            .sort((a, b) => {
              if (!a.fullName) return 1;
              if (!b.fullName) return -1;
              return a.fullName < b.fullName ? -1 : 1;
            })
        };
      } catch {
        emit("set-is-visa-list", true);
      }
    };

    const getValidationUserId = async () => {
      validationUserId.value = visa.value.validations.find(
        ({ isSelf }) => isSelf
      ).id;
    };

    const validateVisa = async () => {
      if (isValidateButtonClicked.value) {
        await resetVisa(validationUserId.value, props.visaId, props.baseInfo);
      } else {
        await acceptVisa(validationUserId.value, props.visaId, props.baseInfo);
      }
      await getVisa();
      handleStatusVisa();
    };
    const refuseVisa = async () => {
      if (isDenyButtonClicked.value) {
        await resetVisa(validationUserId.value, props.visaId, props.baseInfo);
      } else {
        await denyVisa(validationUserId.value, props.visaId, props.baseInfo);
      }
      await getVisa();
      handleStatusVisa();
    };

    const restoreVisa = async () => {
      await resetVisa(validationUserId.value, props.visaId, props.baseInfo);
      await getVisa();
      handleStatusVisa();
    };

    const handleStatusVisa = () => {
      isValidateButtonClicked.value = userStatus.value === STATUS.ACCEPT;
      isDenyButtonClicked.value = userStatus.value === STATUS.DENY;
    };

    const userStatus = computed(
      () =>
        visa.value.validations.find(({ id }) => id === validationUserId.value)
          .status
    );

    const onClose = () => {
      emit("set-visa-id", 0);
      if (!props.isVisaList) emit("close");
    };

    onMounted(async () => {
      await getVisa();
      await getValidationUserId();
      handleStatusVisa();
    });
    return {
      // references
      visa,
      validationUserId,
      isValidateButtonClicked,
      isDenyButtonClicked,
      // methods
      validateVisa,
      refuseVisa,
      restoreVisa,
      onClose,
      console
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaSummary.scss"></style>
