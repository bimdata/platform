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
      <div class="versioning-main__content__list">
        <template
          v-for="(doc, index) of [document, document, document, document]"
          :key="index"
        >
          <VersioningList
            :project="project"
            :document="doc"
            :isFirst="index === 0"
            :isLast="
              index + 1 === [document, document, document, document].length
            "
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import VersioningList from "@/components/specific/versioning/versioning-list/VersioningList.vue";

export default {
  components: { VersioningList },
  props: {
    project: {
      type: Object,
      required: true
    },
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
