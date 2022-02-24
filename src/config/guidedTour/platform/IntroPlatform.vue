<template>
  <div class="specific-component intro-platform">
    <div class="intro-platform__title">
      {{ props.title }}
    </div>
    <span class="intro-platform__content">
      {{ props.content }}
    </span>
    <img src="/static/guidedTour/platform/draw_intro.png" />
  </div>
</template>

<script>
export default {
  props: {
    props: {
      type: Object
    }
  },
  setup() {
    return {
      console
    };
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
