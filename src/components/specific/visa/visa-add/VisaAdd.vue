<template>
  <div class="visa-add">
    {{ console.log("hasDateError", hasDateError) }}
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
      <div
        class="visa-add__description"
        :class="{ error: descInput.length > maxLength }"
      >
        {{
          `${$t(
            `Visa.add.${
              handleLength.isTooLong
                ? "tooMuchCharacters"
                : "remainingCharacters"
            }`
          )} ${handleLength.number}`
        }}
      </div>
    </div>
    <div class="visa-add__action-button">
      <BIMDataButton color="primary" radius @click="$emit('close')">{{
        $t("Visa.add.cancel")
      }}</BIMDataButton>
      <BIMDataButton color="primary" fill radius @click="submit">{{
        $t("Visa.add.validate")
      }}</BIMDataButton>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { formatToDateObject, regexDate } from "@/utils/date";

// $t("Visa.add.remainingCharacters");

export default {
  props: {
    fileToManage: {
      type: Object,
      required: false
    }
  },
  emits: ["close"],
  setup() {
    const dateInput = ref("");
    const descInput = ref("");

    const hasDateError = ref(false);
    const hasDescError = ref(false);
    const maxLength = ref(50);

    const isDateConform = ({ value }) => {
      const dateToCompare = formatToDateObject(value);
      const today = new Date().setHours(0, 0, 0, 0);

      return value.match(regexDate) && Math.sign(dateToCompare - today) >= 0
        ? true
        : false;
    };

    const isDescConform = ({ value }) => (value.length > 100 ? false : true);

    const handleLength = computed(() => {
      const descLength = descInput.value.length || 0;

      return descLength <= maxLength.value
        ? {
            isTooLong: false,
            number: maxLength.value - descLength
          }
        : {
            isTooLong: true,
            number: descLength - maxLength.value
          };
    });

    // const lengthRemaining = computed(
    //   () => maxLength.value - descInput.value.length
    // );

    const submit = () => {
      const dateConform = isDateConform(dateInput);
      const descConform = isDescConform(descInput);

      if (!dateConform) return (hasDateError.value = true);
      if (!descConform) return (hasDescError.value = true);

      console.log("dateConform", dateConform);
      console.log("descConform", descConform);

      if (dateConform && descConform) {
        console.log("form sent");
      }
    };

    return {
      // References
      hasDateError,
      dateInput,
      descInput,
      handleLength,
      maxLength,
      // Methods
      submit,
      console
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaAdd.scss"></style>
