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
import { computed, ref, watch } from "vue";
import { FILE_PERMISSION } from "../../../../../config/files.js";
import { useGroups } from "../../../../../state/groups.js";
// Components
import UserAvatarList from "../../../users/user-avatar-list/UserAvatarList.vue";

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
    const { updateGroupPermission } = useGroups();

    const permissionList = computed(() => [
      { id: "default", value: props.folder.default_permission },
      { id: "accessDenied", value: FILE_PERMISSION.ACCESS_DENIED },
      { id: "readOnly", value: FILE_PERMISSION.READ_ONLY },
      { id: "readWrite", value: FILE_PERMISSION.READ_WRITE }
    ]);

    const groupPermission = ref();
    watch(
      [() => props.folder, () => props.group, permissionList],
      () => {
        const perm = props.folder.groups_permissions.find(
          p => p.group.id === props.group.id
        );
        groupPermission.value = permissionList.value.find(
          p => p.value === perm.permission
        );
      },
      { immediate: true }
    );

    const update = async perm => {
      try {
        groupPermission.value = perm;
        await updateGroupPermission(
          props.project,
          props.folder,
          props.group,
          perm.value
        );
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
