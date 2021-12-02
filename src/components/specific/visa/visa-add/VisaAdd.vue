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
        :error="hasError"
        :errorMessage="$t('Visa.add.errorDate')"
      >
      </BIMDataInput>
    </div>
    <div class="visa-add__description">
      <BIMDataInput
        v-model="descInput"
        :placeholder="$t('Visa.add.description')"
      >
      </BIMDataInput>
    </div>
    <div class="visa-add__action-button">
      <BIMDataButton color="primary" radius>{{
        $t("Visa.add.cancel")
      }}</BIMDataButton>
      <BIMDataButton color="primary" fill radius @click="submit">{{
        $t("Visa.add.validate")
      }}</BIMDataButton>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  emits: ["close"],
  setup() {
    const dateInput = ref("");
    const descInput = ref("");

    const hasError = ref(false);

    const isDateConform = ({ value }) => {
      const regDate = new RegExp(
        /^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4}|[0-9]{2})$/
      );
      const regValid = value.match(regDate);

      return regValid ? true : false;
    };

    const isDescConform = ({ value }) => (value.length > 100 ? false : true);

    const submit = () => {
      const dateConform = isDateConform(dateInput);
      const descConform = isDescConform(descInput);

      console.log("dateConform", dateConform);
      console.log("descConform", descConform);
    };

    return {
      // References
      hasError,
      dateInput,
      descInput,
      // Methods
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaAdd.scss"></style>
