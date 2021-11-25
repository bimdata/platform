<template>
  <div class="file-last-update-cell">
    {{ $d(file.updatedAt, "long") }}
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
