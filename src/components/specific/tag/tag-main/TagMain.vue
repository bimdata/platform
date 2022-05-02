<template>
  <div class="tag-main">
    <div class="tag-main__content">
      <div class="tag-main__content__header">
        <div class="tag-main__content__header__left-side">
          <BIMDataIcon
            name="cursor"
            fill
            color="primary"
            size="s"
            margin="2.5px 0 0 0"
          />
          <span>{{ $t("Tag.title") }}</span>
        </div>
        <div class="tag-main__content__header__right-side">
          <BIMDataButton ghost rounded icon @click="$emit('close')">
            <BIMDataIcon name="close" size="xxs" fill color="granite-light" />
          </BIMDataButton>
        </div>
      </div>
      <div class="tag-main__content__list-add">
        <span>{{ $t("Tag.list") }}</span>
        <BIMDataButton color="primary" radius ghost icon margin="12px">
          <BIMDataIcon
            name="close"
            size="xxxs"
            margin="0 calc(var(--spacing-unit) / 2) 0 var(--spacing-unit)"
            :rotate="45"
          />
          <span>{{ $t("Tag.addTag") }}</span>
        </BIMDataButton>
      </div>
      <div class="tag-main__content__search-bar">
        <BIMDataSearch
          v-model="filter"
          :placeholder="$t('Tag.search')"
          color="primary"
          radius
          width="100%"
          height="calc(var(--spacing-unit) * 2.5)"
        />
      </div>
      <div class="tag-main__content__tag-list">
        <template v-for="(tag, index) of tagList" :key="index">
          <TagList :tag="tag" @update-tag="updatedTagList = $event" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import TagList from "@/components/specific/tag/tag-list/TagList.vue";

export default {
  components: { TagList },

  props: {
    project: {
      type: Object,
      required: true
    },
    document: {
      type: Object,
      required: true
    },
    allTags: {
      type: Array,
      default: () => ["tag1", "tag2", "tag3"]
    }
  },
  emits: ["close"],
  setup(props) {
    const filter = ref("");
    const tagList = ref([]);
    const updatedTagList = ref(null);

    const getTagListUpdated = () => {
      tagList.value = (updatedTagList.value || props.allTags).sort();
    };

    watch(filter, () => getTagListUpdated(), { immediate: true });

    return {
      filter,
      tagList,
      //method
      updatedTagList
    };
  }
};
</script>

<style scoped lang="scss" src="./TagMain.scss"></style>
