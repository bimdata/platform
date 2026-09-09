<template>
  <div v-if="parts.length" class="naming-constraint-preview">
    <template v-for="(part, index) in parts" :key="index">
      <span class="naming-constraint-preview__chip">
        {{ part }}
      </span>

      <span v-if="index < parts.length - 1" class="naming-constraint-preview__separator">
        {{ separator }}
      </span>
    </template>

    <span class="naming-constraint-preview__extension"> .ext </span>
  </div>
</template>

<script>
import { computed } from "vue";
import { buildPartExample } from "../../../../../utils/naming-constraint.js";

export default {
  props: {
    rule: {
      type: Object,
      default: null,
    },
  },

  setup(props) {
    const normalizedRule = computed(() => {
      if (!props.rule) {
        return null;
      }

      // Accepte :
      // { separator, parts }
      // ou :
      // { name, strict, rule: { separator, parts } }

      return props.rule.rule ?? props.rule;
    });

    const parts = computed(() => {
      const rule = normalizedRule.value;

      if (!rule?.parts?.length) {
        return [];
      }

      return rule.parts.map((part) => part.name || buildPartExample(part)).filter(Boolean);
    });

    const separator = computed(() => {
      return normalizedRule.value?.separator ?? "";
    });

    return {
      parts,
      separator,
    };
  },
};
</script>

<style scoped src="./NamingConstraintPreview.css"></style>
