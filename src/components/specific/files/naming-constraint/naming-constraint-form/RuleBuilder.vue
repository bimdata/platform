<template>
  <div class="rule-builder">
    <ul class="rule-builder__parts" v-if="parts.length > 0">
      <li
        v-for="(part, index) in parts"
        :key="index"
        class="rule-builder__part"
        :class="{
          'rule-builder__part--dragging': draggingIndex === index,
          'rule-builder__part--drag-over-top': dragOverIndex === index && dragPosition === 'before',
          'rule-builder__part--drag-over-bottom':
            dragOverIndex === index && dragPosition === 'after',
        }"
        @dragover.prevent="onDragOver(index, $event)"
        @dragleave="onDragLeave(index)"
        @drop.prevent="onDrop(index)"
      >
        <div class="rule-builder__part__main flex items-center">
          <div
            class="rule-builder__part__grip"
            draggable="true"
            @dragstart="onDragStart(index, $event)"
            @dragend="onDragEnd"
          >
            <BIMDataIconDrag fill color="default" />
          </div>

          <div class="rule-builder__part__type">
            {{ $t(partTypeLabel(part.type)) }}
          </div>

          <div class="rule-builder__part__value">
            <template v-if="part.type === 'n_chars'">
              <input
                class="rule-builder__number"
                type="number"
                min="1"
                :placeholder="$t('NamingConstraint.maxLengthLabel')"
                :value="part.max_length"
                @input="onNumberInput(index, 'max_length', $event)"
              />
            </template>

            <template v-else-if="part.type === 'bounded'">
              <input
                class="rule-builder__number"
                type="number"
                :placeholder="$t('NamingConstraint.minLabel')"
                :value="part.min_value"
                @input="onNumberInput(index, 'min_value', $event)"
              />
              <span class="rule-builder__dash">-</span>
              <input
                class="rule-builder__number"
                type="number"
                :placeholder="$t('NamingConstraint.maxLabel')"
                :value="part.max_value"
                @input="onNumberInput(index, 'max_value', $event)"
              />
            </template>

            <template v-else-if="part.type === 'values_in'">
              <BIMDataDropdownMenu class="rule-builder__select" :header="true" width="100%">
                <template #header="{ isOpen }">
                  <span
                    class="rule-builder__select__label"
                    :class="{
                      'rule-builder__select__label--placeholder': !selectedTemplateLabel(part),
                    }"
                    >{{
                      selectedTemplateLabel(part) || $t("NamingConstraint.selectListPlaceholder")
                    }}</span
                  >
                  <BIMDataIconChevron :rotate="isOpen ? 90 : 0" size="xxs" />
                </template>
                <template #element>
                  <ul class="bimdata-list">
                    <li
                      v-for="template of templates"
                      :key="template.id"
                      :class="{
                        'bimdata-list__item--selected': selectedTemplateId(part) === template.id,
                      }"
                      @click="onLoadTemplate(index, template.id)"
                    >
                      {{ template.name }}
                    </li>
                  </ul>
                </template>
              </BIMDataDropdownMenu>
            </template>
          </div>

          <div class="rule-builder__part__actions">
            <BIMDataButton
              v-if="part.type === 'values_in'"
              ghost
              rounded
              icon
              color="default"
              @click="goToTemplate(index)"
            >
              <BIMDataIconAddList fill color="default" size="xxs" />
            </BIMDataButton>
            <BIMDataButton ghost rounded icon color="high" @click="removePart(index)">
              <BIMDataIconDelete fill size="xs" />
            </BIMDataButton>
          </div>
        </div>

        <!-- <div
          v-if="part.type === 'values_in' && creatingIndex === index"
          class="rule-builder__create-panel"
        >
          <input
            class="rule-builder__create-panel__input"
            type="text"
            :placeholder="$t('NamingConstraint.listNamePlaceholder')"
            v-model="newTemplateName"
          />
          <input
            class="rule-builder__create-panel__input"
            type="text"
            :placeholder="$t('NamingConstraint.elementsHelp')"
            v-model="newTemplateElementsText"
          />
          <div class="rule-builder__create-panel__actions">
            <BIMDataButton ghost radius @click="cancelCreateForm">
              {{ $t("t.cancel") }}
            </BIMDataButton>
            <BIMDataButton color="primary" fill radius @click="confirmCreateTemplate(index)">
              {{ $t("NamingConstraint.createListButton") }}
            </BIMDataButton>
          </div>
        </div> -->
      </li>
    </ul>

    <p v-else class="rule-builder__empty-text">
      {{ $t("NamingConstraint.emptyStateHelp") }}
    </p>

    <p class="rule-builder__add-label">
      {{ $t("NamingConstraint.addPartButton") }}
    </p>

    <div class="rule-builder__add-buttons flex">
      <BIMDataButton
        fill
        color="default"
        radius
        class="rule-builder__add-button"
        @click="addPart('n_chars')"
      >
        + {{ $t("NamingConstraint.partTypeNChars") }}
      </BIMDataButton>

      <BIMDataButton
        fill
        color="default"
        radius
        class="rule-builder__add-button"
        @click="addPart('bounded')"
      >
        + {{ $t("NamingConstraint.partTypeBounded") }}
      </BIMDataButton>

      <BIMDataButton
        fill
        color="default"
        radius
        class="rule-builder__add-button"
        @click="addPart('values_in')"
      >
        + {{ $t("NamingConstraint.partTypeValuesIn") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";

const defaultPart = (type) => {
  switch (type) {
    case "bounded":
      return { type: "bounded", min_value: 1, max_value: 99 };
    case "n_chars":
      return { type: "n_chars", max_length: 10 };
    case "values_in":
    default:
      return { type: "values_in", elements: [] };
  }
};

export default {
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
    templates: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update:modelValue", "go-to-template"],
  setup(props, { emit }) {
    const parts = computed(() => props.modelValue ?? []);
    const draggingIndex = ref(null);
    const dragOverIndex = ref(null);
    const dragPosition = ref(null); // 'before' | 'after'

    const clone = () => JSON.parse(JSON.stringify(parts.value));

    const emitChange = (next) => {
      emit("update:modelValue", next);
    };
    const goToTemplate = (index) => {
      emit("go-to-template", index);
    };

    const addPart = (type) => {
      emitChange([...clone(), defaultPart(type)]);
    };

    const removePart = (index) => {
      const next = clone();
      next.splice(index, 1);
      emitChange(next);
    };

    const onTypeChange = (index, type) => {
      const next = clone();
      next.splice(index, 1, defaultPart(type));
      emitChange(next);
    };

    // --- Drag & drop ---
    const onDragStart = (index, event) => {
      draggingIndex.value = index;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", String(index));
    };

    const onDragOver = (index, event) => {
      if (draggingIndex.value === null || draggingIndex.value === index) {
        dragOverIndex.value = null;
        dragPosition.value = null;
        return;
      }
      const rect = event.currentTarget.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      dragOverIndex.value = index;
      dragPosition.value = event.clientY < midpoint ? "before" : "after";
    };

    const onDragLeave = (index) => {
      if (dragOverIndex.value === index) {
        dragOverIndex.value = null;
        dragPosition.value = null;
      }
    };

    const onDrop = (index) => {
      if (draggingIndex.value === null || draggingIndex.value === index) {
        onDragEnd();
        return;
      }
      const next = clone();
      const [moved] = next.splice(draggingIndex.value, 1);

      let targetIndex = index;
      if (draggingIndex.value < index) targetIndex -= 1;
      if (dragPosition.value === "after") targetIndex += 1;

      next.splice(targetIndex, 0, moved);
      emitChange(next);
      onDragEnd();
    };

    const onDragEnd = () => {
      draggingIndex.value = null;
      dragOverIndex.value = null;
      dragPosition.value = null;
    };

    // --- Values / templates ---
    const onNumberInput = (index, field, event) => {
      const value = parseInt(event.target.value, 10);
      const next = clone();
      next[index][field] = Number.isNaN(value) ? null : value;
      emitChange(next);
    };

    const selectedTemplateId = (part) => {
      const elements = part.elements ?? [];
      const template = props.templates.find(
        (item) =>
          (item.elements ?? []).length === elements.length &&
          (item.elements ?? []).every((value, i) => value === elements[i]),
      );
      return template ? template.id : "";
    };

    const onLoadTemplate = (index, templateId) => {
      const template = props.templates.find((item) => item.id === templateId);
      const next = clone();
      next[index].elements = template ? [...(template.elements ?? [])] : [];
      emitChange(next);
    };

    const selectedTemplateLabel = (part) => {
      const id = selectedTemplateId(part);
      if (!id) return null;
      const template = props.templates.find((item) => item.id === id);
      return template ? template.name : null;
    };

    const partTypeLabel = (type) => {
      switch (type) {
        case "n_chars":
          return "NamingConstraint.partTypeNChars";
        case "bounded":
          return "NamingConstraint.partTypeBounded";
        case "values_in":
          return "NamingConstraint.partTypeValuesIn";
        default:
          return "";
      }
    };

    return {
      parts,
      draggingIndex,
      dragOverIndex,
      dragPosition,
      addPart,
      removePart,
      onTypeChange,
      partTypeLabel,
      onDragStart,
      onDragOver,
      onDragLeave,
      onDrop,
      onDragEnd,
      onNumberInput,
      selectedTemplateId,
      onLoadTemplate,
      selectedTemplateLabel,
      goToTemplate,
    };
  },
};
</script>

<style scoped src="./RuleBuilder.css"></style>
