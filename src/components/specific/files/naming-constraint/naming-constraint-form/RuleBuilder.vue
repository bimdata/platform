<template>
  <div class="rule-builder">
    <ul class="rule-builder__parts" v-if="parts.length > 0">
      <li
        v-for="(part, index) in parts"
        :key="index"
        class="rule-builder__part"
      >
        <div class="rule-builder__part__grip">
          <span v-for="dot in 6" :key="dot" class="rule-builder__part__dot" />
        </div>

        <div class="rule-builder__part__body">
          <div class="rule-builder__part__row">
            <select
              class="rule-builder__select rule-builder__select--type"
              :value="part.type"
              @change="onTypeChange(index, $event.target.value)"
            >
              <option value="n_chars">
                {{ $t("NamingConstraint.partTypeNChars") }}
              </option>
              <option value="bounded">
                {{ $t("NamingConstraint.partTypeBounded") }}
              </option>
              <option value="values_in">
                {{ $t("NamingConstraint.partTypeValuesIn") }}
              </option>
            </select>

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
              <select
                class="rule-builder__select rule-builder__select--list"
                :value="selectedTemplateId(part)"
                @change="onLoadTemplate(index, $event)"
              >
                <option value="">
                  {{ $t("NamingConstraint.selectListPlaceholder") }}
                </option>
                <option
                  v-for="template in templates"
                  :key="template.id"
                  :value="template.id"
                >
                  {{ template.name }}
                </option>
              </select>
            </template>
          </div>

          <input
            v-if="part.type === 'values_in'"
            class="rule-builder__elements"
            type="text"
            :placeholder="$t('NamingConstraint.elementsHelp')"
            :value="elementsText(part)"
            @input="onElementsInput(index, $event.target.value)"
          />
        </div>

        <div class="rule-builder__part__actions">
          <BIMDataButton
            ghost
            rounded
            icon
            :disabled="index === 0"
            @click="move(index, -1)"
          >
            <BIMDataIconChevron fill color="granite" :rotate="0" size="xxs" />
          </BIMDataButton>
          <BIMDataButton
            ghost
            rounded
            icon
            :disabled="index === parts.length - 1"
            @click="move(index, 1)"
          >
            <BIMDataIconChevron fill color="granite" :rotate="180" size="xxs" />
          </BIMDataButton>
          <BIMDataButton ghost rounded icon @click="removePart(index)">
            <BIMDataIconDelete fill color="high" size="xs" />
          </BIMDataButton>
        </div>
      </li>
    </ul>

    <BIMDataButton
      class="rule-builder__add"
      color="primary"
      ghost
      radius
      @click="addPart"
    >
      <BIMDataIconPlus size="xxxs" margin="0 6px 0 0" />
      {{ $t("NamingConstraint.addPartButton") }}
    </BIMDataButton>
  </div>
</template>

<script>
import { computed } from "vue";

const defaultPart = type => {
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
      default: () => []
    },
    templates: {
      type: Array,
      default: () => []
    }
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const parts = computed(() => props.modelValue ?? []);

    const clone = () => JSON.parse(JSON.stringify(parts.value));

    const emitChange = next => {
      emit("update:modelValue", next);
    };

    const addPart = () => {
      emitChange([...clone(), defaultPart("n_chars")]);
    };

    const removePart = index => {
      const next = clone();
      next.splice(index, 1);
      emitChange(next);
    };

    const onTypeChange = (index, type) => {
      const next = clone();
      next.splice(index, 1, defaultPart(type));
      emitChange(next);
    };

    const move = (index, offset) => {
      const target = index + offset;
      if (target < 0 || target >= parts.value.length) return;
      const next = clone();
      const [part] = next.splice(index, 1);
      next.splice(target, 0, part);
      emitChange(next);
    };

    const elementsText = part => (part.elements ?? []).join(", ");

    const onElementsInput = (index, value) => {
      const next = clone();
      next[index].elements = value
        .split(",")
        .map(element => element.trim())
        .filter(Boolean);
      emitChange(next);
    };

    const onNumberInput = (index, field, event) => {
      const value = parseInt(event.target.value, 10);
      const next = clone();
      next[index][field] = Number.isNaN(value) ? null : value;
      emitChange(next);
    };

    const selectedTemplateId = part => {
      const elements = part.elements ?? [];
      const template = props.templates.find(
        item =>
          (item.elements ?? []).length === elements.length &&
          (item.elements ?? []).every((value, i) => value === elements[i])
      );
      return template ? template.id : "";
    };

    const onLoadTemplate = (index, event) => {
      const templateId = Number(event.target.value);
      const template = props.templates.find(item => item.id === templateId);
      const next = clone();
      next[index].elements = template ? [...(template.elements ?? [])] : [];
      emitChange(next);
    };

    return {
      // References
      parts,
      // Methods
      addPart,
      removePart,
      onTypeChange,
      move,
      elementsText,
      onElementsInput,
      onNumberInput,
      selectedTemplateId,
      onLoadTemplate
    };
  }
};
</script>

<style scoped lang="scss">
.rule-builder {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__parts {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__part {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 10px;
    border-radius: 6px;
    background-color: var(--color-silver-light);

    &__grip {
      display: grid;
      grid-template-columns: repeat(2, 4px);
      gap: 3px;
      margin-top: 8px;
    }

    &__dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: var(--color-granite-light);
    }

    &__body {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 0;
    }

    &__row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &__actions {
      display: flex;
      gap: 2px;
    }
  }

  &__select,
  &__number,
  &__elements {
    height: 32px;
    padding: 0 8px;
    border: 1px solid var(--color-silver);
    border-radius: 4px;
    background-color: var(--color-white);
    color: var(--color-primary);
    font-size: 13px;
  }

  &__select--type {
    flex-shrink: 0;
    min-width: 120px;
  }

  &__select--list {
    flex-grow: 1;
  }

  &__number {
    width: 72px;
  }

  &__dash {
    color: var(--color-granite);
  }

  &__elements {
    width: 100%;
  }

  &__add {
    align-self: flex-start;
  }
}
</style>
