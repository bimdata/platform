<template>
  <div class="folder-permission-selector">
    <TextBox
      class="folder-permission-selector__label"
      :text="$t('FolderPermissionSelector.label')"
      :maxLength="16"
    />
    <BIMDataDropdownList
      class="folder-permission-selector__input"
      width="150px"
      height="32px"
      :list="permissionList"
      :closeOnElementClick="true"
      @element-click="update"
    >
      <template #header>
        {{ $t(`FolderPermissionSelector.options.${folderPermission.id}`) }}
      </template>
      <template #element="{ element }">
        {{ $t(`FolderPermissionSelector.options.${element.id}`) }}
      </template>
    </BIMDataDropdownList>
    <div class="folder-permission-selector__tail">
      <!-- This block is here for alignment purpose -->
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useFiles } from "@/state/files";
import { FILE_PERMISSION } from "@/utils/file-structure";

const permissionList = [
  { id: "accessDenied", value: FILE_PERMISSION.ACCESS_DENIED },
  { id: "readOnly", value: FILE_PERMISSION.READ_ONLY },
  { id: "readWrite", value: FILE_PERMISSION.READ_WRITE }
];

export default {
  props: {
    project: {
      type: Object,
      required: true
    },
    folder: {
      type: Object,
      required: true
    }
  },
  emits: ["folder-permission-updated"],
  setup(props, { emit }) {
    const { updateFiles } = useFiles();

    const folderPermission = ref();
    watch(
      () => props.folder.defaultPermission,
      permValue => {
        folderPermission.value = permissionList.find(
          perm => perm.value === permValue
        );
      },
      { immediate: true }
    );

    const update = async perm => {
      folderPermission.value = perm;
      const [response] = await updateFiles(props.project, [
        { ...props.folder, defaultPermission: perm.value }
      ]);
      emit("folder-permission-updated", {
        folder: response,
        permission: perm.value
      });
    };

    return {
      // References
      folderPermission,
      permissionList,
      // Methods
      update
    };
  }
};
</script>

<style scoped lang="scss" src="./FolderPermissionSelector.scss"></style>
