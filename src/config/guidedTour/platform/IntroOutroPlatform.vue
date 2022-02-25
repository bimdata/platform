<template>
  <div class="specific-component intro-platform">
    <div class="intro-platform__title">
      {{ title }}
    </div>
    <span class="intro-platform__content">
      {{ content }}
    </span>
    <img src="/static/guidedTour/platform/draw_intro.png" />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    },
    content: {
      type: String
    }
  }
};
</script>

<style scoped lang="scss">
.intro-platform {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  gap: 12px;
  padding: 24px;
  &__title {
    font-size: 24px;
  }
}
</style>
