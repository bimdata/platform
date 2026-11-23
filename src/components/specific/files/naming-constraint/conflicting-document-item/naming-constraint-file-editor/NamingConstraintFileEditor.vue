<template>
  <div class="naming-constraint-file-editor">
    <div
      v-for="(part, index) in rule.parts"
      :key="index"
      class="naming-constraint-file-editor__field"
    >
      <label>
        {{ part.name }}
      </label>

      <BIMDataSelect
        v-if="part.type === PART_TYPES.VALUES_IN"
        :modelValue="segments[index]"
        :options="part.elements"
        @update:modelValue="updateSegment(index, $event)"
      />

      <div v-else-if="part.type === PART_TYPES.BOUNDED">
        <BIMDataInput
          type="number"
          :modelValue="segments[index]"
          @update:modelValue="updateBounded(index, $event, part)"
          :error="!!getFieldError(segments[index], part)"
          :errorMessage="getFieldError(segments[index], part)"
        />
        <span class="naming-constraint-file-editor__field__placeholder">
          {{ $t("NamingConstraint.maxCharsHint", { count: part.max_value }) }}
        </span>
      </div>

      <div v-else>
        <BIMDataInput
          :maxlength="part.max_length"
          :modelValue="segments[index]"
          @update:modelValue="updateSegment(index, $event.slice(0, part.max_length))"
          :error="!!getFieldError(segments[index], part)"
          :errorMessage="getFieldError(segments[index], part)"
        />
        <span class="naming-constraint-file-editor__field__placeholder">
          {{ $t("NamingConstraint.maxCharsHint", { count: part.max_length }) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { PART_TYPES, splitName, buildName } from "../../../../../../utils/naming-constraint.js";

export default {
  emits: ["update", "change", "error-change"],
  props: {
    rule: {
      type: Object,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n();

    const segments = ref([]);
    const extension = ref("");

    const initSegments = () => {
      const result = splitName(props.filename, props.rule);

      extension.value = result.extension;

      segments.value = props.rule.parts.map((part, index) => {
        if (result.values[index] !== undefined) {
          return result.values[index];
        }

        if (part.type === PART_TYPES.VALUES_IN) {
          return part.elements?.[0] ?? "";
        }

        if (part.type === PART_TYPES.BOUNDED) {
          return part.min_value ?? "";
        }

        if (part.type === PART_TYPES.N_CHARS) {
          return "?";
        }

        return "";
      });
    };

    initSegments();

    watch(
      () => props.filename,
      (name) => {
        const result = splitName(name, props.rule);

        extension.value = result.extension;
        segments.value = [...result.values];
      },
    );

    const generatedName = computed(() => buildName(segments.value, props.rule, extension.value));

    watch(
      generatedName,
      (value) => {
        emit("change", value);
      },
      { immediate: true },
    );

    const onBoundedInput = (index, value, part) => {
      if (value === "") {
        segments.value[index] = "";
        return;
      }

      let number = Number(value);

      if (Number.isNaN(number)) {
        number = part.min_value;
      }

      number = Math.max(part.min_value, number);
      number = Math.min(part.max_value, number);

      segments.value[index] = number;
    };

    const updateSegment = (index, value) => {
      segments.value[index] = value;
    };

    const updateBounded = (index, value, part) => {
      if (value === "") {
        segments.value[index] = "";
        return;
      }

      let number = Number(value);

      if (Number.isNaN(number)) {
        number = part.min_value;
      }

      number = Math.max(part.min_value, number);
      number = Math.min(part.max_value, number);

      segments.value[index] = number;
    };

    /**
     * Error message of an editable field, or "" when the field is valid.
     *
     * - bounded and n_chars fields are required
     * - a free-text (n_chars) segment cannot contain the rule separator,
     *   otherwise the generated name would never match the rule
     */
    const getFieldError = (value, part) => {
      const segment = String(value ?? "");

      if (part.type !== PART_TYPES.BOUNDED && part.type !== PART_TYPES.N_CHARS) {
        return "";
      }

      if (segment.trim() === "") {
        return t("NamingConstraint.requiredFieldError");
      }

      if (part.type === PART_TYPES.BOUNDED) {
        return "";
      }

      const separator = props.rule.separator;

      if (separator && segment.includes(separator)) {
        return t("NamingConstraint.separatorErrorMessage", { separator });
      }

      if (segment.length > part.max_length) {
        return t("NamingConstraint.errorMessage");
      }

      return "";
    };

    const hasError = computed(() =>
      props.rule.parts.some((part, index) => !!getFieldError(segments.value[index], part)),
    );

    watch(
      hasError,
      (value) => {
        emit("error-change", value);
      },
      { immediate: true },
    );

    return {
      segments,
      PART_TYPES,
      getFieldError,
      updateSegment,
      updateBounded,
    };
  },
};
</script>

<style scoped src="./NamingConstraintFileEditor.css"></style>
