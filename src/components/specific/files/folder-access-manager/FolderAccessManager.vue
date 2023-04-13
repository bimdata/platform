<template>
  <template v-if="listFilter">
    <div class="folder-access-manager">
      <div class="folder-access-manager__title">
        <BIMDataIcon name="key" size="s" />
        <span class="folder-access-manager__title__text">
          {{ $t("FolderAccessManager.title") }} -
          <BIMDataTextbox width="auto" maxWidth="100px" :text="folder.name" />
        </span>
        <BIMDataButton ghost rounded icon @click="$emit('close')">
          <BIMDataIcon name="close" size="xxs" fill color="granite-light" />
        </BIMDataButton>
      </div>
      <div class="folder-access-manager__head">
        <BIMDataSearch
          class="folder-access-manager__head__search"
          width="100%"
          color="primary"
          :placeholder="$t('FolderAccessManager.searchInputPlaceholder')"
          v-model="listFilter.searchText"
        />
        <FolderPermissionSelector
          :project="project"
          :folder="currentFolder"
          @folder-permission-updated="getFolderInfo"
        />
      </div>
      <div class="folder-access-manager__body">
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
            v-for="group of listFilter.filteredList"
            :key="group.id"
            :project="project"
            :folder="currentFolder"
            :group="group"
            @group-permission-updated="getFolderInfo"
          />
        </transition-group>
      </div>
    </div>
  </template>
</template>

<script>
import { ref, onMounted } from "vue";
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
    const listFilter = ref(null);
    const currentFolder = ref(null);

    const getFolderInfo = async () => {
      currentFolder.value = await FileService.fetchFolder(
        props.project,
        props.folder
      );

      listFilter.value = useListFilter(
        currentFolder.value.groups_permissions.map(({ group }) => group),
        group => group.name
      );
    };

    onMounted(() => getFolderInfo());

    return {
      // References
      listFilter,
      currentFolder,
      // methods
      getFolderInfo
    };
  }
};
</script>

<style scoped lang="scss" src="./FolderAccessManager.scss"></style>
