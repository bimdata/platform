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
              @click="handleEdit('undo')"
            >
              <BIMDataIcon name="undo" size="xxs" fill color="granite-light" />
            </BIMDataButton>
            <BIMDataButton
              v-if="isAuthor && !isClosed"
              ghost
              rounded
              icon
              @click="handleEdit"
            >
              <BIMDataIcon
                :name="isEditing ? 'validate' : 'edit'"
                size="xxs"
                fill
                color="granite-light"
              />
            </BIMDataButton>
            <BIMDataButton ghost rounded icon @click="close">
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
              @click="safeZoneHandler('deleteVisa')"
              >{{ $t("Visa.summary.delete") }}</BIMDataButton
            >
            <BIMDataButton
              class="visa-summary__shell__action-button__close"
              color="primary"
              fill
              radius
              :disabled="isClosed"
              @click="safeZoneHandler('closeVisa')"
              >{{ $t("Visa.summary.close") }}</BIMDataButton
            >
          </template>
          <template v-else>
            <BIMDataButton
              class="visa-summary__shell__action-button__validate"
              :class="{ active: isValidated && !isClosed }"
              color="success"
              fill
              radius
              :disabled="isClosed"
              @click="responseHandler('validate')"
              >{{ $t("Visa.summary.validate") }}</BIMDataButton
            >
            <BIMDataButton
              class="visa-summary__shell__action-button__deny"
              :class="{ active: isRefused && !isClosed }"
              color="high"
              fill
              radius
              :disabled="isClosed"
              @click="responseHandler('refuse')"
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

    const isValidated = ref(false);
    const isRefused = ref(false);
    const isClosed = ref(false);
    const isDenied = ref(false);
    const isEditing = ref(false);
    const hasDateError = ref(false);
    const formatedVisa = ref(null);
    const validationUserId = ref(null);
    const isAuthor = ref(false);
    const isSafeZone = ref(false);
    const userList = ref(null);
    const validatorList = ref(null);
    const isSelectingValidator = ref(false);
    const copyOfDate = ref(null);
    const copyOfDescription = ref(null);
    const safeZoneInfo = ref({
      type: null,
      action: null
    });

    const actions = ref({
      update: async data => {
        await updateVisa(props.project, props.visa.document, props.visa, data);

        const updatedVisa = await fetchVisa(props.project, props.visa);
        await fetchAllVisaInfo(updatedVisa);
      }
    });

    /**
     * GLOBAL
     */

    const formatVisa = async visa => {
      const { id } = user.value;

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
              ? validation.validator.userId === id
              : false,
            hasAccess: visa.validationsInError.length
              ? !visa.validationsInError.some(id => id === validation.id)
              : true
          }))
          .sort((a, b) => {
            if (!a.fullName) return 1;
            if (!b.fullName) return -1;
            return a.fullName < b.fullName ? -1 : 1;
          })
      };
      if (formatedVisa.value.creator.userId === id) isAuthor.value = true;
      isClosed.value = formatedVisa.value.status === VISA_STATUS.CLOSE;
    };

    const fetchAllVisaInfo = async visa => {
      await formatVisa(visa);
      const users = await getUserProjectList(props.project, {
        id: formatedVisa.value.document.parentId
      });

      userList.value = users.map(user => {
        if (formatedVisa.value.validations) {
          return {
            ...user,
            isSelected: formatedVisa.value.validations.some(
              ({ validator }) => validator && validator.id === user.id
            ),
            validation: formatedVisa.value.validations.find(
              ({ validator }) => validator && validator.id === user.id
            )
          };
        }
        return user;
      });

      !isAuthor.value && getValidationUserId();
      statusVisaHandler();
    };

    const close = () => {
      emit("close-visa");
    };

    onMounted(async () => fetchAllVisaInfo(props.visa));

    /***
     * VALIDATION RESPONSE
     */

    const responseActions = {
      validate: async () =>
        acceptValidation(
          props.project,
          props.visa.document,
          props.visa,
          validationUserId.value
        ),
      refuse: async () =>
        denyValidation(
          props.project,
          props.visa.document,
          props.visa,
          validationUserId.value
        ),
      reset: async validationId =>
        resetValidation(
          props.project,
          props.visa.document,
          props.visa,
          validationId
        )
    };

    const getValidationUserId = async () => {
      validationUserId.value = formatedVisa.value.validations.find(
        ({ isSelf }) => isSelf
      ).id;
    };

    const userStatus = computed(
      () =>
        validationUserId.value &&
        formatedVisa.value.validations.find(
          ({ id }) => id === validationUserId.value
        ).status
    );

    const statusVisaHandler = () => {
      isValidated.value = userStatus.value === VALIDATION_STATUS.ACCEPT;
      isRefused.value = userStatus.value === VALIDATION_STATUS.DENY;
    };

    const responseHandler = async type => {
      const isActive =
        type === "validate" ? !isValidated.value : !isRefused.value;

      if (isActive) {
        await responseActions[type]();
      } else {
        await responseActions.reset(validationUserId.value);
      }

      const updatedVisa = await fetchVisa(props.project, props.visa);
      await fetchAllVisaInfo(updatedVisa);
    };

    /***
     * SAFE ZONE
     */

    const safeZoneActions = {
      deleteVisa: async () =>
        deleteVisa(props.project, props.visa.document, props.visa),
      closeVisa: async () =>
        closeVisa(props.project, props.visa.document, props.visa)
    };

    const onSafeZone = async event => {
      const { type } = safeZoneInfo.value;
      if (event) {
        await safeZoneActions[type]();
        close();
      }
      safeZoneHandler();
      isSafeZone.value = false;
    };

    const safeZoneHandler = type => {
      if (type) {
        isSafeZone.value = true;
        safeZoneInfo.value = {
          type,
          action: safeZoneActions[type]
        };
      } else {
        isSafeZone.value = false;
        safeZoneInfo.value = null;
      }
    };

    /**
     * MODIFY PEOPLE
     */

    const userActions = {
      addUser: async userValidatorId =>
        createValidation(
          props.project,
          props.visa.document,
          props.visa,
          userValidatorId
        ),
      deleteUser: async validationId =>
        deleteValidation(
          props.project,
          props.visa.document,
          props.visa,
          validationId
        )
    };

    const getBack = () => (isSelectingValidator.value = false);
    const getValidatorList = event => (validatorList.value = event.value);

    watch(validatorList, async () => {
      await Promise.all(
        validatorList.value
          .map(validator => {
            return {
              ...validator,
              validationId: validator.validation && validator.validation.id,
              isToAdd:
                validator.isSelected &&
                userList.value
                  .filter(user => !user.isSelected)
                  .some(user => user.id === validator.id),
              isToDel:
                !validator.isSelected &&
                userList.value.some(
                  user => user.id === validator.id && user.isSelected
                )
            };
          })
          .filter(({ isToAdd, isToDel }) => isToAdd || isToDel)
          .map(async ({ id, validationId, isToAdd, isToDel }) => {
            if (isToAdd) {
              await userActions.addUser(id);
            } else if (isToDel) {
              await userActions.deleteUser(validationId);
            }
          })
      );
      const updatedVisa = await fetchVisa(props.project, props.visa);
      await fetchAllVisaInfo(updatedVisa);
    });

    /**
     * EDITING
     */

    const handleEdit = async undo => {
      if (undo === "undo") {
        isEditing.value = false;
        formatedVisa.value.deadline = copyOfDate.value;
        formatedVisa.value.description = copyOfDescription.value;
      } else if (isEditing.value) {
        const dateConform = isDateConform(formatedVisa.value.deadline);
        hasDateError.value = !dateConform;

        if (dateConform) {
          await actions.value.update({
            description: formatedVisa.value.description,
            deadline: formatDate(formatedVisa.value.deadline)
          });
          isEditing.value = false;
        }
      } else if (!isEditing.value) {
        isEditing.value = true;
        copyOfDate.value = formatedVisa.value.deadline;
        copyOfDescription.value = formatedVisa.value.description;
      }
    };

    /**
     * PEOPLE ACTIONS for VisaSummaryPeopleActions
     */

    const usersActions = {
      deleteUser: async validationId => {
        await userActions.deleteUser(validationId);
        const updatedVisa = await fetchVisa(props.project, props.visa);
        await fetchAllVisaInfo(updatedVisa);
      },
      resetVal: async validationId => {
        await responseActions.reset(validationId);
        const updatedVisa = await fetchVisa(props.project, props.visa);
        await fetchAllVisaInfo(updatedVisa);
      }
    };

    return {
      // references
      formatedVisa,
      isValidated,
      isRefused,
      isAuthor,
      validationUserId,
      isDenied,
      isSafeZone,
      safeZoneInfo,
      userList,
      isSelectingValidator,
      validatorList,
      isEditing,
      hasDateError,
      isClosed,
      usersActions,
      // methods
      close,
      actions,
      fetchAllVisaInfo,
      safeZoneHandler,
      onSafeZone,
      responseHandler,
      getValidatorList,
      getBack,
      handleEdit,
      console
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaSummary.scss"></style>
