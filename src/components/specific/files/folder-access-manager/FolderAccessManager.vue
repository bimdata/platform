<script setup>
import { ref, computed, watch } from "vue";
import { useListFilter } from "../../../../composables/list-filter.js";
import FileService from "../../../../services/FileService.js";
import { useFiles } from "../../../../state/files.js";
import { useGroups } from "../../../../state/groups.js"
// Components
import FolderPermissionSelector from "./FolderPermissionSelector.vue";

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  folder: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(["close"]);

const { updateFiles } = useFiles();
const { updateGroupPermission } = useGroups();

const loading = ref(false);
const closing = ref(false);
const currentFolder = ref(null);
const updates = new Map();

const groupList = computed(
  () =>
    currentFolder.value?.groups_permissions.map(({ group }) => group) ?? []
);

const { filteredList: filteredGroupList, searchText } = useListFilter(
  groupList,
  group => group.name
);

const loadFolderInfo = async () => {
  try {
    loading.value = true;
    currentFolder.value = await FileService.fetchFolder(
      props.project,
      props.folder
    );
  } finally {
    loading.value = false;
  }
};

const onPermissionUpdate = event => {
  updates.set(event.group?.id ?? null, event);
};

const submit = async () => {
  await Promise.all(
    [...updates.values()].map(
      async ({ folder, group, permission, propagate }) => {
        if (group) {
          await updateGroupPermission(props.project,
            folder, group, { permission, propagate }
          );
        } else {
          await updateFiles(props.project, [
            { ...folder, default_permission: permission }
          ]);
        }
      }
    )
  );
  updates.clear();
  loadFolderInfo();
};

const onCloseClick = () => {
  if (updates.size > 0) {
    closing.value = true;
  } else {
    close();
  }
};

const close = () => {
  updates.clear();
  closing.value = false;
  emit("close");
};

watch(
  () => props.folder,
  () => {
    updates.clear();
    loadFolderInfo();
  },
  { immediate: true }
);
</script>

<template>
  <div class="folder-access-manager" v-if="currentFolder">
    <div class="folder-access-manager__title">
      <BIMDataIconKey size="s" />
      <span class="folder-access-manager__title__text">
        {{ $t("FolderAccessManager.title") }} -
        <BIMDataTextbox width="auto" maxWidth="100px" :text="currentFolder.name" />
      </span>
      <BIMDataButton ghost rounded icon @click="onCloseClick">
        <BIMDataIconClose size="xxs" fill color="granite-light" />
      </BIMDataButton>
    </div>
    <div class="folder-access-manager__head">
      <BIMDataSearch
        class="folder-access-manager__head__search"
        width="100%"
        color="primary"
        :placeholder="$t('t.search')"
        v-model="searchText"
        clear
      />
    </div>
    <div class="folder-access-manager__body">
      <div class="folder-access-manager__body__head">
        <span class="folder-access-manager__body__head--name">
          {{ $t("FolderAccessManager.groupHeader") }}
        </span>
        <span class="folder-access-manager__body__head--permissions">
          {{ $t("FolderAccessManager.rightsHeader") }}
        </span>
        <span class="folder-access-manager__body__head--users">
          {{ $t("FolderAccessManager.membersHeader") }}
        </span>
        <span class="folder-access-manager__body__head--propagate">
          <BIMDataTooltip :text="$t('FolderAccessManager.propagate')" position="bottom" maxWidth="200px">
            <div class="circle">?</div>
          </BIMDataTooltip>
        </span>
      </div>

      <FolderPermissionSelector
        :project="project"
        :folder="currentFolder"
        @folder-permission-update="onPermissionUpdate"
      />

      <div class="separator"></div>

      <div class="folder-access-manager__body__list">
        <transition-group name="list">
          <FolderPermissionSelector
            v-for="group of filteredGroupList"
            :key="group.id"
            :project="project"
            :folder="currentFolder"
            :group="group"
            @folder-permission-update="onPermissionUpdate"
          />
        </transition-group>
      </div>

      <div class="folder-access-manager__body__tail">
        <BIMDataInfobox
          :text="$t('FolderAccessManager.propagate')"
          color="secondary"
        />
        <BIMDataButton fill radius color="primary" @click="submit">
          {{ $t("t.save") }}
        </BIMDataButton>
      </div>

    </div>
  </div>

  <div v-show="loading" class="loading">
    <BIMDataSpinner class="spinner" />
  </div>

  <BIMDataSafeZoneModal v-show="closing">
    <template #title>
      {{ $t("FolderAccessManager.safeZoneModal.title") }}
    </template>
    <template #text>
      {{ $t("FolderAccessManager.safeZoneModal.text") }}
    </template>
    <template #actions>
      <BIMDataButton width="120px" ghost radius @click="closing = false">
        {{ $t("t.cancel") }}
      </BIMDataButton>
      <BIMDataButton width="120px" color="high" fill radius @click="close">
        {{ $t("t.ok") }}
      </BIMDataButton>
    </template>
  </BIMDataSafeZoneModal>
</template>

<style scoped lang="scss">
.folder-access-manager {
  width: 100%;
  height: 100%;
  padding: 0;
  color: var(--color-primary);
  display: flex;
  flex-direction: column;
  gap: calc(var(--spacing-unit) * 3 / 2);

  &__title {
    display: flex;
    align-items: center;
    gap: var(--spacing-unit);

    &__text {
      flex-grow: 1;
      font-weight: bold;
    }
  }

  &__head {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-unit);
    padding-bottom: var(--spacing-unit);

    &__search {
      font-size: 1rem;
    }
  }

  &__body {
    height: calc(100% - var(--spacing-unit));
    display: flex;
    flex-direction: column;
    gap: var(--spacing-unit);

    &__head {
      display: flex;
      align-items: center;
      gap: calc(var(--spacing-unit) / 2);
      color: var(--color-granite-light);

      &--name {
        flex-grow: 1;
      }

      &--permissions {
        width: 150px;
      }

      &--users {
        width: 100px;
      }

      &--propagate {
        width: 20px;

        &:deep() {
          .bimdata-tooltip__tooltip {
            width: 200px;
            left: -80px;
            &::before { left: calc(100% - 14px); }
          }
        }

        .circle {
          width: 20px;
          height: 20px;
          padding: 0 6px;
          border-radius: 50%;
          background-color: var(--color-primary);
          color: var(--color-white);
          cursor: pointer;
        }
      }
    }

    .separator {
      margin: calc(var(--spacing-unit) / 2) 0;
      border-bottom: 2px solid var(--color-silver-light);
    }

    &__list {
      height: 0;
      flex-grow: 1;
      overflow: auto;

      display: flex;
      flex-direction: column;
      gap: var(--spacing-unit);
    }

    &__tail {
      margin-top: auto;

      .bimdata-btn {
        width: 100%;
        margin-top: var(--spacing-unit);
      }
    }
  }
}

.loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);

  .spinner {
    transform: scale(2);
  }
}
</style>
