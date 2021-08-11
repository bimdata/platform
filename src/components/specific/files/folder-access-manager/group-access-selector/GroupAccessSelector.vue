<template>
  <div class="group-access-selector">
    <TextBox
      class="group-access-selector__label"
      :text="group ? groupName : $t('GroupAccessSelector.defaultGroupName')"
      :maxLength="16"
    />
    <BIMDataDropdownList
      class="group-access-selector__input"
      width="150px"
      height="32px"
      :list="accessRightOptions"
      :closeOnElementClick="true"
      :disabled="disabled"
      @element-click="update"
    >
      <template #header>
        {{ $t(`GroupAccessSelector.options.${accessRight.id}`) }}
      </template>
      <template #element="{ element }">
        {{ $t(`GroupAccessSelector.options.${element.id}`) }}
      </template>
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
import { computed, ref, watch } from "vue";
import { useFiles } from "@/state/files";
import { useGroups } from "@/state/groups";
import { FILE_PERMISSION } from "@/utils/file-structure";
// Components
import UserAvatarList from "@/components/specific/users/user-avatar-list/UserAvatarList";

const accessRightOptions = [
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
      type: Object
    }
  },
  emits: ["folder-access-updated"],
  setup(props, { emit }) {
    const { updateFiles } = useFiles();
    const { updateGroupPermission } = useGroups();

    const disabled = false;
    // const disabled = computed(() =>
    //   props.group
    //     ? props.folder.defaultPermission === FILE_PERMISSION.READ_WRITE
    //     : false
    // );
    const groupName = computed(() => (props.group ? props.group.name : ""));
    const groupMembers = computed(() =>
      props.group ? props.group.members : []
    );
    const groupPermission = ref(props.folder.defaultPermission);
    // const groupPermission = computed(
    //   props.group
    //     ? props.folder.groups.find(g => g.group.id === props.group.id)
    //         .permission
    //     : props.folder.defaultPermission
    // );

    const accessRight = ref();
    watch(
      () => groupPermission.value,
      perm => {
        accessRight.value = accessRightOptions.find(
          right => right.value === perm
        );
      },
      { immediate: true }
    );

    const update = async right => {
      accessRight.value = right;
      // TODO: update group permission
      // try {
      //   if (props.group) {
      //     await updateGroupPermission(
      //       props.project,
      //       props.folder,
      //       props.group,
      //       right.value
      //     );
      //   } else {
      //     await updateFiles(props.project, [
      //       { ...props.folder, defaultPermission: right.value }
      //     ]);
      //   }
      //   emit("folder-access-updated");
      // } catch (error) {
      //   console.error(error);
      // }
    };

    return {
      // References
      accessRight,
      accessRightOptions,
      disabled,
      groupMembers,
      groupName,
      // Methods
      update
    };
  }
};
</script>

<style scoped lang="scss" src="./GroupAccessSelector.scss"></style>
