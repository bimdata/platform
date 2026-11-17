<template>
  <div class="naming-part-lists-list">
    <div class="naming-part-lists-list__head m-t-18" v-if="partLists.length > 0">
      <span class="naming-part-lists-list__head__title">
        {{ $t("NamingConstraint.listsSectionTitle") }}
      </span>
      <BIMDataButton color="primary" fill radius @click="create">
        <BIMDataIconAddList size="xxs" margin="0 6px 0 0" />
        {{ $t("NamingConstraint.createListButton") }}
      </BIMDataButton>
    </div>

    <BIMDataSearch
      v-if="partLists.length > 0"
      class="naming-part-lists-list__search"
      color="primary"
      width="100%"
      radius
      clear
      :placeholder="$t('NamingConstraint.searchListPlaceholder')"
      v-model="searchText"
    />

    <div v-if="partLists.length === 0" class="naming-part-lists-list__empty">
      <BIMDataIllustration
        name="manageList"
        :x="115"
        :y="115"
        :customWidth="130"
        :customHeight="130"
      />
      <span class="naming-part-lists-list__empty__title">
        {{ $t("NamingConstraint.listsEmptyTitle") }}
      </span>
      <span class="naming-part-lists-list__empty__text">
        {{ $t("NamingConstraint.listsEmptyText") }}
      </span>
      <BIMDataButton color="primary" fill radius @click="create">
        <BIMDataIconAddList size="xs" margin="0 6px 0 0" />
        {{ $t("NamingConstraint.createListButton") }}
      </BIMDataButton>
    </div>

    <ul v-else class="naming-part-lists-list__items">
      <li
        v-for="partList in filteredPartLists"
        :key="partList.id"
        class="naming-part-lists-list__item"
      >
        <div class="naming-part-lists-list__item__main">
          <div class="flex items-center">
            <BIMDataIconList size="xxs" margin="0 6px 0 0" />
            <span class="naming-part-lists-list__item__name">
              {{ partList.name }}
            </span>
          </div>
          <div class="naming-part-lists-list__item__badges">
            <span
              v-for="element in partList.elements || []"
              :key="element"
              class="naming-part-lists-list__item__chip"
            >
              {{ element }}
            </span>
          </div>
        </div>
        <div class="naming-part-lists-list__item__actions">
          <BIMDataButton ghost rounded icon @click="edit(partList)">
            <BIMDataIconEdit size="xs" />
          </BIMDataButton>
          <template v-if="confirmId === partList.id">
            <BIMDataButton
              color="high"
              fill
              radius
              width="70px"
              :disabled="localState.loading"
              @click="remove(partList)"
            >
              {{ $t("t.confirm") }}
            </BIMDataButton>
            <BIMDataButton ghost radius width="70px" @click="confirmId = null">
              {{ $t("t.cancel") }}
            </BIMDataButton>
          </template>
          <BIMDataButton color="high" v-else ghost rounded icon @click="confirmId = partList.id">
            <BIMDataIconDelete fill color="high" size="xs" />
          </BIMDataButton>
        </div>
      </li>
    </ul>
    <NamingPartListInUseModal
      v-if="inUseModal.open"
      :part-list="inUseModal.partList"
      :constraints="inUseModal.constraints"
      :on-close="closeInUseModal"
    />
  </div>
</template>

<script>
import { computed, inject, ref } from "vue";
import { useI18n } from "vue-i18n";
import { NamingPartListInUseError } from "../../../../../services/NamingConstraintService.js";
import { useNamingConstraints } from "../../../../../state/naming-constraints.js";

import NamingPartListInUseModal from "./naming-part-list-in-use-modal/NamingPartListInUseModal.vue";

export default {
  components: {
    NamingPartListInUseModal,
  },
  setup() {
    const { t } = useI18n();
    const { deleteNamingPartList } = useNamingConstraints();

    const localState = inject("localState");
    const confirmId = ref(null);
    const searchText = ref("");

    const partLists = computed(() => localState.partLists ?? []);

    const filteredPartLists = computed(() => {
      const search = searchText.value.trim().toLowerCase();
      if (!search) return partLists.value;
      return partLists.value.filter((partList) =>
        (partList.name ?? "").toLowerCase().includes(search),
      );
    });

    const create = () => {
      localState.partList = null;
      localState.currentTab = "part-lists";
      localState.returnTo = {
        tab: "part-lists",
        view: "list",
      };
      localState.currentView = "form";
    };

    const edit = (partList) => {
      localState.partList = partList;
      localState.currentTab = "part-lists";
      localState.currentView = "form";
    };

    const inUseModal = ref({
      open: false,
      partList: null,
      constraints: [],
    });

    const closeInUseModal = () => {
      inUseModal.value = {
        open: false,
        partList: null,
        constraints: [],
      };
    };

    const remove = async (partList) => {
      try {
        localState.loading = true;

        await deleteNamingPartList(localState.project, partList);

        localState.partLists = localState.partLists.filter((item) => item.id !== partList.id);
      } catch (error) {
        if (!(error instanceof NamingPartListInUseError)) {
          throw error;
        }

        inUseModal.value = {
          open: true,
          partList,
          constraints: error.constraints,
        };
      } finally {
        confirmId.value = null;
        localState.loading = false;
      }
    };

    return {
      // References
      localState,
      partLists,
      filteredPartLists,
      confirmId,
      searchText,
      inUseModal,
      // Methods
      closeInUseModal,
      create,
      edit,
      remove,
    };
  },
};
</script>

<style scoped src="./NamingPartListsList.css"></style>
