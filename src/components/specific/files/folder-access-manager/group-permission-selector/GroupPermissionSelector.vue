<template>
  <div class="group-permission-selector">
    <BIMDataTextbox
      class="group-permission-selector__label"
      maxWidth="132px"
      :text="group.name"
    />
    <BIMDataDropdownList
      class="group-permission-selector__input"
      width="144px"
      height="32px"
      :list="permissionList"
      :closeOnElementClick="true"
      @element-click="update"
    >
      <template #header>
        {{ $t(`GroupPermissionSelector.options.${groupPermission.id}`) }}
      </template>
      <template #element="{ element }">
        {{ $t(`GroupPermissionSelector.options.${element.id}`) }}
      </template>
    </BIMDataDropdownList>
    <UserAvatarList
      class="group-permission-selector__members"
      :users="group.members"
      itemGap="18"
    />
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { FILE_PERMISSION } from "../../../../../config/files.js";
import { useGroups } from "../../../../../state/groups.js";
// Components
import UserAvatarList from "../../../users/user-avatar-list/UserAvatarList.vue";

const permissionList = [
  { id: "default", value: null },
  { id: "accessDenied", value: FILE_PERMISSION.ACCESS_DENIED },
  { id: "readOnly", value: FILE_PERMISSION.READ_ONLY },
  { id: "readWrite", value: FILE_PERMISSION.READ_WRITE }
];

export default {
  components: {
    UserAvatarList
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    folder: {
      type: Object,
      required: true
    },
    group: {
      type: Object,
      required: true
    }
  },
  emits: ["group-permission-updated"],
  setup(props, { emit }) {
    const { updateGroupPermission, deleteGroupPermission } = useGroups();

    const groupPermission = ref();
    watch(
      [() => props.folder, () => props.group],
      () => {
        const perm = props.folder.groups_permissions.find(
          p => p.group.id === props.group.id
        );
        if (perm) {
          groupPermission.value = permissionList.find(
            p => p.value === perm.permission
          );
        } else {
          // No permission means 'default permission'
          groupPermission.value = permissionList[0];
        }
      },
      { immediate: true }
    );

    const update = async perm => {
      try {
        groupPermission.value = perm;
        if (perm.value) {
          await updateGroupPermission(
            props.project,
            props.folder,
            props.group,
            perm.value
          );
        } else {
          await deleteGroupPermission(props.project, props.folder, props.group);
        }
        emit("group-permission-updated");
      } catch (error) {
        console.error(error);
      }
    };

    return {
      // References
      groupPermission,
      permissionList,
      // Methods
      update
    };
  }
};
</script>

<style scoped lang="scss" src="./GroupPermissionSelector.scss"></style>
