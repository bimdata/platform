<template>
  <div class="file-last-update-cell">
    {{
      file.updatedAt
        .toISOString()
        .slice(0, -5)
        .replace(/-/g, "/")
        .replace("T", ` ${$t("FileLastUpdateCell.at")} `)
    }}
  </div>
</template>

<script>
export default {
  props: {
    file: {
      type: Object,
      required: true
    }
  }
};
</script>
