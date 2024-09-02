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
            <BIMDataIconVisa fill color="primary" size="s" margin="2.5px 0 0 0" />
            <span>{{ $t(`Visa.summary.title.${isClosed ? "closed" : "open"}`) }}</span>
          </div>
          <div class="visa-summary__shell__header__right-side">
            <BIMDataTooltip
              v-if="isEditing"
              text="Annuler les modifications"
              maxWidth="105px"
              position="bottom"
              color="silver-light"
              :disabled="false"
            >
              <BIMDataButton ghost rounded icon @click="undoEdit">
                <BIMDataIconUndo size="xxs" fill color="granite-light" />
              </BIMDataButton>
            </BIMDataTooltip>
            <BIMDataButton
              v-if="isAuthor && !isClosed && !isEditing"
              ghost
              rounded
              icon
              @click="initEdit"
            >
              <BIMDataIconEdit size="xxs" fill color="granite-light" />
            </BIMDataButton>
            <BIMDataTooltip
              v-if="isAuthor && !isClosed && isEditing"
              text="Valider les modifications"
              maxWidth="105px"
              position="bottom"
              color="silver-light"
              :disabled="false"
            >
            <BIMDataButton
              ghost
              rounded
              icon
              @click="confirmEdit"
            >
              <BIMDataIconValidate size="xxs" fill color="granite-light" />
            </BIMDataButton>
          </BIMDataTooltip>
            <BIMDataButton ghost rounded icon @click="onClose">
              <BIMDataIconClose size="xxs" fill color="granite-light" />
            </BIMDataButton>
          </div>
        </div>
        <div class="visa-summary__shell__content">
          <div class="visa-summary__shell__content__applicant">
            {{ $t("Visa.summary.appliedBy") }}
            <span>{{ formatedVisa.creator.fullName }}</span>
          </div>
          <div
            v-if="formatedVisa.description || isEditing"
            class="visa-summary__shell__content__desc"
          >
            <BIMDataTextarea
              v-model="formatedVisa.description"
              :class="{ editing: isEditing }"
              label="Description"
              name="description"
              width="100%"
              :readonly="!isEditing"
              :resizable="false"
              rows="1"
              fitContent
            />
          </div>
          <div class="visa-summary__shell__content__deadline">
            <span class="visa-summary__shell__content__deadline__title">{{ $t("Visa.term") }}</span>
            <BIMDataDatePicker
              v-if="isEditing"
              v-model="formatedVisa.deadline"
              :value="formatedVisa.deadline"
              :clearButton="true"
              width="100%"
              format="dd/MM/yyyy"
              :placeholder="$t('Visa.add.dateInputPlaceholder')"
              fixedPosition="bottom-right"
            >
            </BIMDataDatePicker>
            <span v-else class="visa-summary__shell__content__deadline__date">{{
              $d(formatedVisa.deadline)
            }}</span>
          </div>
        </div>
        <div class="visa-summary__shell__action-button">
          <template v-if="isAuthor">
            <BIMDataButton
              class="visa-summary__shell__action-button__delete"
              data-test-id="btn-delete-visa"
              color="high"
              fill
              radius
              @click="onDeleteVisa"
            >
              {{ $t("t.delete") }}
            </BIMDataButton>
            <BIMDataButton
              class="visa-summary__shell__action-button__close"
              data-test-id="btn-close-visa"
              color="primary"
              fill
              radius
              :disabled="isClosed"
              @click="onCloseVisa"
            >
              {{ $t("Visa.close") }}
            </BIMDataButton>
          </template>
          <template v-else>
            <BIMDataButton
              class="visa-summary__shell__action-button__validate"
              :class="{ active: userValidationStatus.isValidated && !isClosed }"
              data-test-id="btn-validate-visa"
              color="success"
              fill
              radius
              :disabled="isClosed"
              @click="onAcceptValidation"
            >
              {{ $t("t.validate") }}
            </BIMDataButton>
            <BIMDataButton
              class="visa-summary__shell__action-button__deny"
              :class="{ active: userValidationStatus.isRefused && !isClosed }"
              data-test-id="btn-deny-visa"
              color="high"
              fill
              radius
              :disabled="isClosed"
              @click="onDenyValidation"
            >
              {{ $t("Visa.deny") }}
            </BIMDataButton>
          </template>
        </div>
        <div class="visa-summary__shell__file">
          <div class="visa-summary__shell__file__content">
            <BIMDataFileIcon :fileName="formatedVisa.document.file_name" :size="20" />
            <BIMDataTextbox
              class="visa-summary__shell__file__content__name"
              :text="formatedVisa.document.name"
              width="calc(100% - 20px - 12px * 3)"
            />
          </div>
          <div class="visa-summary__shell__file__btn-file">
            <BIMDataButton
              ghost
              rounded
              icon
              width="40px"
              height="40px"
              @click="
                $emit('reach-file', {
                  ...formatedVisa.document,
                  nature: formatedVisa.document.model_id ? 'Model' : 'Document',
                })
              "
            >
              <BIMDataIconFolder size="xs" fill />
            </BIMDataButton>
          </div>
        </div>
        <div class="visa-summary__shell__validator">
          <div class="visa-summary__shell__validator__header">
            <span class="visa-summary__shell__validator__header__title">
              {{ $t("Visa.validators") }}
            </span>
            <BIMDataButton
              data-test-id="btn-add-validator"
              v-if="isAuthor && !isClosed"
              ghost
              rounded
              icon
            >
              <BIMDataIconAddUser size="s" @click="isSelectingValidator = true" />
            </BIMDataButton>
          </div>
          <div
            class="visa-summary__shell__validator__user-list"
            data-test-id="visa-summary-validator-list"
          >
            <VisaSummaryValidator
              :isAuthor="isAuthor"
              :userList="formatedVisa.validations"
              :isClosed="isClosed"
              @reset-validation="onResetValidation"
              @delete-validation="onDeleteValidation"
            />
          </div>
        </div>
        <div class="visa-summary__shell__comments">
          <VisaComments
            :comments="formatedVisa.comments"
            :project="project"
            :visa="visa"
            :isAuthor="isAuthor"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { VISA_STATUS, VALIDATION_STATUS } from "../../../../config/visa.js";
