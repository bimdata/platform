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
            <BIMDataIconVisa
              fill
              color="primary"
              size="s"
              margin="2.5px 0 0 0"
            />
            <span>{{ $t("Visa.add.title") }}</span>
          </div>
          <div class="visa-add__content__header__right-side">
            <BIMDataButton ghost rounded icon @click="safeZoneHandler">
              <BIMDataIconClose size="xxs" fill color="granite-light" />
            </BIMDataButton>
          </div>
        </div>
        <div class="visa-add__content__validator">
          <BIMDataButton
            data-test-id="btn-add-visa-validator"
            color="primary"
            fill
            radius
            width="100%"
            @click="isSelectingValidator = true"
          >
            {{ $t("Visa.validator") }}
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
          <BIMDataDatePicker
            v-model="dateInput"
            :clearButton="true"
            width="100%"
            :placeholder="$t('Visa.add.dateInputPlaceholder')"
            :disabledDates="disabledDates(dateInput)"
            :showEdgeDates="false"
          >
          </BIMDataDatePicker>
        </div>
        <div class="visa-add__content__description">
          <BIMDataTextarea
            v-model="descInput"
            :label="$t('t.description')"
            name="description"
            fitContent
            :resizable="false"
            rows="1"
            width="100%"
          />
        </div>
        <div class="visa-add__content__action-button">
          <BIMDataButton color="primary" radius @click="safeZoneHandler">
            {{ $t("t.cancel") }}
          </BIMDataButton>
          <BIMDataButton
            data-test-id="btn-submit-visa-creation"
            color="primary"
            fill
            radius
            @click="submit"
          >
            {{ $t("t.validate") }}
          </BIMDataButton>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, watch, onMounted, computed } from "vue";
import { useProjects } from "../../../../state/projects.js";
import { useVisa } from "../../../../state/visa.js";
import { debounce } from "../../../../utils/async.js";
import { localeDate } from "../../../../utils/date.js";
// Components
import VisaSafeZone from "../visa-safe-zone/VisaSafeZone.vue";
import VisaSelectionValidator from "../visa-selection-validator/VisaSelectionValidator.vue";

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

    const dateInput = ref(new Date());
    const descInput = ref("");
    const isSelectingValidator = ref(false);
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

    const disabledDates = () => {
      return {
        customPredictor: date => {
          const todayDate = new Date();
          if (date < todayDate.setDate(todayDate.getDate() - 1)) {
            return true;
          }
        }
      };
    };

    const submit = debounce(async () => {
      if (dateInput.value && validatorListCounter.value) {
        hasNoValidator.value = false;

        const visa = await createVisa(props.project, props.document, {
          deadline: localeDate(dateInput.value),
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
        hasNoValidator.value = !validatorListCounter.value;
      }
    }, 500);

    onMounted(async () => {
      userList.value = await getUserProjectList(props.project, {
        id: props.document.parent_id
      });
    });

    return {
      // References
      disabledDates,
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
