<template>
  <div class="naming-constraints-list">
    <div v-if="constraints.length > 0" class="naming-constraints-list__head flex flex-col m-t-24">
      <span class="naming-constraints-list__head__title">
        {{ $t("NamingConstraint.rulesSectionTitle") }}
      </span>
      <div class="naming-constraints-list__head__actions flex items-center m-t-6">
        <BIMDataButton color="primary" fill radius @click="create">
          <BIMDataIconAddGavel size="xs" margin="0 6px 0 0" />
          {{ $t("NamingConstraint.addRuleButton") }}
        </BIMDataButton>
        <BIMDataButton
          class="naming-constraints-list__manage"
          color="default"
          fill
          radius
          @click="openLists"
        >
          <BIMDataIconList size="xs" margin="0 6px 0 0" />
          {{ $t("NamingConstraint.manageListsButton") }}
        </BIMDataButton>
      </div>
    </div>

    <BIMDataSearch
      v-if="constraints.length > 0"
      class="naming-constraints-list__search"
      width="100%"
      color="primary"
      radius
      clear
      :placeholder="$t('NamingConstraint.searchPlaceholder')"
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
          <div class="naming-constraints-list__item__name flex items-center">
            <BIMDataIconNamingConvention size="xs" margin="0 6px 0 0" />
            <span>
              {{ constraint.name }}
            </span>
          </div>
          <div class="naming-constraints-list__item__badges">
            <span class="naming-constraints-list__item__chip">
              {{ buildExample(constraint.rule) }}
            </span>
            <span
              v-if="constraint.strict"
              class="naming-constraints-list__item__chip naming-constraints-list__item__chip--strict"
            >
              {{ $t("NamingConstraint.strictBadge") }}
            </span>
          </div>
        </div>
        <div class="naming-constraints-list__item__actions">
          <BIMDataButton ghost rounded icon @click="edit(constraint)">
            <BIMDataIconEdit size="xs" />
          </BIMDataButton>
          <template v-if="confirmId === constraint.id">
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
          </template>
          <BIMDataButton v-else ghost rounded icon @click="confirmId = constraint.id">
            <BIMDataIconDelete fill color="high" size="xs" />
          </BIMDataButton>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed, inject, ref } from "vue";
import { useNamingConstraints } from "../../../../../state/naming-constraints.js";
import { buildExample } from "../../../../../utils/naming-constraint.js";

export default {
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
      localState.currentView = "constraint-form";
    };

    const edit = (constraint) => {
      localState.constraint = constraint;
      localState.currentView = "constraint-form";
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
      buildExample,
      create,
      edit,
      openLists,
      remove,
    };
  },
};
</script>

<style scoped src="./NamingConstraintsList.css"></style>
