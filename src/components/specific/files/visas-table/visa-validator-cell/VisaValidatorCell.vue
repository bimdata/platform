<template>
  <div class="visa-validator-cell" @mouseenter="hovering = true" @mouseleave="hovering = false">
    <UserAvatarList
      class="group-card__avatars"
      :users="validatorsForVisa(visa)"
      itemSize="28"
      itemGap="18"
      :itemClass="(validator) => avatarStatusClass(visa, validator)"
    />

    <transition name="fade">
      <div v-show="hovering || showFullValidator" class="visa-validator-cell__details">
        <span class="validator-title m-b-6">Détails des validants</span>

        <div
          v-for="validator in validatorsForVisa(visa)"
          :key="validator.id"
          class="validator-details flex items-center justify-between m-t-6"
        >
          <div class="flex items-center">
            <UserAvatar :user="validator" size="28" :class="avatarStatusClass(visa, validator)" />
            <span v-if="validator.firstname && validator.lastname" class="validator-name m-l-6">
              {{ validator.firstname }} {{ validator.lastname }}
            </span>
            <span v-else class="validator-email m-l-6">{{ validator.email }} </span>
          </div>

          <div class="validator-groups">
            <span v-if="groupLabelForValidator(validator)" class="validator-group-label">
              {{ groupLabelForValidator(validator) }}
            </span>

            <span v-if="!validator.groups.length" class="validator-group validator-group--none">
              Sans groupe
            </span>
          </div>

          <div class="validator-status" :class="statusClasses(validator)">
            <BIMDataIcon
              :name="statusIcon(validator)"
              size="xs"
              fill
              color="default"
              margin="0 6px 0 0"
            />
            <span>{{ statusLabel(validator) }}</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import UserAvatarList from "../../../users/user-avatar-list/UserAvatarList.vue";
import UserAvatar from "../../../users/user-avatar/UserAvatar.vue";
import { VALIDATION_STATUS } from "../../../../../config/visa.js";
import { useGroups } from "../../../../../state/groups.js";

export default {
  name: "VisaValidatorCell",

  components: {
    UserAvatarList,
    UserAvatar,
  },

  props: {
    visa: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const { projectGroups } = useGroups();

    const hovering = ref(false);
    const showFullValidator = ref(false);

    /**
     * Map userId -> [groups]
     */
    const userIdToGroupsMap = computed(() => {
      const map = new Map();

      projectGroups.value.forEach((group) => {
        group.members?.forEach((member) => {
          if (!map.has(member.id)) {
            map.set(member.id, []);
          }
          map.get(member.id).push(group);
        });
      });

      return map;
    });

    const findGroupsForUser = (validator) => {
      if (!validator) return [];
      return userIdToGroupsMap.value.get(validator.id) ?? [];
    };

    const validatorsForVisa = (visa) =>
      visa.validations
        .filter((v) => v.validator)
        .map((v) => {
          const groups = findGroupsForUser(v.validator);

          return {
            ...v.validator,
            validationStatus: v.status,
            groups,
          };
        });

    const isDelay = (visa) => {
      const todayDate = new Date();
      return visa.deadline < todayDate.setDate(todayDate.getDate() - 1);
    };

    const avatarStatusClass = (visa, validator) => {
      switch (validator?.validationStatus) {
        case VALIDATION_STATUS.DENY:
          return "avatar--deny";
        case VALIDATION_STATUS.ACCEPT:
          return "avatar--accept";
        case VALIDATION_STATUS.PENDING:
          return isDelay(visa) ? "avatar--delay" : "avatar--pending";
        default:
          return "avatar--pending";
      }
    };

    const groupLabelForValidator = (validator) => {
      const groups = validator.groups || [];

      if (!groups.length) {
        return null;
      }

      if (groups.length === 1) {
        return groups[0].name;
      }

      return `${groups.length} groupes`;
    };

    const statusIcon = (validator) => {
      switch (validator?.validationStatus) {
        case VALIDATION_STATUS.DENY:
          return "failed";
        case VALIDATION_STATUS.ACCEPT:
          return "success";
        case VALIDATION_STATUS.PENDING:
          return "sandglass";
        default:
          return "sandglass";
      }
    };
    const statusClasses = (validator) => {
      switch (validator?.validationStatus) {
        case VALIDATION_STATUS.DENY:
          return "failed";
        case VALIDATION_STATUS.ACCEPT:
          return "success";
        case VALIDATION_STATUS.PENDING:
          return isDelay(props.visa) ? "delay" : "pending";
        default:
          return "pending";
      }
    };

    const statusLabel = (validator) => {
      switch (validator?.validationStatus) {
        case VALIDATION_STATUS.DENY:
          return "Refusé";
        case VALIDATION_STATUS.ACCEPT:
          return "Accepté";
        case VALIDATION_STATUS.PENDING:
          return isDelay(props.visa) ? "En  retard" : "En attente";
        default:
          return "En attente";
      }
    };

    return {
      hovering,
      showFullValidator,
      avatarStatusClass,
      groupLabelForValidator,
      validatorsForVisa,
      statusClasses,
      statusIcon,
      statusLabel,
    };
  },
};
</script>

<style scoped src="./VisaValidatorCell.scss" lang="scss"></style>
