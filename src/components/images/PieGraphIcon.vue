<template>
  <svg
    style="width: 18px; height: 18px"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12.2266"
      cy="12.2281"
      r="9.65632"
      stroke="#D8D8D8"
      stroke-width="5"
    />
    <path
      d="M21.8824 12.2281C21.8824 6.89506 17.5592 2.57178 12.2261 2.57178C11.6725 2.57178 11.1297 2.61837 10.6016 2.70785"
      :stroke="activeColor"
      stroke-width="5"
    />
    <path
      d="M12.2266 21.8843C6.89359 21.8843 2.57031 17.5611 2.57031 12.228C2.57031 7.44861 6.04256 3.4802 10.6021 2.70776"
      class="stroke-primary"
      stroke-width="5"
    />
  </svg>
</template>

<script>
export default {
  props: {
    activeColor: {
      type: String,
      default: "var(--color-secondary)"
    }
  }
};
</script>
