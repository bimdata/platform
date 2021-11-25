<template>
  <div class="model-last-update-cell">
    {{ $d(model.updatedAt, "long") }}
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
