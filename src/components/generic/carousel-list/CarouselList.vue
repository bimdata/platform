<template>
  <div class="carousel-list">
    <BIMDataButton
      v-show="index > 0"
      class="carousel-list__btn-previous"
      color="default"
      fill
      rounded
      icon
      @click="index--"
    >
      <BIMDataIcon name="chevron" size="s" :rotate="180" />
    </BIMDataButton>
    <div class="carousel-list__container">
      <div
        class="carousel-list__container__slider"
        ref="slider"
        :style="{
          transform: `translateX(-${translations[index]}px)`
        }"
      >
        <slot></slot>
      </div>
    </div>
    <BIMDataButton
      v-show="index < maxIndex"
      class="carousel-list__btn-next"
      color="default"
      fill
      rounded
      icon
      @click="index++"
    >
      <BIMDataIcon name="chevron" size="s" />
    </BIMDataButton>
  </div>
</template>

<script>
import { onBeforeUnmount, onMounted, ref } from "vue";

export default {
  props: {
    sliderPadding: {
      type: Number,
      default: 12
    },
    minGap: {
      // Minimum amount of space between items
      type: Number,
      default: 24
    }
  },
  setup(props) {
    const slider = ref(null);

    const index = ref(0);
    const maxIndex = ref(0);
    const translations = ref([]);

    const distributeItems = () => {
      const sliderWidth = slider.value.getBoundingClientRect().width;
      // Compute the actual width that will be available to distribute items
      const contentWidth = sliderWidth - 2 * props.sliderPadding;

      const children = Array.from(slider.value.children);

      if (children.length > 0) {
        // Note: it is assumed that all items have the same dimensions (width/height)
        const { width: itemWidth, height: itemHeight } =
          children[0].getBoundingClientRect();

        // Set slider height according to items height and slider padding
        slider.value.style.height = `${itemHeight + 2 * props.sliderPadding}px`;

        // Calculate the maximum number of items that can be displayed
        // at the same time according to slider width and items width
        // taking minimum gap into account
        let nbDisplayed = Math.max(
          Math.floor(contentWidth / (itemWidth + props.minGap)),
          1 // Display at least 1 item even if slider width is not large enough
        );

        // Calculate the actual gap between items
        let gap = props.minGap;
        if (nbDisplayed > 1) {
          gap = (contentWidth - nbDisplayed * itemWidth) / (nbDisplayed - 1);
        }

        // Compute offsets (translations) and set items styles
        let offset;
        const offsetUnit = itemWidth + gap;
        const offsets = [];
        for (let i = 0; i < children.length; i++) {
          offset = i * offsetUnit;
          offsets.push(offset);
          Object.assign(children[i].style, {
            position: "absolute",
            top: `${props.sliderPadding}px`,
            left: `${props.sliderPadding + offset}px`
          });
        }

        maxIndex.value = children.length - nbDisplayed;
        translations.value = offsets;
      }
    };

    let resizeObserver;
    onMounted(() => {
      distributeItems();
      resizeObserver = new ResizeObserver(() => distributeItems());
      resizeObserver.observe(slider.value);
    });

    onBeforeUnmount(() => {
      resizeObserver.disconnect();
    });

    return {
      // References
      index,
      maxIndex,
      slider,
      translations
    };
  }
};
</script>

<style scoped lang="scss" src="./CarouselList.scss"></style>
