<template>
  <div class="folder-access-manager" v-if="currentFolder">
    <div class="folder-access-manager__title">
      <BIMDataIconKey size="s" />
      <span class="folder-access-manager__title__text">
        {{ $t("FolderAccessManager.title") }} -
        <BIMDataTextbox width="auto" maxWidth="100px" :text="currentFolder.name" />
      </span>
      <BIMDataButton ghost rounded icon @click="$emit('close')">
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
      <FolderPermissionSelector
        :project="project"
        :folder="currentFolder"
        @folder-permission-updated="loadFolderInfo"
      />
    </div>
    <div class="folder-access-manager__body">
      <BIMDataCheckbox
        v-model="propagate"
        :text="$t('FolderAccessManager.propagate')"
      />
      <div class="folder-access-manager__body__head">
        <span class="folder-access-manager__body__head--name">
          {{ $t("FolderAccessManager.groupHeader") }}
        </span>
        <span class="folder-access-manager__body__head--rights">
          {{ $t("FolderAccessManager.rightsHeader") }}
        </span>
        <span class="folder-access-manager__body__head--members">
          {{ $t("FolderAccessManager.membersHeader") }}
        </span>
      </div>
      <transition-group name="list">
        <GroupPermissionSelector
          v-for="group of filteredGroupList"
          :key="group.id"
          :project="project"
          :folder="currentFolder"
          :group="group"
          :propagate="propagate"
          @group-permission-updated="loadFolderInfo"
        />
      </transition-group>
    </div>
  </div>
  <div v-show="loading" class="loading">
    <BIMDataSpinner class="spinner" />
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { useListFilter } from "../../../../composables/list-filter.js";
import FileService from "../../../../services/FileService.js";
// Components
import FolderPermissionSelector from "./folder-permission-selector/FolderPermissionSelector.vue";
import GroupPermissionSelector from "./group-permission-selector/GroupPermissionSelector.vue";

export default {
  components: {
    FolderPermissionSelector,
    GroupPermissionSelector
  },
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
  emits: ["close"],
  setup(props) {
    const loading = ref(false);
    const currentFolder = ref(null);
    const propagate = ref(false);

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

    watch(
      () => props.folder,
      () => loadFolderInfo(),
      { immediate: true }
    );

    return {
      // References
      currentFolder,
      filteredGroupList,
      loading,
      propagate,
      searchText,
      // Methods
      loadFolderInfo
    };
  }
};
</script>

<style scoped lang="scss" src="./FolderAccessManager.scss"></style>
