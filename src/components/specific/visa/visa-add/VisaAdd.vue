<template>
  <div class="visa-add">
    <template v-if="isSelectingValidator">
      <VisaAddValidator
        :baseInfo="baseInfo"
        :fileParentId="fileParentId"
        @validator-list="getValidatorList"
        @set-back="getBack"
        @safe-zone-handler="safeZoneHandler"
      />
    </template>
    <transition name="fade">
      <template v-if="isSafeZone">
        <div class="visa-add__safe-zone">
          <VisaSafeZone @onClose="onClose" />
        </div>
      </template>
    </transition>
    <transition name="fade">
      <template v-if="!isSelectingValidator">
        <div class="visa-add__content" :class="{ safeZone: isSafeZone }">
          <div class="visa-add__content__header">
            <div class="visa-add__content__header__left-side">
              <BIMDataIcon name="visa" size="s" />
              <span>{{ $t("Visa.add.title") }}</span>
            </div>
            <div class="visa-add__content__header__right-side">
              <BIMDataButton ghost rounded icon @click="safeZoneHandler">
                <BIMDataIcon name="close" size="xxxs" />
              </BIMDataButton>
            </div>
          </div>
          <div class="visa-add__content__validator">
            <BIMDataButton
              color="primary"
              fill
              radius
              width="100%"
              @click="isSelectingValidator = true"
              >{{ $t("Visa.add.validator") }}</BIMDataButton
            >
          </div>
          <div class="visa-add__content__validate-date">
            <BIMDataInput
              v-model="dateInput"
              :placeholder="$t('Visa.add.toValidate')"
              :error="hasDateError"
              :errorMessage="$t('Visa.add.errorDate')"
            >
            </BIMDataInput>
          </div>
          <div class="visa-add__content__description">
            <BIMDataTextarea
              v-model="descInput"
              :label="$t('Visa.add.description')"
              name="description"
              width="100%"
            />
          </div>
          <div class="visa-add__content__action-button">
            <BIMDataButton color="primary" radius @click="safeZoneHandler">{{
              $t("Visa.add.cancel")
            }}</BIMDataButton>
            <BIMDataButton color="primary" fill radius @click="submit">{{
              $t("Visa.add.validate")
            }}</BIMDataButton>
          </div>
        </div>
      </template>
    </transition>
  </div>
</template>

<script>
import { ref, watch } from "vue";

import VisaSafeZone from "@/components/specific/visa/visa-safe-zone/VisaSafeZone";
import VisaAddValidator from "@/components/specific/visa/visa-add/visa-add-validator/VisaAddValidator";
import { formatToDateObject, formatDate, regexDate } from "@/utils/date";
import { useVisa } from "@/state/visa";

export default {
  components: {
    VisaSafeZone,
    VisaAddValidator
  },
  props: {
    baseInfo: {
      type: Object,
      required: true
    },
    fileParentId: {
      type: Number,
      required: true
    }
  },
  emits: ["close", "set-visa-id"],
  setup(props, { emit }) {
    const { createVisa, createValidation } = useVisa();

    const dateInput = ref("");
    const descInput = ref("");
    const isSelectingValidator = ref(false);
    const hasDateError = ref(false);
    const isSafeZone = ref(false);
    const isClosing = ref(null);
    const validatorList = ref([]);
    const visaId = ref(null);

    const isDateConform = ({ value }) => {
      const dateToCompare = formatToDateObject(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return (
        value.match(regexDate) && dateToCompare.getTime() >= today.getTime()
      );
    };

    const safeZoneHandler = () =>
      dateInput.value.length ||
      descInput.value.length ||
      validatorList.value.length
        ? (isSafeZone.value = true)
        : emit("close");

    watch(isClosing, () => {
      isSafeZone.value = false;
      if (isClosing.value) {
        emit("close");
      }
      isClosing.value = null;
    });

    const onClose = event => (isClosing.value = event);
    const getBack = () => (isSelectingValidator.value = false);
    const getValidatorList = event => (validatorList.value = event.value);

    const submit = async () => {
      const dateConform = isDateConform(dateInput);

      if (dateConform) {
        try {
          hasDateError.value = false;
          const res = await createVisa(
            descInput.value,
            formatDate(dateInput.value),
            props.baseInfo
          );
          visaId.value = res.id;
          await Promise.all(
            validatorList.value
              .filter(({ isSelected }) => isSelected)
              .map(({ id }) =>
                createValidation(visaId.value, id, props.baseInfo)
              )
          );
        } finally {
          console.log("form sent");
          emit("set-visa-id", visaId.value);
        }
      } else {
        hasDateError.value = true;
      }
    };

    return {
      // References
      hasDateError,
      dateInput,
      descInput,
      isSafeZone,
      isClosing,
      isSelectingValidator,
      validatorList,
      // Methods
      submit,
      onClose,
      safeZoneHandler,
      getValidatorList,
      getBack
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaAdd.scss"></style>
