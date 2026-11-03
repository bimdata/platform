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
    const parts = computed(() => {
      if (!props.rule?.parts?.length) {
        return [];
      }

      return props.rule.parts.map((part) => part.name || buildPartExample(part)).filter(Boolean);
    });

    const separator = computed(() => {
      return props.rule?.separator ?? "";
    });

    return {
      parts,
      separator,
    };
  },
};
</script>

<style scoped src="./NamingConstraintPreview.css"></style>
