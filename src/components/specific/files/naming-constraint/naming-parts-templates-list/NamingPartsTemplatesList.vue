<template>
  <div class="naming-parts-templates-list">
    <div class="naming-parts-templates-list__head">
      <span class="naming-parts-templates-list__head__title">
        {{ $t("NamingConstraint.listsSectionTitle") }}
      </span>
      <BIMDataButton color="primary" fill radius @click="create">
        <BIMDataIconPlus size="xxxs" margin="0 6px 0 0" />
        {{ $t("NamingConstraint.createListButton") }}
      </BIMDataButton>
    </div>

    <BIMDataSearch
      v-if="templates.length > 0"
      class="naming-parts-templates-list__search"
      width="100%"
      radius
      clear
      :placeholder="$t('NamingConstraint.searchPlaceholder')"
      v-model="searchText"
    />

    <div
      v-if="templates.length === 0"
      class="naming-parts-templates-list__empty"
    >
      <BIMDataIllustration
        name="manageList"
        :x="115"
        :y="115"
        :customWidth="130"
        :customHeight="130"
      />
      <span class="naming-parts-templates-list__empty__title">
        {{ $t("NamingConstraint.listsEmptyTitle") }}
      </span>
      <span class="naming-parts-templates-list__empty__text">
        {{ $t("NamingConstraint.listsEmptyText") }}
      </span>
      <BIMDataButton color="primary" fill radius @click="create">
        <BIMDataIconPlus size="xxxs" margin="0 6px 0 0" />
        {{ $t("NamingConstraint.createListButton") }}
      </BIMDataButton>
    </div>

    <ul v-else class="naming-parts-templates-list__items">
      <li
        v-for="template in filteredTemplates"
        :key="template.id"
        class="naming-parts-templates-list__item"
      >
        <div class="naming-parts-templates-list__item__main">
          <span class="naming-parts-templates-list__item__name">
            {{ template.name }}
          </span>
          <div class="naming-parts-templates-list__item__badges">
            <span
              v-for="element in template.elements || []"
              :key="element"
              class="naming-parts-templates-list__item__chip"
            >
              {{ element }}
            </span>
          </div>
        </div>
        <div class="naming-parts-templates-list__item__actions">
          <BIMDataButton ghost rounded icon @click="edit(template)">
            <BIMDataIconEdit size="xs" />
          </BIMDataButton>
          <template v-if="confirmId === template.id">
            <BIMDataButton
              color="high"
              fill
              radius
              width="70px"
              :disabled="localState.loading"
              @click="remove(template)"
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
            @click="confirmId = template.id"
          >
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

export default {
  setup() {
    const { deleteNamingPartsTemplate } = useNamingConstraints();

    const localState = inject("localState");
    const confirmId = ref(null);
    const searchText = ref("");

    const templates = computed(() => localState.templates ?? []);

    const filteredTemplates = computed(() => {
      const search = searchText.value.trim().toLowerCase();
      if (!search) return templates.value;
      return templates.value.filter(template =>
        (template.name ?? "").toLowerCase().includes(search)
      );
    });

    const create = () => {
      localState.template = null;
      localState.currentView = "template-form";
    };

    const edit = template => {
      localState.template = template;
      localState.currentView = "template-form";
    };

    const remove = async template => {
      try {
        localState.loading = true;
        await deleteNamingPartsTemplate(localState.project, template);
        localState.templates = localState.templates.filter(
          item => item.id !== template.id
        );
      } finally {
        confirmId.value = null;
        localState.loading = false;
      }
    };

    return {
      // References
      localState,
      templates,
      filteredTemplates,
      confirmId,
      searchText,
      // Methods
      create,
      edit,
      remove
    };
  }
};
</script>

<style scoped lang="scss">
.naming-parts-templates-list {
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
      font-size: 12px;
    }

    &__actions {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }
  }
}
</style>
