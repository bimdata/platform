<template>
  <div class="visa-add">
    <template v-if="isSelectingValidator">
      <VisaSelectionValidator
        :userList="validatorList || userList"
        @validator-list="getValidatorList"
        @get-back="getBack"
        @safe-zone-handler="safeZoneHandler"
      />
    </template>
    <transition name="fade">
      <template v-if="isSafeZone">
        <div class="visa-add__safe-zone">
          <VisaSafeZone actionType="add" @onClose="onClose" />
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
              >{{ $t("Visa.add.validator") }}
              <div class="visa-add__content__validator__counter">
                <span>{{ validatorListCounter }}</span>
              </div>
            </BIMDataButton>
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
import { ref, watch, onMounted, computed } from "vue";

import VisaSafeZone from "@/components/specific/visa/visa-safe-zone/VisaSafeZone";
import VisaSelectionValidator from "@/components/specific/visa/visa-selection-validator/VisaSelectionValidator.vue";
import { formatDate } from "@/utils/date";
import { useVisa } from "@/state/visa";
import { getUserList, isDateConform } from "@/utils/visas";

export default {
  components: {
    VisaSafeZone,
    VisaSelectionValidator
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
  emits: ["close", "set-file-to-manage", "set-visa-id", "fetch-visas"],
  setup(props, { emit }) {
    const { createVisa, createValidation } = useVisa();

    const dateInput = ref("");
    const descInput = ref("");
    const isSelectingValidator = ref(false);
    const hasDateError = ref(false);
    const isSafeZone = ref(false);
    const isClosing = ref(null);
    const validatorList = ref(null);
    const visaId = ref(null);
    const userList = ref([]);

    const safeZoneHandler = () =>
      dateInput.value.length || descInput.value.length || validatorList.value
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
    const validatorListCounter = computed(
      () =>
        (validatorList.value || []).filter(({ isSelected }) => isSelected)
          .length
    );

    const submit = async () => {
      const dateConform = isDateConform(dateInput.value);

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
          emit("set-file-to-manage", null);
          emit("set-visa-id", visaId.value);
          emit("set-base-info", "documentPk", props.fileParentId);
          emit("fetch-visas");
        }
      } else {
        hasDateError.value = true;
      }
    };

    onMounted(async () => (userList.value = await getUserList(props)));

    return {
      // References
      hasDateError,
      dateInput,
      descInput,
      isSafeZone,
      isClosing,
      isSelectingValidator,
      validatorList,
      validatorListCounter,
      userList,
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
