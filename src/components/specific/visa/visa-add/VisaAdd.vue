<template>
  <div class="visa-add">
    <template v-if="isSelectingValidator">
      <VisaSelectionValidator
        :userList="validatorList || userList"
        @validator-list="getValidatorList"
        @get-back="getBack"
      />
    </template>
    <transition name="fade">
      <template v-if="isSafeZone">
        <div class="visa-add__safe-zone">
          <VisaSafeZone actionType="add" @close="onClose" />
        </div>
      </template>
    </transition>
    <template v-if="!isSelectingValidator">
      <div class="visa-add__content" :class="{ safeZone: isSafeZone }">
        <div class="visa-add__content__header">
          <div class="visa-add__content__header__left-side">
            <BIMDataIcon
              name="visa"
              fill
              color="primary"
              size="s"
              margin="2.5px 0 0 0"
            />
            <span>{{ $t("Visa.add.title") }}</span>
          </div>
          <div class="visa-add__content__header__right-side">
            <BIMDataButton ghost rounded icon @click="safeZoneHandler">
              <BIMDataIcon name="close" size="xxs" fill color="granite-light" />
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
          <template v-if="hasNoValidator">
            <div class="visa-add__content__validator__error">
              {{ $t("Visa.add.errorValidator") }}
            </div>
          </template>
        </div>
        <div class="visa-add__content__validate-date">
          <BIMDataInput
            v-model="dateInput"
            :placeholder="$t('Visa.add.toValidate')"
            :error="hasDateError"
            :errorMessage="$t('Visa.add.errorDate')"
          >
          </BIMDataInput>
          <div class="visa-add__content__validate-date__exemple">
            {{ $t("Visa.add.exempleDate") }}
          </div>
        </div>
        <div class="visa-add__content__description">
          <BIMDataTextarea
            v-model="descInput"
            :label="$t('Visa.add.description')"
            name="description"
            fitContent
            :resizable="false"
            rows="1"
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
  </div>
</template>

<script>
import { ref, watch, onMounted, computed } from "vue";

import VisaSafeZone from "@/components/specific/visa/visa-safe-zone/VisaSafeZone";
import VisaSelectionValidator from "@/components/specific/visa/visa-selection-validator/VisaSelectionValidator.vue";
import { formatDate } from "@/utils/date";
import { useVisa } from "@/state/visa";
import { useProjects } from "@/state/projects";
import { isDateValid } from "@/utils/visas";

export default {
  components: {
    VisaSafeZone,
    VisaSelectionValidator
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    document: {
      type: Object,
      required: true
    }
  },
  emits: ["create-visa", "close"],
  setup(props, { emit }) {
    const { createVisa, createValidation } = useVisa();
    const { getUserProjectList } = useProjects();

    const dateInput = ref("");
    const descInput = ref("");
    const isSelectingValidator = ref(false);
    const hasDateError = ref(false);
    const hasNoValidator = ref(false);
    const isSafeZone = ref(false);
    const isClosing = ref(null);
    const validatorList = ref(null);
    const userList = ref([]);

    const safeZoneHandler = () =>
      dateInput.value || descInput.value || validatorList.value
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
    const getValidatorList = list => (validatorList.value = list);
    const validatorListCounter = computed(
      () =>
        (validatorList.value || []).filter(({ isSelected }) => isSelected)
          .length
    );

    const submit = async () => {
      const dateValid = isDateValid(dateInput.value);

      if (dateValid && validatorListCounter.value) {
        hasDateError.value = false;
        hasNoValidator.value = false;

        const visa = await createVisa(props.project, props.document, {
          deadline: formatDate(dateInput.value),
          description: descInput.value
        });
        await Promise.all(
          validatorList.value
            .filter(({ isSelected }) => isSelected)
            .map(({ id: validatorId }) =>
              createValidation(props.project, props.document, visa, validatorId)
            )
        );
        emit("create-visa", visa);
      } else {
        hasDateError.value = !dateValid;
        hasNoValidator.value = !validatorListCounter.value;
      }
    };

    onMounted(async () => {
      userList.value = await getUserProjectList(props.project, {
        id: props.document.parentId
      });
    });

    return {
      // References
      hasDateError,
      hasNoValidator,
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
