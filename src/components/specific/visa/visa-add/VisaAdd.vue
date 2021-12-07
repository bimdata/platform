<template>
  <div class="visa-add">
      <div class="visa-add__header">
        <div class="visa-add__header__left-side">
          <BIMDataIcon name="validate" size="xxs" />
          <span>{{ $t("Visa.add.title") }}</span>
        </div>
        <div class="right-side">
          <BIMDataButton ghost rounded icon @click="$emit('close')">
            <BIMDataIcon name="close" size="xxxs" />
          </BIMDataButton>
        </div>
      </div>
      <div class="visa-add__validator">
        <BIMDataButton color="primary" fill radius width="100%">{{
          $t("Visa.add.validator")
        }}</BIMDataButton>
      </div>
      <div class="visa-add__validate-date">
        <BIMDataInput
          v-model="dateInput"
          :placeholder="$t('Visa.add.toValidate')"
          :error="hasDateError"
          :errorMessage="$t('Visa.add.errorDate')"
        >
        </BIMDataInput>
      </div>
      <div class="visa-add__description">
        <BIMDataTextarea
          v-model="descInput"
          :label="$t('Visa.add.description')"
          name="description"
          width="100%"
        />
      </div>
      <div class="visa-add__action-button">
        <BIMDataButton color="primary" radius @click="$emit('close')">{{
          $t("Visa.add.cancel")
        }}</BIMDataButton>
        <BIMDataButton color="primary" fill radius @click="submit">{{
          $t("Visa.add.validate")
        }}</BIMDataButton>
      </div>
    </template>
  </div>
</template>

<script>
import { ref } from "vue";

import { formatToDateObject, formatDate, regexDate } from "@/utils/date";
import { useVisa } from "@/state/visa";

export default {
  props: {
    baseInfo: {
      type: Object,
      required: true
    }
  },
  emits: ["close"],
  setup(props) {
    const { createVisa } = useVisa();

    const dateInput = ref("");
    const descInput = ref("");
    const hasDateError = ref(false);

    const isDateConform = ({ value }) => {
      const dateToCompare = formatToDateObject(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return (
        value.match(regexDate) && dateToCompare.getTime() >= today.getTime()
      );
    };

    const submit = async () => {
      const dateConform = isDateConform(dateInput);

      if (dateConform) {
        try {
          hasDateError.value = false;
          await createVisa(
            descInput.value,
            formatDate(dateInput.value),
            props.baseInfo
          );
        } finally {
          console.log("form sent");
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
      // Methods
      submit,
      console
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaAdd.scss"></style>
