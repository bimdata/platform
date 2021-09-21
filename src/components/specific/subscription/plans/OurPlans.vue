<template>
  <div class="platform-subscription__content__plans">
    <h2>Our plans</h2>
    <div class="flex">
      <BIMDataCard class="p-y-12">
        <template #content>
          <h4>Free</h4>
          <h3 class="text-center">0€ <span>*</span></h3>
          <BIMDataButton color="primary" fill radius>
            Keep this plan
          </BIMDataButton>
          <p class="m-t-24">* Forever</p>
        </template>
      </BIMDataCard>
      <BIMDataCard class="p-y-12" bgColor="primary">
        <template #content>
          <h4>Professional</h4>
          <h3 class="text-center">45€ <span>/ month</span></h3>
          <BIMDataButton color="secondary" fill radius>
            Commencez votre essai
          </BIMDataButton>
          <p class="m-t-24">** expand 1 Gb for 10€ / Month</p>
        </template>
      </BIMDataCard>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="scss" src="./OurPlans.scss"></style>
