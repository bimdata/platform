<template>
  <BIMDataCard class="create-bcf-topic flex items-center justify-center">
    <template #content>
      <EmptyBcfTopic />
      <p class="color-primary m-y-24">Créer un nouveau topic BCF</p>
      <BIMDataButton
        width="40px"
        height="40px"
        color="default"
        fill
        radius
        icon
      >
        <BIMDataIcon name="plus" fill color="default" size="m" />
      </BIMDataButton>
    </template>
  </BIMDataCard>
</template>

<script>
import EmptyBcfTopic from "./EmptyBcfTopic.vue";
export default {
  components: {
    EmptyBcfTopic
  }
};
</script>

<style scoped lang="scss" src="./CreateBcfTopicCard.scss"></style>
