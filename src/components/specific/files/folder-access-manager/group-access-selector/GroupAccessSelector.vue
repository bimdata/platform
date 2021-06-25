<template>
  <div class="group-access-selector">
    <TextBox
      class="group-access-selector__label"
      :text="groupName"
      :maxLength="16"
    />
    <BIMDataDropdownList
      class="group-access-selector__input"
      width="150px"
      height="32px"
      :list="accessRights"
      :closeOnElementClick="true"
    >
      <template #header>{{ groupAccess }}</template>
    </BIMDataDropdownList>
    <UserAvatarList
      class="group-access-selector__members"
      :style="{ visibility: group ? 'visible' : 'hidden' }"
      :users="groupMembers"
      itemGap="18"
    />
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
// Components
import UserAvatarList from "@/components/specific/users/user-avatar-list/UserAvatarList";

const accessRights = ["Accès refusé", "Lecture seule", "Lecture / écriture"];

export default {
  components: {
    UserAvatarList
  },
  props: {
    group: {
      type: Object
    }
  },
  setup(props) {
    const { t } = useI18n();

    const groupAccess = ref(accessRights[0]);
    const groupName = computed(() =>
      props.group ? props.group.name : t("GroupAccessSelector.defaultGroupName")
    );
    const groupMembers = computed(() =>
      props.group ? props.group.members : []
    );

    return {
      // References
      accessRights,
      groupAccess,
      groupMembers,
      groupName
    };
  }
};
</script>

<style scoped lang="scss" src="./GroupAccessSelector.scss"></style>
