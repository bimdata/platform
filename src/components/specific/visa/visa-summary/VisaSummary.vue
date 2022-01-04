<template>
  <div class="visa-summary">
    <template v-if="isSelectingValidator">
      <VisaSelectionValidator
        :userList="userList"
        @validator-list="getValidatorList"
        @get-back="getBack"
      />
    </template>
    <transition name="fade">
      <template v-if="isSafeZone">
        <div class="visa-summary__safe-zone">
          <VisaSafeZone :actionType="safeZoneInfo.type" @onClose="onSafeZone" />
        </div>
      </template>
    </transition>
    <template v-if="visa && !isSelectingValidator">
      <div class="visa-summary__shell" :class="{ safeZone: isSafeZone }">
        <div class="visa-summary__shell__header">
          <div class="visa-summary__shell__header__left-side">
            <BIMDataIcon name="visa" size="s" />
            <span>{{ $t("Visa.summary.title") }}</span>
          </div>
          <div class="visa-summary__shell__header__right-side">
            <BIMDataButton ghost rounded icon @click="actions.close">
              <BIMDataIcon name="close" size="xxxs" />
            </BIMDataButton>
          </div>
        </div>
        <div class="visa-summary__shell__content">
          <div class="visa-summary__shell__content__applicant">
            {{ $t("Visa.summary.appliedBy") }}
            <span>{{ visa.creator.fullName }}</span>
          </div>
          <div
            v-if="visa.description"
            class="visa-summary__shell__content__desc"
          >
            <BIMDataTextarea
              v-model="visa.description"
              name="description"
              width="100%"
              readonly="true"
            />
          </div>
          <div class="visa-summary__shell__content__deadline">
            <span class="visa-summary__shell__content__deadline__title">{{
              $t("Visa.summary.term")
            }}</span>
            <span class="visa-summary__shell__content__deadline__date">{{
              visa.deadline
            }}</span>
          </div>
        </div>
        <div class="visa-summary__shell__action-button">
          <template v-if="isAuthor">
            <BIMDataButton
              class="visa-summary__shell__action-button__delete"
              color="high"
              fill
              radius
              @click="safeZoneHandler('delete')"
              >{{ $t("Visa.summary.delete") }}</BIMDataButton
            >
            <BIMDataButton
              class="visa-summary__shell__action-button__close"
              color="primary"
              fill
              radius
              :disabled="visa.status === 'C'"
              @click="safeZoneHandler('closeVisa')"
              >{{ $t("Visa.summary.close") }}</BIMDataButton
            >
          </template>
          <template v-else>
            <BIMDataButton
              class="visa-summary__shell__action-button__validate"
              :class="{ active: actions.validate.isActive }"
              color="success"
              fill
              radius
              @click="responseHandler('validate')"
              >{{ $t("Visa.summary.validate") }}</BIMDataButton
            >
            <BIMDataButton
              class="visa-summary__shell__action-button__deny"
              :class="{ active: actions.refuse.isActive }"
              color="high"
              fill
              radius
              @click="responseHandler('refuse')"
              >{{ $t("Visa.summary.deny") }}</BIMDataButton
            >
            <BIMDataButton color="primary" fill radius>{{
              $t("Visa.summary.comment")
            }}</BIMDataButton>
          </template>
        </div>
        <div class="visa-summary__shell__file">
          <BIMDataFileIcon :fileName="visa.document.fileName" :size="20" />
          <span>{{ visa.document.fileName }}</span>
        </div>
        <div class="visa-summary__shell__validator">
          <div class="visa-summary__shell__validator__header">
            <span class="visa-summary__shell__validator__header__title">{{
              $t("Visa.summary.validator")
            }}</span>
            <BIMDataButton ghost rounded icon>
              <BIMDataIcon
                name="addUser"
                size="s"
                @click="isSelectingValidator = true"
              />
            </BIMDataButton>
          </div>
          <div class="visa-summary__shell__validator__people-list">
            <VisaSummaryPeople
              :isAuthor="isAuthor"
              :peopleList="visa.validations"
              @reset-visa="actions.reset"
              @delete-val="actions.deleteVal"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import STATUS from "@/config/visa-status";
import VisaSummaryPeople from "./visa-summary-people/VisaSummaryPeople";
import VisaSafeZone from "../visa-safe-zone/VisaSafeZone";
import VisaSelectionValidator from "@/components/specific/visa/visa-selection-validator/VisaSelectionValidator.vue";

import { useVisa } from "@/state/visa";
import { useUser } from "@/state/user";

import { fullName } from "@/utils/users";
import { formatDateDDMMYYY } from "@/utils/date";
import { getUserList } from "@/utils/visas";

