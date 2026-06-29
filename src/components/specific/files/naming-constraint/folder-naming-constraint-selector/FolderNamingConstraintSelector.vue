<template>
  <div class="folder-naming-constraint-selector">
    <div class="folder-naming-constraint-selector__head">
      <span class="folder-naming-constraint-selector__head__title">
        {{ $t("NamingConstraint.rulesSectionTitle") }}
      </span>
      <BIMDataButton color="primary" fill radius @click="create">
        <BIMDataIconRules size="xs" margin="0 6px 0 0" />
        {{ $t("NamingConstraint.addRuleButton") }}
      </BIMDataButton>
    </div>

    <BIMDataSearch
      v-if="constraints.length > 0"
      class="folder-naming-constraint-selector__search"
      width="100%"
      radius
      clear
      :placeholder="$t('NamingConstraint.searchPlaceholder')"
      v-model="searchText"
    />

    <div
      v-if="constraints.length === 0"
      class="folder-naming-constraint-selector__empty"
    >
      <BIMDataIllustration
        name="emptyNamingConvention"
        :x="90"
        :y="90"
        :customWidth="130"
        :customHeight="130"
      />
      <span class="folder-naming-constraint-selector__empty__title">
        {{ $t("NamingConstraint.rulesEmptyTitle") }}
      </span>
      <span class="folder-naming-constraint-selector__empty__text">
        {{ $t("NamingConstraint.rulesEmptyText") }}
      </span>
      <BIMDataButton color="primary" fill radius @click="create">
        <BIMDataIconRules size="xs" margin="0 6px 0 0" />
        {{ $t("NamingConstraint.addRuleButton") }}
      </BIMDataButton>
    </div>

    <template v-else>
      <ul class="folder-naming-constraint-selector__items">
        <li
          v-for="constraint in filteredConstraints"
          :key="constraint.id"
          class="folder-naming-constraint-selector__item"
          :class="{
            'folder-naming-constraint-selector__item--selected':
              selectedId === constraint.id
          }"
          @click="select(constraint.id)"
        >
          <BIMDataRadio
            :modelValue="selectedId"
            :value="constraint.id"
            @update:modelValue="select(constraint.id)"
          />
          <BIMDataIconLock size="xs" fill color="granite" />
          <div class="folder-naming-constraint-selector__item__main">
            <span class="folder-naming-constraint-selector__item__name">
              {{ constraint.name }}
            </span>
            <div class="folder-naming-constraint-selector__item__badges">
              <span class="folder-naming-constraint-selector__item__chip">
                {{ buildExample(constraint.rule) }}
              </span>
              <span
                v-if="constraint.strict"
                class="folder-naming-constraint-selector__item__chip folder-naming-constraint-selector__item__chip--strict"
              >
                {{ $t("NamingConstraint.strictBadge") }}
              </span>
            </div>
          </div>
          <BIMDataButton
            ghost
            rounded
            icon
            @click.stop="edit(constraint)"
          >
            <BIMDataIconEdit size="xs" />
          </BIMDataButton>
        </li>
      </ul>

      <div class="folder-naming-constraint-selector__footer">
        <BIMDataCheckbox
          v-model="recursive"
          :text="$t('NamingConstraint.recursiveLabel')"
        />
        <span class="folder-naming-constraint-selector__footer__help">
          {{ $t("NamingConstraint.recursiveHelp") }}
        </span>
        <BIMDataButton
          class="folder-naming-constraint-selector__footer__save"
          color="primary"
          fill
          radius
          width="100%"
          :disabled="!selectedId || localState.loading"
          @click="apply"
        >
          <BIMDataIconRules size="xs" margin="0 6px 0 0" />
          {{ $t("NamingConstraint.saveRuleButton") }}
        </BIMDataButton>
      </div>
    </template>
  </div>
</template>

<script>
import { computed, inject, ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  useNamingConstraints,
  NamingConstraintConflictError
} from "../../../../../state/naming-constraints.js";
import { buildExample } from "../../../../../utils/naming-constraint.js";
import { useAppNotification } from "../../../app/app-notification/app-notification.js";
import { useAppSidePanel } from "../../../app/app-side-panel/app-side-panel.js";

export default {
  setup() {
    const { t } = useI18n();
    const { setFolderNamingConstraint } = useNamingConstraints();
    const { pushNotification } = useAppNotification();
    const { closeSidePanel } = useAppSidePanel();

    const localState = inject("localState");
    const searchText = ref("");

    const constraints = computed(() => localState.constraints ?? []);

    const filteredConstraints = computed(() => {
      const search = searchText.value.trim().toLowerCase();
      if (!search) return constraints.value;
      return constraints.value.filter(constraint =>
        (constraint.name ?? "").toLowerCase().includes(search)
      );
    });

    const selectedId = computed(() => localState.selectedConstraintId);
    const recursive = computed({
      get: () => localState.recursive,
      set: value => {
        localState.recursive = value;
      }
    });

    const select = id => {
      localState.selectedConstraintId = id;
    };

    const create = () => {
      localState.constraint = null;
      localState.currentView = "constraint-form";
    };

    const edit = constraint => {
      localState.constraint = constraint;
      localState.currentView = "constraint-form";
    };

    const apply = async () => {
      if (!localState.selectedConstraintId) {
        return;
      }
      try {
        localState.loading = true;
        const result = await setFolderNamingConstraint(
          localState.project,
          localState.folder,
          {
            constraint_id: localState.selectedConstraintId,
            recursive: localState.recursive
          }
        );
        const conflicts = result?.conflicting_documents ?? [];
        if (conflicts.length > 0) {
          pushNotification({
            type: "warning",
            title: t("NamingConstraint.applyRuleConflictTitle"),
            message: t("NamingConstraint.applyRuleConflictMessage", {
              count: conflicts.length
            })
          });
        } else {
          pushNotification({
            type: "success",
            title: t("NamingConstraint.applyRuleSuccessTitle"),
            message: t("NamingConstraint.applyRuleSuccessMessage")
          });
        }
        closeSidePanel();
      } catch (error) {
        if (error instanceof NamingConstraintConflictError) {
          pushNotification({
            type: "error",
            title: t("NamingConstraint.applyRuleBlockedTitle"),
            message: t("NamingConstraint.applyRuleBlockedMessage", {
              count: error.documents?.length ?? 0
            })
          });
        } else {
          pushNotification({
            type: "error",
            title: t("NamingConstraint.applyRuleError"),
            message: ""
          });
        }
      } finally {
        localState.loading = false;
      }
    };

    return {
      // References
      localState,
      constraints,
      filteredConstraints,
      selectedId,
      recursive,
      searchText,
      // Methods
      buildExample,
      select,
      create,
      edit,
      apply
    };
  }
};
</script>

<style scoped lang="scss">
.folder-naming-constraint-selector {
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
    gap: 10px;
    padding: 12px;
    border: 1px solid transparent;
    border-radius: 6px;
    background-color: var(--color-white);
    box-shadow: var(--box-shadow);
    cursor: pointer;

    &--selected {
      border-color: var(--color-primary);
    }

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
  }

  &__footer {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid var(--color-silver-light);

    &__help {
      font-size: 12px;
      line-height: 17px;
      color: var(--color-granite);
    }

    &__save {
      margin-top: 6px;
    }
  }
}
</style>
