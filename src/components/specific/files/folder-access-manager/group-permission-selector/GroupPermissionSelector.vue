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
        {{ $t(`GroupPermissionSelector.options.${selectedPermission.id}`) }}
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
  { id: "default", value: FILE_PERMISSION.DEFAULT },
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
    },
    propagate: {
      type: Boolean,
      default: false
    }
  },
  emits: ["group-permission-updated"],
  setup(props, { emit }) {
    const { updateGroupPermission } = useGroups();

    const selectedPermission = ref();
    watch(
      [() => props.folder, () => props.group],
      () => {
        const perm = props.folder.groups_permissions.find(
          p => p.group.id === props.group.id
        );
        selectedPermission.value =
          permissionList.find(p => p.value === perm.permission) ??
          permissionList[0];
      },
      { immediate: true }
    );

    const update = async perm => {
      selectedPermission.value = perm;
      await updateGroupPermission(props.project, props.folder, props.group, {
        permission: perm.value,
        propagate: props.propagate
      });
      emit("group-permission-updated");
    };

    return {
      // References
      permissionList,
      selectedPermission,
      // Methods
      update
    };
  }
};
</script>

<style scoped lang="scss" src="./GroupPermissionSelector.scss"></style>