export default {
  components: { VisaSummaryPeople, VisaSafeZone, VisaSelectionValidator },
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
    const {
      fetchVisa,
      acceptVisa,
      denyVisa,
      resetVisa,
      deleteVisa,
      closeVisa,
      createValidation,
      deleteValidation
    } = useVisa();

    const { loadUser } = useUser();
    const isValidated = ref(false);
    const isDenied = ref(false);
    const visa = ref(null);
    const validationUserId = ref(null);
    const isAuthor = ref(false);
    const isSafeZone = ref(false);
    const userList = ref(null);
    const validatorList = ref(null);
    const isSelectingValidator = ref(false);
    const safeZoneInfo = ref({
      type: null,
      action: null
    });
    const actions = ref({
      validate: {
        isActive: false,
        action: async () =>
          acceptVisa(validationUserId.value, props.visaId, props.baseInfo)
      },
      refuse: {
        isActive: false,
        action: async () =>
          denyVisa(validationUserId.value, props.visaId, props.baseInfo)
      },
      reset: async validationId => {
        await resetVisa(validationId, props.visaId, props.baseInfo);
        await fetchAllVisaInfo();
      },
      delete: async () => deleteVisa(props.visaId, props.baseInfo),
      closeVisa: async () => closeVisa(props.visaId, props.baseInfo),
      close: () => {
        emit("set-visa-id", 0);
        if (!props.isVisaList) emit("close");
      },
      createVal: async id => createValidation(props.visaId, id, props.baseInfo),
      deleteVal: async validationId => {
        deleteValidation(validationId, props.visaId, props.baseInfo);
        await fetchAllVisaInfo();
      }
    });

    const userStatus = computed(
      () =>
        validationUserId.value &&
        visa.value.validations.find(({ id }) => id === validationUserId.value)
          .status
    );

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
        if (visa.value.creator.userId === id) isAuthor.value = true;
      } catch {
        emit("set-is-visa-list", true);
      }
    };

    const getValidationUserId = async () => {
      validationUserId.value = visa.value.validations.find(
        ({ isSelf }) => isSelf
      ).id;
    };

    const statusVisaHandler = () => {
      actions.value.validate.isActive = userStatus.value === STATUS.ACCEPT;
      actions.value.refuse.isActive = userStatus.value === STATUS.DENY;
    };

    const responseHandler = async type => {
      if (actions.value[type].isActive) {
        await actions.value.reset(validationUserId.value);
      } else {
        await actions.value[type].action();
      }
      await fetchAllVisaInfo();
    };

    const safeZoneHandler = type => {
      if (type) {
        isSafeZone.value = true;
        safeZoneInfo.value = {
          type,
          action: actions.value[type]
        };
      } else {
        isSafeZone.value = false;
        safeZoneInfo.value = null;
      }
    };

    const onSafeZone = async event => {
      const { type } = safeZoneInfo.value;
      if (event) {
        await actions.value[type]();
        actions.value.close();
        emit("fetch-visas");
      }
      safeZoneHandler();
      isSafeZone.value = false;
    };

    const getBack = () => (isSelectingValidator.value = false);
    const getValidatorList = event => (validatorList.value = event.value);

    watch(validatorList, async () => {
      await Promise.all(
        validatorList.value
          .map(({ isSelected, id, validation }) => {
            const isToAdd =
              isSelected &&
              userList.value.some(user => user.id === id && !user.isSelected);
            const isToDel =
              !isSelected &&
              userList.value.some(user => user.id === id && user.isSelected);
            return {
              id,
              validationId: validation.id,
              isToAdd,
              isToDel
            };
          })
          .filter(({ isToAdd, isToDel }) => isToAdd || isToDel)
          .map(async ({ id, validationId, isToAdd, isToDel }) => {
            if (isToAdd) {
              await actions.value.createVal(id);
            } else if (isToDel) {
              await actions.value.deleteVal(validationId);
            }
          })
      );
      await fetchAllVisaInfo();
    });

    const fetchAllVisaInfo = async () => {
      await getVisa();
      userList.value = await getUserList(
        {
          baseInfo: props.baseInfo,
          fileParentId: visa.value.document.parentId
        },
        visa.value.validations
      );
      statusVisaHandler();
    };

    onMounted(async () => {
      await fetchAllVisaInfo();
      !isAuthor.value && (await getValidationUserId());
    });

    return {
      // references
      visa,
      isAuthor,
      validationUserId,
      isValidated,
      isDenied,
      isSafeZone,
      safeZoneInfo,
      userList,
      isSelectingValidator,
      validatorList,
      // methods
      actions,
      safeZoneHandler,
      onSafeZone,
      responseHandler,
      getValidatorList,
      getBack
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaSummary.scss"></style>
