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
    <template v-if="visa && !isSelectingValidator">
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
          <div class="visa-summary__shell__validator__people-list">
            <VisaSummaryPeople
              :isAuthor="isAuthor"
              :peopleList="formatedVisa.validations"
              :isClosed="isClosed"
              @reset-val="resetVal"
              @delete-user="deleteUser"
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

import VisaSummaryPeople from "./visa-summary-people/VisaSummaryPeople";
import VisaSafeZone from "../visa-safe-zone/VisaSafeZone";
import VisaSelectionValidator from "@/components/specific/visa/visa-selection-validator/VisaSelectionValidator.vue";

import { useVisa } from "@/state/visa";
import { useUser } from "@/state/user";
import { useProjects } from "@/state/projects";

import { fullName } from "@/utils/users";
import { formatDateDDMMYYY } from "@/utils/date";
import { isDateConform } from "@/utils/visas";

export default {
  components: { VisaSummaryPeople, VisaSafeZone, VisaSelectionValidator },
  props: {
    project: {
      type: Object,
      required: true
    },
    visa: {
      type: Object,
      required: true
    },
    isVisaList: {
      type: Boolean,
      required: true
    }
  },
  emits: ["close", "set-visa", "set-is-visa-list", "fetch-visas"],
  setup(props, { emit }) {
    const {
      acceptVisa,
      denyVisa,
      resetVisa,
      deleteVisa,
      closeVisa,
      createValidation,
      deleteValidation,
      updateVisa
    } = useVisa();
    const { getUserList } = useProjects();
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
        await updateVisa(props.visaId, props.baseInfo, data);
        await fetchAllVisaInfo();
      }
    });

    /**
     * GLOBAL
     */

    const formatVisa = async () => {
      const { id } = user.value;

      formatedVisa.value = {
        ...props.visa,
        deadline: formatDateDDMMYYY(props.visa.deadline),
        creator: {
          ...props.visa.creator,
          fullName: props.visa.creator
            ? fullName(props.visa.creator)
            : t("Visa.summary.deletedUser")
        },
        validations: props.visa.validations
          .map(elem => ({
            ...elem,
            userId: elem.validator ? elem.validator.userId : 0,
            fullName: elem.validator
              ? fullName(elem.validator)
              : t("Visa.summary.deletedUser"),
            isSelf: elem.validator ? elem.validator.userId === id : false,
            hasAccess: props.visa.validationsInError.length
              ? !props.visa.validationsInError.some(id => id === elem.id)
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

    const fetchAllVisaInfo = async () => {
      await formatVisa();
      const users = await getUserList(props.project, {
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
      emit("set-visa", null);
      if (!props.isVisaList) emit("close");
    };

    onMounted(async () => fetchAllVisaInfo());

    /***
     * VALIDATION RESPONSE
     */

    const responseActions = {
      validate: async () =>
        acceptVisa(validationUserId.value, props.visaId, props.baseInfo),
      refuse: async () =>
        denyVisa(validationUserId.value, props.visaId, props.baseInfo),
      reset: async validationId =>
        resetVisa(validationId, props.visaId, props.baseInfo)
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
      await fetchAllVisaInfo();
    };

    /***
     * SAFE ZONE
     */

    const safeZoneActions = {
      deleteVisa: async () => deleteVisa(props.visaId, props.baseInfo),
      closeVisa: async () => closeVisa(props.visaId, props.baseInfo)
    };

    const onSafeZone = async event => {
      const { type } = safeZoneInfo.value;
      if (event) {
        await safeZoneActions[type]();
        close();
        emit("fetch-visas");
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
        createValidation(userValidatorId, props.visaId, props.baseInfo),
      deleteUser: async validationId =>
        deleteValidation(validationId, props.visaId, props.baseInfo)
    };

    const getBack = () => (isSelectingValidator.value = false);
    const getValidatorList = event => (validatorList.value = event.value);

    watch(validatorList, async () => {
      console.log("validatorList", validatorList);

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
      await fetchAllVisaInfo();
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

    const peopleActions = {
      deleteUser: async id => {
        await userActions.deleteUser(id);
        await fetchAllVisaInfo();
      },
      resetVal: async id => {
        await responseActions.reset(id);
        await fetchAllVisaInfo();
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
      // methods
      close,
      actions,
      fetchAllVisaInfo,
      resetVal: peopleActions.resetVal,
      deleteUser: peopleActions.deleteUser,
      safeZoneHandler,
      onSafeZone,
      responseHandler,
      getValidatorList,
      getBack,
      handleEdit
    };
  }
};
</script>

<style scoped lang="scss" src="./VisaSummary.scss"></style>
