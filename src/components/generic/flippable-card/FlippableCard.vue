<template>
  <div class="flippable-card">
    <div class="card" :class="{ flipped }">
      <div class="card__face card__face--front">
        <slot name="front-face"></slot>
      </div>
      <div class="card__face card__face--back">
        <slot name="back-face"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    flipped: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped lang="scss" src="./FlippableCard.scss"></style>
