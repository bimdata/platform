<template>
  <div class="visa-summary">
    <template v-if="isSelectingValidator">
      <VisaSelectionValidator
        :userList="userProjectList"
        @validator-list="getValidatorList"
        @get-back="getBack"
      />
    </template>
    <transition name="fade">
      <template v-if="isSafeZone">
        <div class="visa-summary__safe-zone">
          <VisaSafeZone :actionType="safeZoneInfo.type" @close="onSafeZone" />
        </div>
      </template>
    </transition>
    <template v-if="formatedVisa && !isSelectingValidator">
      <div class="visa-summary__shell" :class="{ safeZone: isSafeZone }">
        <div class="visa-summary__shell__header">
          <div class="visa-summary__shell__header__left-side">
            <BIMDataIcon
              name="visa"
              fill
              color="primary"
              size="s"
              margin="2.5px 0 0 0"
            />
            <span>{{
              $t(`Visa.summary.title.${isClosed ? "closed" : "open"}`)
            }}</span>
          </div>
          <div class="visa-summary__shell__header__right-side">
            <BIMDataButton
              v-if="isEditing"
              ghost
              rounded
              icon
              @click="undoEdit"
            >
              <BIMDataIcon name="undo" size="xxs" fill color="granite-light" />
            </BIMDataButton>
            <BIMDataButton
              v-if="isAuthor && !isClosed && !isEditing"
              ghost
              rounded
              icon
              @click="initEdit"
            >
              <BIMDataIcon name="edit" size="xxs" fill color="granite-light" />
            </BIMDataButton>
            <BIMDataButton
              v-if="isAuthor && !isClosed && isEditing"
              ghost
              rounded
              icon
              @click="confirmEdit"
            >
              <BIMDataIcon
                name="validate"
                size="xxs"
                fill
                color="granite-light"
              />
            </BIMDataButton>
            <BIMDataButton ghost rounded icon @click="onClose">
              <BIMDataIcon name="close" size="xxs" fill color="granite-light" />
            </BIMDataButton>
          </div>
        </div>
        <div class="visa-summary__shell__content">
          <div class="visa-summary__shell__content__applicant">
            {{ $t("Visa.summary.appliedBy") }}
            <span>{{ formatedVisa.creator.fullName }}</span>
          </div>
          <div
            v-if="visa.description || isEditing"
            class="visa-summary__shell__content__desc"
          >
            <BIMDataTextarea
              v-model="formatedVisa.description"
              :class="{ editing: isEditing }"
              name="description"
              width="100%"
              :readonly="!isEditing"
              :resizable="false"
              rows="1"
              fitContent
            />
          </div>
          <div class="visa-summary__shell__content__deadline">
            <span class="visa-summary__shell__content__deadline__title">{{
              $t("Visa.summary.term")
            }}</span>
            <BIMDataInput
              v-if="isEditing"
              v-model="formatedVisa.deadline"
              :placeholder="$t('Visa.add.toValidate')"
              :error="hasDateError"
              :errorMessage="$t('Visa.add.errorDate')"
            >
            </BIMDataInput>
            <span v-else class="visa-summary__shell__content__deadline__date">{{
              formatedVisa.deadline
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
              @click="onDeleteVisa"
              >{{ $t("Visa.summary.delete") }}</BIMDataButton
            >
            <BIMDataButton
              class="visa-summary__shell__action-button__close"
              color="primary"
              fill
              radius
              :disabled="isClosed"
              @click="onCloseVisa"
              >{{ $t("Visa.summary.close") }}</BIMDataButton
            >
          </template>
          <template v-else>
            <BIMDataButton
              class="visa-summary__shell__action-button__validate"
              :class="{ active: userValidationStatus.isValidated && !isClosed }"
              color="success"
              fill
              radius
              :disabled="isClosed"
              @click="onAcceptValidation"
              >{{ $t("Visa.summary.validate") }}</BIMDataButton
            >
            <BIMDataButton
              class="visa-summary__shell__action-button__deny"
              :class="{ active: userValidationStatus.isRefused && !isClosed }"
              color="high"
              fill
              radius
              :disabled="isClosed"
              @click="onDenyValidation"
              >{{ $t("Visa.summary.deny") }}</BIMDataButton
            >
          </template>
        </div>
        <div class="visa-summary__shell__file">
          <BIMDataFileIcon
            :fileName="formatedVisa.document.fileName"
            :size="20"
          />
          <BIMDataTextBox
            class="visa-summary__shell__file__name"
            :text="formatedVisa.document.name"
            width="80%"
          />
        </div>
        <div class="visa-summary__shell__validator">
          <div class="visa-summary__shell__validator__header">
            <span class="visa-summary__shell__validator__header__title">{{
              $t("Visa.summary.validator")
            }}</span>
            <BIMDataButton v-if="isAuthor && !isClosed" ghost rounded icon>
              <BIMDataIcon
                name="addUser"
                size="s"
                @click="isSelectingValidator = true"
              />
            </BIMDataButton>
          </div>
          <div class="visa-summary__shell__validator__user-list">
            <VisaSummaryValidator
              :isAuthor="isAuthor"
              :userList="formatedVisa.validations"
              :isClosed="isClosed"
              @reset-val="usersActions.resetVal"
              @delete-user="usersActions.deleteUser"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import VALIDATION_STATUS from "@/config/visa-validation-status";
import VISA_STATUS from "@/config/visa-status";

import { formatDate } from "@/utils/date";

import VisaSummaryValidator from "./visa-summary-validator/VisaSummaryValidator";
import VisaSafeZone from "../visa-safe-zone/VisaSafeZone";
import VisaSelectionValidator from "@/components/specific/visa/visa-selection-validator/VisaSelectionValidator.vue";

import { useVisa } from "@/state/visa";
import { useUser } from "@/state/user";
import { useProjects } from "@/state/projects";

import { fullName } from "@/utils/users";
import { formatDateDDMMYYY } from "@/utils/date";
import { isDateConform } from "@/utils/visas";

export default {
  components: { VisaSummaryValidator, VisaSafeZone, VisaSelectionValidator },
  props: {
    project: {
      type: Object,
      required: true
    },
    visa: {
      type: Object,
      required: true
    }
  },
  emits: ["close-visa"],
  setup(props, { emit }) {
    const {
      fetchVisa,
      acceptValidation,
      denyValidation,
      resetValidation,
      deleteVisa,
      closeVisa,
      createValidation,
      deleteValidation,
      updateVisa
    } = useVisa();
    const { getUserProjectList } = useProjects();
    const { user } = useUser();
    const { t } = useI18n();
    const { id: currentUserId } = user.value;

    const isClosed = ref(false);
    const isEditing = ref(false);
    const hasDateError = ref(false);
    const formatedVisa = ref(null);
    const validationUserId = ref(null);
    const isAuthor = ref(false);
    const isSafeZone = ref(false);
    const userProjectList = ref(null);
    const validatorList = ref(null);
    const isSelectingValidator = ref(false);
    const copyOfDate = ref(null);
    const copyOfDescription = ref(null);
    const safeZoneInfo = ref(null);

    /**
     * GLOBAL
     */

    const formatVisa = async visa => {
      formatedVisa.value = {
        ...visa,
        deadline: formatDateDDMMYYY(visa.deadline),
        creator: {
          ...visa.creator,
          fullName: visa.creator
            ? fullName(visa.creator)
            : t("Visa.summary.deletedUser")
        },
        validations: visa.validations
          .map(validation => ({
            ...validation,
            userId: validation.validator ? validation.validator.userId : 0,
            fullName: validation.validator
              ? fullName(validation.validator)
              : t("Visa.summary.deletedUser"),
            isSelf: validation.validator
              ? validation.validator.userId === currentUserId
              : false,
            hasAccess: visa.validationsInError.length
              ? !visa.validationsInError.some(
                  validationInErrorId => validationInErrorId === validation.id
                )
              : true
          }))
          .sort((a, b) => {
            if (!a.fullName) return 1;
            if (!b.fullName) return -1;
            return a.fullName < b.fullName ? -1 : 1;
          })
      };
      if (formatedVisa.value.creator.userId === currentUserId) {
        isAuthor.value = true;
      }
      isClosed.value = formatedVisa.value.status === VISA_STATUS.CLOSE;
    };

    const fetchAllVisaInfo = async visa => {
      await formatVisa(visa);
      const users = await getUserProjectList(props.project, {
        id: formatedVisa.value.document.parentId
      });

      userProjectList.value = users.map(user => {
        return {
          ...user,
          isSelected: formatedVisa.value.validations.some(
            ({ validator }) => validator && validator.id === user.id
          ),
          validation: formatedVisa.value.validations.find(
            ({ validator }) => validator && validator.id === user.id
          )
        };
      });
    };

    const reloadVisa = async () => {
      const visa = await fetchVisa(props.project, props.visa);
      await fetchAllVisaInfo(visa);
    };

    const onClose = () => {
      emit("close-visa");
    };

    onMounted(async () => {
      fetchAllVisaInfo(props.visa);
      if (!isAuthor.value) {
        validationUserId.value = formatedVisa.value.validations.find(
          ({ isSelf }) => isSelf
        ).id;
      }
    });

    /***
     * VALIDATION RESPONSE (validator)
     */

    const userValidationStatus = computed(() => {
      if (!isAuthor.value) {
        const status = formatedVisa.value.validations.find(
          ({ id: validationId }) => validationId === validationUserId.value
        ).status;

        return {
          isValidated: status === VALIDATION_STATUS.ACCEPT,
          isRefused: status === VALIDATION_STATUS.DENY
        };
      }
      return null;
    });

    const onAcceptValidation = async () => {
      if (userValidationStatus.value.isValidated) {
        await onResetValidation();
      } else {
        await acceptValidation(
          props.project,
          props.visa.document,
          props.visa,
          validationUserId.value
        );
        await reloadVisa();
      }
    };

    const onDenyValidation = async () => {
      if (userValidationStatus.value.isRefused) {
        await onResetValidation();
      } else {
        await denyValidation(
          props.project,
          props.visa.document,
          props.visa,
          validationUserId.value
        );
        await reloadVisa();
      }
    };

    const onResetValidation = async validationId => {
      await resetValidation(
        props.project,
        props.visa.document,
        props.visa,
        (validationId = validationId || validationUserId.value)
      );
      await reloadVisa();
    };

    /***
     * MANAGE VISA (creator)
     */

    const onDeleteVisa = () => {
      isSafeZone.value = true;
      safeZoneInfo.value = {
        type: "delete",
        action: () => deleteVisa(props.project, props.visa.document, props.visa)
      };
    };

    const onCloseVisa = () => {
      isSafeZone.value = true;
      safeZoneInfo.value = {
        type: "close",
        action: () => closeVisa(props.project, props.visa.document, props.visa)
      };
    };

    const onSafeZone = async isActionConfirmed => {
      if (isActionConfirmed) {
        await safeZoneInfo.value.action();
        onClose();
      }
      isSafeZone.value = false;
      safeZoneInfo.value = null;
    };

    /**
     * MODIFY PEOPLE
     */

    const getBack = () => (isSelectingValidator.value = false);
    const getValidatorList = list => (validatorList.value = list);

    watch(validatorList, async () => {
      await Promise.all(
        validatorList.value
          .map(validator => {
            return {
              ...validator,
              validationId: validator.validation && validator.validation.id,
              isToAdd:
                validator.isSelected &&
                userProjectList.value
                  .filter(user => !user.isSelected)
                  .some(user => user.id === validator.id),
              isToDel:
                !validator.isSelected &&
                userProjectList.value.some(
                  user => user.id === validator.id && user.isSelected
                )
            };
          })
          .filter(({ isToAdd, isToDel }) => isToAdd || isToDel)
          .map(async ({ id: validatorId, validationId, isToAdd, isToDel }) => {
            if (isToAdd) {
              await createValidation(
                props.project,
                props.visa.document,
                props.visa,
                validatorId
              );
            } else if (isToDel) {
              await deleteValidation(
                props.project,
                props.visa.document,
                props.visa,
                validationId
              );
            }
          })
      );
      await reloadVisa();
    });

    /**
     * EDITING
     */

    const initEdit = () => {
      copyOfDate.value = formatedVisa.value.deadline;
      copyOfDescription.value = formatedVisa.value.description;
      isEditing.value = true;
    };

    const undoEdit = () => {
      formatedVisa.value.deadline = copyOfDate.value;
      formatedVisa.value.description = copyOfDescription.value;
      isEditing.value = false;
    };

    const confirmEdit = async () => {
      const dateConform = isDateConform(formatedVisa.value.deadline);
      hasDateError.value = !dateConform;
      if (dateConform) {
        await updateVisa(props.project, props.visa.document, props.visa, {
          description: formatedVisa.value.description,
          deadline: formatDate(formatedVisa.value.deadline)
        });
        await reloadVisa();
        isEditing.value = false;
      }
    };

    /**
     * VALIDATOR ACTIONS (VisaSummaryValidatorActions)
     */

    const usersActions = {
      deleteUser: async validationId => {
        await deleteValidation(
          props.project,
          props.visa.document,
          props.visa,
          validationId
        );
        await reloadVisa();
      },
      resetVal: async validationId => {
        await onResetValidation(validationId);
        await reloadVisa();
      }
    };

    return {
      // references
      formatedVisa,
      isAuthor,
      validationUserId,
      isSafeZone,
      safeZoneInfo,
      userProjectList,
      isSelectingValidator,
      validatorList,
      isEditing,
      hasDateError,
      isClosed,
      usersActions,
      userValidationStatus,
      // methods
      onAcceptValidation,
      onDenyValidation,
      close,
      fetchAllVisaInfo,
      onDeleteVisa,
      onCloseVisa,
      onSafeZone,
      getValidatorList,
      getBack,
      initEdit,
      undoEdit,
      confirmEdit,
      onClose
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaSummary.scss"></style>
