<template>
  <div class="versioning-main">
    <div class="versioning-main__content">
      <div class="versioning-main__content__header">
        <div class="versioning-main__content__header__left-side">
          <BIMDataIcon
            name="folder"
            fill
            color="primary"
            size="s"
            margin="2.5px 0 0 0"
          />
          <span>{{ $t("Versioning.title") }}</span>
        </div>
        <div class="versioning-main__content__header__right-side">
          <BIMDataButton ghost rounded icon @click="$emit('close')">
            <BIMDataIcon name="close" size="xxs" fill color="granite-light" />
          </BIMDataButton>
        </div>
      </div>
      <div class="versioning-main__content__add-version">
        <BIMDataButton
          color="primary"
          fill
          radius
          width="100%"
          @click="console.log('clicked')"
        >
          <BIMDataIcon
            name="close"
            size="xxxs"
            :rotate="45"
            margin="1px 12px 0 0"
          />
          {{ $t("Versioning.addVersion") }}
        </BIMDataButton>
      </div>
      <div class="versioning-main__content__version">
        <VersioningList :document="document" />
      </div>
    </div>
  </div>
</template>

<script>
import VersioningList from "@/components/specific/versioning/versioning-list/VersioningList.vue";

export default {
  components: { VersioningList },
  props: {
    document: {
      type: Object,
      required: true
    }
  },
  emits: ["close"],

  setup() {}
};
</script>

<style scoped lang="scss" src="./VersioningMain.scss"></style>
