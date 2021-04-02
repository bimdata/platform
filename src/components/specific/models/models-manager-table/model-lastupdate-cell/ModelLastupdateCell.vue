<template>
  <div class="model-lastupdate-cell">
    {{
      model.updatedAt
        .toISOString()
        .slice(0, -5)
        .replace(/-/g, "/")
        .replace("T", ` ${$t("Commons.at")} `)
    }}
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Object,
      required: true
    }
  }
};
</script>
