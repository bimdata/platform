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
                      'rule-builder__select__label--placeholder': !selectedPartListLabel(part),
                    }"
                    >{{
                      selectedPartListLabel(part) || $t("NamingConstraint.selectListPlaceholder")
                    }}</span
                  >
                  <BIMDataIconChevron :rotate="isOpen ? 90 : 0" size="xxs" />
                </template>
                <template #element>
                  <template v-if="partLists.length">
                    <ul class="bimdata-list">
                      <li
                        v-for="partList of partLists"
                        :key="partList.id"
                        :class="{
                          'bimdata-list__item--selected': part.value_list_id === partList.id,
                        }"
                        @click="onSelectPartList(index, partList.id)"
                      >
                        <BIMDataTextbox
                          :text="partList.name"
                          cutPosition="middle"
                          tooltipPosition="bottom"
                          tooltipColor="primary"
                        />
                      </li>
                    </ul>
                  </template>
                  <span v-else class="rule-builder__part__value__empty">{{
                    $t("NamingConstraint.noList")
                  }}</span>
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
              @click="goToPartList(index)"
            >
              <BIMDataIconAddList fill color="default" size="xxs" />
            </BIMDataButton>
            <BIMDataButton ghost rounded icon color="high" @click="removePart(index)">
              <BIMDataIconDelete fill size="xs" />
            </BIMDataButton>
          </div>
        </div>
        <div
          v-if="part.type === 'n_chars' || part.type === 'bounded'"
          class="rule-builder__part__description"
        >
          <BIMDataInputOutlined
            :modelValue="part.name"
            :label="true"
            :placeholder="part.name"
            @update:modelValue="onNameInput(index, $event)"
            width="100%"
            margin="0px 0px"
          >
            <template #label>
              {{ $t("NamingConstraint.partNameLabel") }}
            </template>
          </BIMDataInputOutlined>
        </div>
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
      return {
        type: "bounded",
        name: "BOUNDED VALUES",
        default_name: "BOUNDED VALUES",
        min_value: 1,
        max_value: 99,
      };

    case "n_chars":
      return {
        type: "n_chars",
        name: "N CHARS",
        default_name: "N CHARS",
        max_length: 10,
      };

    case "values_in":
    default:
      return {
        type: "values_in",
        name: "",
        default_name: "",
        value_list_id: null,
      };
  }
};

export default {
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
    partLists: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update:modelValue", "go-to-part-list"],
  setup(props, { emit }) {
    const parts = computed(() => props.modelValue ?? []);
    const draggingIndex = ref(null);
    const dragOverIndex = ref(null);
    const dragPosition = ref(null); // 'before' | 'after'

    const clone = () => JSON.parse(JSON.stringify(parts.value));

    const emitChange = (next) => {
      emit("update:modelValue", next);
    };
    const goToPartList = (index) => {
      emit("go-to-part-list", index);
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

    const onNameInput = (index, name) => {
      const next = clone();
      next[index].name = name ?? "";
      emitChange(next);
    };

    const getPartName = (part) => {
      if (part.name?.trim()) {
        return part.name;
      }

      return defaultPart(part.type).name;
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

    // --- Values / part lists ---
    const onNumberInput = (index, field, event) => {
      const value = parseInt(event.target.value, 10);
      const next = clone();
      next[index][field] = Number.isNaN(value) ? null : value;
      emitChange(next);
    };

    const onSelectPartList = (index, partListId) => {
      const partList = props.partLists.find((item) => item.id === partListId);
      const next = clone();

      next[index].value_list_id = partList?.id ?? null;
      next[index].name = partList?.name ?? "";
      next[index].default_name = partList?.name ?? "";
      next[index].elements = partList ? [...(partList.elements ?? [])] : null;

      emitChange(next);
    };

    const selectedPartListLabel = (part) => {
      const partList = props.partLists.find((item) => item.id === part.value_list_id);
      return partList?.name ?? null;
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
      getPartName,
      partTypeLabel,
      onDragStart,
      onDragOver,
      onDragLeave,
      onDrop,
      onDragEnd,
      onNameInput,
      onNumberInput,
      onSelectPartList,
      selectedPartListLabel,
      goToPartList,
    };
  },
};
</script>

<style scoped src="./RuleBuilder.css"></style>
