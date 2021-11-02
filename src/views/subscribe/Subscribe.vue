<template>
  <div class="view subscribe">
    <ViewHeader>
      <template #left>
        <GoBackButton />
      </template>
      <template #center>
        <h1 class="subscribe__title">
          {{ $t("Subscribe.title") }}
        </h1>
      </template>
    </ViewHeader>
    <div class="subscribe__body">
      <p class="subscribe__body__text">
        {{ $t("Subscribe.text") }}
      </p>
      <div class="subscribe__body__content">
        <FreePlanCard />
        <ProPlanCard />
      </div>
    </div>
  </div>
</template>

<script>
import ViewHeader from "@/components/generic/view-header/ViewHeader.vue";
import GoBackButton from "@/components/specific/app/go-back-button/GoBackButton.vue";
import FreePlanCard from "@/components/specific/subscriptions/free-plan-card/FreePlanCard.vue";
import ProPlanCard from "@/components/specific/subscriptions/pro-plan-card/ProPlanCard.vue";

export default {
  components: {
    FreePlanCard,
    GoBackButton,
    ProPlanCard,
    ViewHeader
  }
};
</script>

<style scoped lang="scss" src="./Subscribe.scss"></style>
