<template>
  <BIMDataCard class="free-plan-card">
    <template #content>
      <FreePlanRedirect v-if="hasFreeSpace" />
      <FreePlanInfo v-else />
    </template>
  </BIMDataCard>
</template>

<script>
// Components
import FreePlanInfo from "./free-plan-info/FreePlanInfo.vue";
import FreePlanRedirect from "./free-plan-redirect/FreePlanRedirect.vue";

export default {
  components: {
    FreePlanInfo,
    FreePlanRedirect
  },
  props: {
    hasFreeSpace: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped lang="scss" src="./FreePlanCard.scss"></style>
