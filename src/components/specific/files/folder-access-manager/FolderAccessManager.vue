<template>
  <div class="folder-access-manager">
    <div class="folder-access-manager__title">
      <BIMDataIcon name="key" size="l" />
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
        v-model="searchText"
      />
      <FolderPermissionSelector
        :project="project"
        :folder="folder"
        @folder-permission-updated="$emit('folder-permission-updated')"
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
          v-for="group of displayedGroups"
          :key="group.id"
          :project="project"
          :folder="folder"
          :group="group"
          @group-permission-updated="$emit('group-permission-updated')"
        />
      </transition-group>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useListFilter } from "../../../../composables/list-filter.js";
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
    },
    groups: {
      type: Array,
      required: true
    }
  },
  emits: ["close", "folder-permission-updated", "group-permission-updated"],
  setup(props) {
    const { filteredList: displayedGroups, searchText } = useListFilter(
      computed(() => props.groups),
      group => group.name
    );

    return {
      // References
      displayedGroups,
      searchText
    };
  }
};
</script>

<style scoped lang="scss" src="./FolderAccessManager.scss"></style>
