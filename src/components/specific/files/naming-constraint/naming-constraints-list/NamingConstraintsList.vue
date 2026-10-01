<template>
  <div class="naming-constraints-list">
    <div v-if="constraints.length > 0" class="naming-constraints-list__head m-t-18">
      <span class="naming-constraints-list__head__title">
        {{ $t("NamingConstraint.rulesSectionTitle") }}
      </span>
      <BIMDataButton color="primary" fill radius @click="create">
        <BIMDataIconAddGavel size="xs" margin="0 6px 0 0" />
        {{ $t("NamingConstraint.addRuleButton") }}
      </BIMDataButton>
    </div>

    <BIMDataSearch
      v-if="constraints.length > 0"
      class="naming-constraints-list__search"
      width="100%"
      color="primary"
      radius
      clear
      :placeholder="$t('NamingConstraint.searchConstraintPlaceholder')"
      v-model="searchText"
    />

    <div v-if="constraints.length === 0" class="naming-constraints-list__empty">
      <BIMDataIllustration
        name="emptyNamingConvention"
        :x="90"
        :y="90"
        :customWidth="130"
        :customHeight="130"
      />
      <span class="naming-constraints-list__empty__title">
        {{ $t("NamingConstraint.rulesEmptyTitle") }}
      </span>
      <span class="naming-constraints-list__empty__text">
        {{ $t("NamingConstraint.rulesEmptyText") }}
      </span>
      <BIMDataButton color="primary" fill radius @click="create">
        <BIMDataIconAddGavel size="xs" margin="0 6px 0 0" />
        {{ $t("NamingConstraint.addRuleButton") }}
      </BIMDataButton>
    </div>

    <ul v-else class="naming-constraints-list__items">
      <li
        v-for="constraint in filteredConstraints"
        :key="constraint.id"
        class="naming-constraints-list__item"
      >
        <div class="naming-constraints-list__item__main">
          <div class="naming-constraints-list__item__name flex items-center justify-between">
            <div class="flex items-center">
              <BIMDataIconNamingConvention size="xs" margin="0 6px 0 0" />
              <BIMDataTextbox :text="constraint.name" width="180px" />
            </div>
            <div class="flex items-center">
              <span
                v-if="constraint.strict"
                class="naming-constraints-list__item__chip naming-constraints-list__item__chip--strict m-x-6"
              >
                {{ $t("NamingConstraint.strictBadge") }}
              </span>
              <div class="naming-constraints-list__item__actions">
                <BIMDataButton color="default" ghost rounded icon @click="edit(constraint)">
                  <BIMDataIconEdit size="xxs" />
                </BIMDataButton>
                <template v-if="confirmId === constraint.id">
                  <div class="delete-actions flex items-center">
                    <BIMDataButton
                      color="high"
                      fill
                      radius
                      width="70px"
                      :disabled="localState.loading"
                      @click="remove(constraint)"
                    >
                      {{ $t("t.confirm") }}
                    </BIMDataButton>
                    <BIMDataButton ghost radius width="70px" @click="confirmId = null">
                      {{ $t("t.cancel") }}
                    </BIMDataButton>
                  </div>
                </template>
                <BIMDataButton
                  v-else
                  ghost
                  color="high"
                  rounded
                  icon
                  @click="confirmId = constraint.id"
                >
                  <BIMDataIconDelete fill size="xxs" />
                </BIMDataButton>
              </div>
            </div>
          </div>
          <div class="naming-constraints-list__item__badges flex items-center">
            <div
              v-if="constraint.creator"
              class="naming-constraints-list__item__avatar flex items-center"
            >
              <UserAvatar :user="constraint.creator" size="16" />
              <span class="m-l-6">
                {{ constraint?.creator?.email }}
              </span>
            </div>
            <div class="naming-constraints-list__item__preview flex items-center">
              <NamingConstraintPreview :rule="constraint.rule" />
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed, inject, ref } from "vue";
import { useNamingConstraints } from "../../../../../state/naming-constraints.js";

import NamingConstraintPreview from "../naming-constraint-preview/NamingConstraintPreview.vue";
import UserAvatar from "../../../users/user-avatar/UserAvatar.vue";

export default {
  components: {
    UserAvatar,
    NamingConstraintPreview,
  },
  setup() {
    const { deleteNamingConstraint } = useNamingConstraints();

    const localState = inject("localState");
    const confirmId = ref(null);
    const searchText = ref("");

    const constraints = computed(() => localState.constraints ?? []);

    const filteredConstraints = computed(() => {
      const search = searchText.value.trim().toLowerCase();
      if (!search) return constraints.value;
      return constraints.value.filter((constraint) =>
        (constraint.name ?? "").toLowerCase().includes(search),
      );
    });

    const create = () => {
      localState.constraint = null;
      localState.currentTab = "constraints";
      localState.currentView = "form";
    };

    const edit = (constraint) => {
      localState.constraint = constraint;
      localState.currentTab = "constraints";
      localState.currentView = "form";
    };

    const openLists = () => {
      localState.currentView = "templates-list";
    };

    const remove = async (constraint) => {
      try {
        localState.loading = true;
        await deleteNamingConstraint(localState.project, constraint);
        localState.constraints = localState.constraints.filter((item) => item.id !== constraint.id);
      } finally {
        confirmId.value = null;
        localState.loading = false;
      }
    };

    return {
      // References
      localState,
      constraints,
      filteredConstraints,
      confirmId,
      searchText,
      // Methods
      create,
      edit,
      openLists,
      remove,
    };
  },
};
</script>

<style scoped src="./NamingConstraintsList.css"></style>
