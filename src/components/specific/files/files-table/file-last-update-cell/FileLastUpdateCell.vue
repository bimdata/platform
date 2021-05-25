<template>
  <div class="file-last-update-cell">
    {{
      file.updatedAt
        .toISOString()
        .slice(0, -8)
        .split("T")
        .map((s, i) => {
          if (i === 0) {
            return s.slice(2).split("-").reverse().join("/");
          } else {
            return s.replace(":", "h");
          }
        })
        .join(" - ")
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
