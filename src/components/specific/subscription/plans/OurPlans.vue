<template>
  <div class="platform-subscription__content__plans">
    <h2>{{ $t("OurPlans.ourPlansTitle") }}</h2>
    <div class="flex">
      <BIMDataCard class="p-y-12">
        <template #content>
          <h4>{{ $t("OurPlans.freePlanTitle") }}</h4>
          <h3 class="text-center">
            {{ $t("OurPlans.freePlanPrice") }} <span>*</span>
          </h3>
          <BIMDataButton color="primary" fill radius>
            {{ $t("OurPlans.freePlanTitle") }}
          </BIMDataButton>
          <p class="m-t-24">* {{ $t("OurPlans.freePlanBaseline") }}</p>
        </template>
      </BIMDataCard>
      <BIMDataCard class="p-y-12" bgColor="primary">
        <template #content>
          <h4>{{ $t("OurPlans.professionalPlanTitle") }}</h4>
          <h3 class="text-center">
            45€ <span>{{ $t("OurPlans.professionalPlanPrice") }}</span
            >**
          </h3>
          <BIMDataButton color="secondary" fill radius>
            {{ $t("OurPlans.professionalPlanButton") }}
          </BIMDataButton>
          <p class="m-t-24">** {{ $t("OurPlans.professionalPlanBaseline") }}</p>
        </template>
      </BIMDataCard>
    </div>
  </div>
</template>

<script></script>

<style scoped lang="scss" src="./OurPlans.scss"></style>
