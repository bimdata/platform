<template>
  <div class="folder-permission-selector">
    <BIMDataTextbox
      class="folder-permission-selector__label"
      width="0"
      :text="group?.name ?? $t('FolderPermissionSelector.label')"
    />

    <BIMDataDropdownList
      class="folder-permission-selector__input"
      width="150px"
      height="32px"
      :list="permissionOptions"
      :closeOnElementClick="true"
      @element-click="update"
    >
      <template #header>
        {{ $t(`FolderPermissionSelector.options.${selectedPermission.id}`) }}
      </template>
      <template #element="{ element }">
        {{ $t(`FolderPermissionSelector.options.${element.id}`) }}
      </template>
    </BIMDataDropdownList>

    <template v-if="group">
      <UserAvatarList
        class="folder-permission-selector__users"
        :users="group.members"
        itemGap="18"
      />
    </template>
    <template v-else>
      <div class="folder-permission-selector__blank">
        <!-- This block is here for alignment purpose -->
      </div>
    </template>

    <BIMDataCheckbox
      class="folder-permission-selector__checkbox"
      v-model="propagate"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { FILE_PERMISSION } from "../../../../config/files.js";
// Components
import UserAvatarList from "../../users/user-avatar-list/UserAvatarList.vue";

const props = defineProps({
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
    default: null
  },
});

const emit = defineEmits(["folder-permission-update"]);

const PERMISSION_LIST = [
  { id: "default", value: FILE_PERMISSION.DEFAULT },
  { id: "accessDenied", value: FILE_PERMISSION.ACCESS_DENIED },
  { id: "readOnly", value: FILE_PERMISSION.READ_ONLY },
  { id: "readWrite", value: FILE_PERMISSION.READ_WRITE }
];

const permissionOptions = computed(() =>
  PERMISSION_LIST.slice(props.group ? 0 : 1)
);

const selectedPermission = ref();
const propagate = ref(false);

watch(
  [() => props.folder, () => props.group],
  ([folder, group]) => {
    let perm = folder.default_permission;
    if (group) {
      perm = folder.groups_permissions
        .find(p => p.group.id === group.id)
        ?.permission;
    }
    selectedPermission.value =
      permissionOptions.value.find(p => p.value === perm) ??
      permissionOptions.value[0];
  },
  { immediate: true }
);

watch(
  propagate,
  value => emit("folder-permission-update", {
    folder: props.folder,
    group: props.group,
    permission: selectedPermission.value.value,
    propagate: value
  })
);

const update = perm => {
  selectedPermission.value = perm;
  emit("folder-permission-update", {
    folder: props.folder,
    group: props.group,
    permission: perm.value,
    propagate: propagate.value
  });
};
</script>

<style scoped lang="scss">
.folder-permission-selector {
  display: flex;
  align-items: center;
  gap: calc(var(--spacing-unit) / 2);

  &__label {
    flex-grow: 1;
  }

  &__input {
    height: 32px;

    &:deep() {
      .bimdata-dropdown-list__content {
        padding: 0 6px;
      }
    }
  }

  &__users,
  &__blank {
    min-width: 100px;
  }

  &__checkbox {
    width: 20px;
    padding: 0 4px;
  }
}
</style>
