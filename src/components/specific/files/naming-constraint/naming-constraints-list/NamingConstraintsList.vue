<template>
  <div class="naming-constraints-list">
    <div class="naming-constraints-list__head">
      <span class="naming-constraints-list__head__title">
        {{ $t("NamingConstraint.rulesSectionTitle") }}
      </span>
      <BIMDataButton color="primary" fill radius @click="create">
        <BIMDataIconRules size="xs" margin="0 6px 0 0" />
        {{ $t("NamingConstraint.addRuleButton") }}
      </BIMDataButton>
    </div>

    <BIMDataSearch
      v-if="constraints.length > 0"
      class="naming-constraints-list__search"
      width="100%"
      radius
      clear
      :placeholder="$t('NamingConstraint.searchPlaceholder')"
      v-model="searchText"
    />

    <div
      v-if="constraints.length === 0"
      class="naming-constraints-list__empty"
    >
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
        <BIMDataIconRules size="xs" margin="0 6px 0 0" />
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
          <span class="naming-constraints-list__item__name">
            {{ constraint.name }}
          </span>
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
          <BIMDataButton
            v-else
            ghost
            rounded
            icon
            @click="confirmId = constraint.id"
          >
            <BIMDataIconDelete fill color="high" size="xs" />
          </BIMDataButton>
        </div>
      </li>
    </ul>

    <BIMDataButton
      class="naming-constraints-list__manage"
      ghost
      radius
      @click="openLists"
    >
      <BIMDataIconList size="xs" margin="0 6px 0 0" />
      {{ $t("NamingConstraint.manageListsButton") }}
    </BIMDataButton>
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
      return constraints.value.filter(constraint =>
        (constraint.name ?? "").toLowerCase().includes(search)
      );
    });

    const create = () => {
      localState.constraint = null;
      localState.currentView = "constraint-form";
    };

    const edit = constraint => {
      localState.constraint = constraint;
      localState.currentView = "constraint-form";
    };

    const openLists = () => {
      localState.currentView = "templates-list";
    };

    const remove = async constraint => {
      try {
        localState.loading = true;
        await deleteNamingConstraint(localState.project, constraint);
        localState.constraints = localState.constraints.filter(
          item => item.id !== constraint.id
        );
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
      remove
    };
  }
};
</script>

<style scoped lang="scss">
.naming-constraints-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
  height: 100%;
  padding: 18px;

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;

    &__title {
      font-size: 16px;
      font-weight: 500;
      color: var(--color-primary);
    }
  }

  &__empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 24px 12px;
    text-align: center;

    &__title {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-primary);
    }

    &__text {
      max-width: 280px;
      font-size: 13px;
      line-height: 18px;
      color: var(--color-granite);
    }
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 6px;
    background-color: var(--color-white);
    box-shadow: var(--box-shadow);

    &__main {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
      flex-grow: 1;
    }

    &__name {
      font-weight: 600;
      color: var(--color-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__badges {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    &__chip {
      padding: 2px 8px;
      border-radius: 6px;
      background-color: var(--color-tertiary-lightest, var(--color-silver-light));
      color: var(--color-granite);
      font-family: monospace;
      font-size: 12px;

      &--strict {
        background-color: var(--color-warning-lightest, var(--color-silver-light));
        color: var(--color-warning);
        font-family: inherit;
      }
    }

    &__actions {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }
  }

  &__manage {
    margin-top: auto;
    align-self: flex-start;
  }
}
</style>