import { useProjects } from "../../../../state/projects.js";
import { useUser } from "../../../../state/user.js";
import { useVisa } from "../../../../state/visa.js";
import { fullName } from "../../../../utils/users.js";
import { localeDate } from "../../../../utils/date.js";

// Components
import VisaComments from "./visa-comments/VisaComments.vue";
import VisaSafeZone from "../visa-safe-zone/VisaSafeZone.vue";
import VisaSelectionValidator from "../visa-selection-validator/VisaSelectionValidator.vue";
import VisaSummaryValidator from "./visa-summary-validator/VisaSummaryValidator.vue";

export default {
  components: {
    VisaComments,
    VisaSafeZone,
    VisaSelectionValidator,
    VisaSummaryValidator,
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
    visa: {
      type: Object,
      required: true,
    },
  },
  emits: ["close-visa", "fetch-visas", "reach-file"],
  setup(props, { emit }) {
    const { t } = useI18n();
    const { isSelf } = useUser();
    const { getUserProjectList } = useProjects();
    const {
      fetchVisa,
      acceptValidation,
      denyValidation,
      resetValidation,
      deleteVisa,
      closeVisa,
      createValidation,
      deleteValidation,
      updateVisa,
    } = useVisa();

    const isClosed = ref(false);
    const isEditing = ref(false);
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
    const formatVisa = (visa) => ({
      ...visa,
      deadline: visa.deadline,
      creator: {
        ...visa.creator,
        fullName: visa.creator ? fullName(visa.creator) : t("Visa.summary.deletedUser"),
      },
      validations: visa.validations
        .map((validation) => ({
          ...validation,
          userId: validation.validator ? validation.validator.user_id : 0,
          fullName: validation.validator
            ? fullName(validation.validator)
            : t("Visa.summary.deletedUser"),
          isSelf: isSelf(validation.validator),
          hasAccess: visa.validations_in_error.length
            ? !visa.validations_in_error.some(
                (validationInErrorId) => validationInErrorId === validation.id
              )
            : true,
        }))
        .sort((a, b) => {
          if (!a.fullName) return 1;
          if (!b.fullName) return -1;
          return a.fullName < b.fullName ? -1 : 1;
        }),
    });

    const fetchDocumentUsers = async (visa) => {
      const users = await getUserProjectList(props.project, {
        id: visa.document.parent_id,
      });
      return users.map((user) => {
        return {
          ...user,
          isSelected: visa.validations.some(
            ({ validator }) => validator && validator.id === user.id
          ),
          validation: visa.validations.find(
            ({ validator }) => validator && validator.id === user.id
          ),
        };
      });
    };

    onMounted(async () => {
      if (isSelf(props.visa.creator)) {
        isAuthor.value = true;
      }
      if (!isAuthor.value) {
        validationUserId.value = props.visa.validations.find(
          ({ validator }) => isSelf(validator)
        ).id;
      }
      isClosed.value = props.visa.status === VISA_STATUS.CLOSE;
      userProjectList.value = await fetchDocumentUsers(props.visa);
      formatedVisa.value = formatVisa(props.visa);
    });

    const reloadVisa = async () => {
      const visa = await fetchVisa(props.project, props.visa);
      userProjectList.value = await fetchDocumentUsers(visa);
      formatedVisa.value = formatVisa(visa);
      emit("fetch-visas");
    };

    const onClose = () => {
      emit("close-visa");
    };

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
          isRefused: status === VALIDATION_STATUS.DENY,
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

    const onResetValidation = async (validationId) => {
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
        action: () => deleteVisa(props.project, props.visa.document, props.visa),
      };
    };

    const onCloseVisa = () => {
      isSafeZone.value = true;
      safeZoneInfo.value = {
        type: "close",
        action: () => closeVisa(props.project, props.visa.document, props.visa),
      };
    };

    const onSafeZone = async (isActionConfirmed) => {
      if (isActionConfirmed) {
        await safeZoneInfo.value.action();
        onClose();
        emit("fetch-visas");
      }
      isSafeZone.value = false;
      safeZoneInfo.value = null;
    };

    const onCreateValidation = async (validatorId) => {
      await createValidation(props.project, props.visa.document, props.visa, validatorId);
      await reloadVisa();
    };

    const onDeleteValidation = async (validationId) => {
      await deleteValidation(props.project, props.visa.document, props.visa, validationId);
      await reloadVisa();
    };

    /**
     * MODIFY PEOPLE
     */

    const getBack = () => (isSelectingValidator.value = false);
    const getValidatorList = (list) => (validatorList.value = list);

    watch(validatorList, async () => {
      await Promise.all(
        validatorList.value
          .map((validator) => {
            return {
              ...validator,
              validationId: validator.validation && validator.validation.id,
              isToAdd:
                validator.isSelected &&
                userProjectList.value
                  .filter((user) => !user.isSelected)
                  .some((user) => user.id === validator.id),
              isToDel:
                !validator.isSelected &&
                userProjectList.value.some((user) => user.id === validator.id && user.isSelected),
            };
          })
          .filter(({ isToAdd, isToDel }) => isToAdd || isToDel)
          .map(async ({ id: validatorId, validationId, isToAdd, isToDel }) => {
            if (isToAdd) {
              await onCreateValidation(validatorId);
            } else if (isToDel) {
              await onDeleteValidation(validationId);
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
      const dateValid = formatedVisa.value.deadline;
      if (dateValid) {
        await updateVisa(props.project, props.visa.document, props.visa, {
          description: formatedVisa.value.description,
          deadline: localeDate(formatedVisa.value.deadline),
        });
        await reloadVisa();
        isEditing.value = false;
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
      isClosed,
      userValidationStatus,
      // methods
      onAcceptValidation,
      onDenyValidation,
      onResetValidation,
      onDeleteValidation,
      close,
      fetchDocumentUsers,
      onDeleteVisa,
      onCloseVisa,
      onSafeZone,
      getValidatorList,
      getBack,
      initEdit,
      undoEdit,
      confirmEdit,
      onClose,
    };
  },
};
</script>

<style scoped lang="scss" src="./VisaSummary.scss"></style>
