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
        />
        <span class="naming-constraint-file-editor__field__placeholder">
          {{ `Maximum ${part.max_value} caractères` }}
        </span>
      </div>

      <div v-else>
        <BIMDataInput
          :maxlength="part.max_length"
          :modelValue="segments[index]"
          @update:modelValue="updateSegment(index, $event.slice(0, part.max_length))"
        />
        <span class="naming-constraint-file-editor__field__placeholder">
          {{ `Maximum ${part.max_length} caractères` }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { PART_TYPES, splitName, buildName } from "../../../../../../utils/naming-constraint.js";

export default {
  emits: ["update", "change"],
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
    const { values, extension } = splitName(props.filename, props.rule);

    const segments = ref([]);

    const initSegments = () => {
      const { values } = splitName(props.filename, props.rule);

      segments.value = props.rule.parts.map((part, index) => {
        if (part.type === PART_TYPES.VALUES_IN) {
          return part.elements?.[0] ?? "";
        }

        if (part.type === PART_TYPES.BOUNDED) {
          return part.min_value ?? "";
        }

        if (part.type === PART_TYPES.N_CHARS) {
          return "";
        }

        return "";
      });
    };

    initSegments();

    watch(
      () => props.filename,
      (name) => {
        const result = splitName(name, props.rule);

        segments.value = [...result.values];
      },
    );

    const generatedName = computed(() => buildName(segments.value, props.rule, extension));

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

    return {
      segments,
      PART_TYPES,
      updateSegment,
      updateBounded,
    };
  },
};
</script>

<style scoped src="./NamingConstraintFileEditor.css"></style>
