<template>
  <div class="datapack-form">
    <div class="datapack-form__column">
      <div class="datapack-form__card">
        <StorageImage class="color-silver" />
        <div class="datapack-form__base__size">
          {{ formatBytes(baseSize) }}
        </div>
        <div class="datapack-form__base__note">
          {{ $t("DatapackForm.baseNote") }}
        </div>
        <div class="datapack-form__base__text">
          {{ $t("DatapackForm.baseText") }}
        </div>
      </div>
      <ProgressBar :progress="spaceInfo.usedSizePercent">
        <template #text-above-left>
          <span class="primary-font-bold">
            {{ $t("DatapackForm.actualStorage") }}
          </span>
        </template>
        <template #text-below-left>
          <span>
            {{ formatBytes(spaceInfo.smartDataSize) }}
          </span>
        </template>
        <template #text-below-right>
          <span>
            {{ formatBytes(spaceInfo.smartDataSizeAvailable) }}
          </span>
        </template>
      </ProgressBar>
      <BIMDataButton
        class="datapack-form__btn"
        width="200px"
        height="44px"
        fill
        radius
        @click="cancel"
      >
        {{ $t("DatapackForm.cancelButtonText") }}
      </BIMDataButton>
    </div>

    <div class="datapack-form__column">
      <div class="datapack-form__card">
        <StorageImage class="color-primary" />
        <div class="datapack-form__datapack__size">
          {{ formatBytes(datapackSize) }}
        </div>
        <div class="datapack-form__datapack__note">
          {{ $t("DatapackForm.datapackNote") }}
        </div>
        <div class="datapack-form__datapack__total">
          <span class="datapack-form__datapack__total__value">
            {{ totalPrice }}{{ currency }}
          </span>
          <span class="datapack-form__datapack__total__unit">
            {{ $t("DatapackForm.totalUnit") }}
          </span>
        </div>
        <div class="datapack-form__datapack__controls">
          <BIMDataButton
            width="42px"
            height="42px"
            color="primary"
            fill
            square
            icon
            :disabled="quantity === 0"
            @click="decrement"
          >
            <BIMDataIcon name="minus" size="xxxs" />
          </BIMDataButton>
          <BIMDataButton
            width="42px"
            height="42px"
            color="primary"
            fill
            square
            icon
            @click="increment"
          >
            <BIMDataIcon name="plus" size="xxxs" />
          </BIMDataButton>
        </div>
      </div>
      <ProgressBar :progress="totalSizePercent">
        <template #text-above-left>
          <span class="primary-font-bold">
            {{ $t("DatapackForm.newStorage") }}
          </span>
        </template>
        <template #text-below-left>
          <span>
            {{ formatBytes(spaceInfo.smartDataSize) }}
          </span>
        </template>
        <template #text-below-right>
          <span>
            {{ formatBytes(totalSize) }}
          </span>
        </template>
      </ProgressBar>
      <BIMDataButton
        class="datapack-form__btn"
        width="200px"
        height="44px"
        color="primary"
        fill
        radius
        :disabled="quantity === datapack?.quantity"
        @click="submit"
      >
        {{ $t("DatapackForm.submitButtonText") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { computed, inject, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { usePaddle } from "@/composables/paddle.js";
import { PRO_PLAN_STORAGE } from "@/config/subscription.js";
import SIZE_UNIT from "@/config/size-unit.js";
import { useSubscriptions } from "@/state/subscriptions.js";
import { formatBytes } from "@/utils/files.js";
// Components
import ProgressBar from "@/components/generic/progress-bar/ProgressBar.vue";

export default {
  components: {
    ProgressBar
  },
  props: {
    space: {
      type: Object,
      required: true
    },
    spaceInfo: {
      type: Object,
      required: true
    },
    datapack: {
      type: Object,
      default: null
    }
  },
  emits: ["datapack-created", "datapack-updated"],
  setup(props, { emit }) {
    const router = useRouter();
    const { getDatapackPrice } = usePaddle();
    const { createDatapack, updateDatapack } = useSubscriptions();

    const loading = inject("loading", false);

    const quantity = ref(0);

    const baseSize = ref(+PRO_PLAN_STORAGE);
    const datapackSize = computed(() => quantity.value * SIZE_UNIT.GB);
    const totalSize = computed(() => baseSize.value + datapackSize.value);
    const totalSizePercent = computed(() => {
      return Math.round(
        props.spaceInfo.usedSizePercent *
          (props.spaceInfo.smartDataSizeAvailable / totalSize.value)
      );
    });

    const currency = ref("");
    const unitPrice = ref(0);
    const totalPrice = computed(() => quantity.value * unitPrice.value);

    watch(
      () => props.datapack,
      datapack => {
        quantity.value = datapack?.quantity || 0;
      },
      { immediate: true }
    );

    // Get localized datapack price from Paddle
    getDatapackPrice().then(({ price, currency: curr }) => {
      unitPrice.value = price;
      currency.value = curr;
    });

    const decrement = () => {
      if (quantity.value > 0) {
        quantity.value--;
      }
    };
    const increment = () => {
      quantity.value++;
    };

    const submit = async () => {
      try {
        loading.value = true;
        if (props.datapack) {
          await updateDatapack(props.space, props.datapack, quantity.value);
          emit("datapack-updated", {
            quantity: quantity.value,
            size: totalSize.value
          });
        } else {
          await createDatapack(props.space, quantity.value);
          emit("datapack-created", {
            quantity: quantity.value,
            size: totalSize.value
          });
        }
      } finally {
        loading.value = false;
      }
    };

    const cancel = () => {
      router.back();
    };

    return {
      // References
      baseSize,
      currency,
      datapackSize,
      loading,
      quantity,
      totalPrice,
      totalSize,
      totalSizePercent,
      unitPrice,
      // Methods
      cancel,
      decrement,
      formatBytes,
      increment,
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./DatapackForm.scss"></style>
