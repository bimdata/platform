<template>
  <div class="favorite-badge">&starf;</div>
</template>

<style scoped>
.favorite-badge {
  width: 22px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: end;
  font-size: 1.25rem;
  background-color: var(--color-secondary);
  color: var(--color-white);

  &::after {
    content: "";
    position: absolute;
    bottom: -22px;
    left: 0;
    border-style: solid;
    border-width: 11px;
    border-color: var(--color-secondary) transparent transparent;
  }
}
</style>
