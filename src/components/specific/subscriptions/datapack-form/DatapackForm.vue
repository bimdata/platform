<template>
  <div class="datapack-form">
    <h1 class="datapack-form__title">
      {{ $t("DatapackForm.title") }}
    </h1>
    <div class="datapack-form__text">
      {{ $t("DatapackForm.text") }}
    </div>
    <div class="datapack-form__price">
      <span class="datapack-form__price__label">
        {{ $t("DatapackForm.priceLabel") }}
      </span>
      <span class="datapack-form__price__value">
        {{ unitPrice }}{{ currency }}
      </span>
      <span class="datapack-form__price__unit">
        {{ $t("DatapackForm.priceUnit") }}
      </span>
    </div>
    <div class="datapack-form__control">
      <div class="datapack-form__control__label">
        {{ $t("DatapackForm.controlLabel", { spaceName: space.name }) }}
      </div>
      <div class="datapack-form__control__input">
        <BIMDataButton color="primary" fill square icon @click="decrement">
          <BIMDataIcon name="minus" size="xxxs" />
        </BIMDataButton>
        <span class="datapack-form__control__input__value">
          {{ quantity }}
        </span>
        <BIMDataButton color="primary" fill square icon @click="increment">
          <BIMDataIcon name="plus" size="xxxs" />
        </BIMDataButton>
      </div>
    </div>
    <div class="datapack-form__total">
      <span class="datapack-form__total__label">
        {{ $t("DatapackForm.totalLabel") }}
      </span>
      <span>
        <span class="datapack-form__total__value">
          {{ totalPrice }}{{ currency }}
        </span>
        <span class="datapack-form__total__unit">
          {{ $t("DatapackForm.totalUnit") }}
        </span>
      </span>
    </div>
    <BIMDataButton width="100%" color="primary" fill radius @click="submit">
      {{ $t("DatapackForm.submitButtonText") }}
    </BIMDataButton>
  </div>
</template>

<script>
import { computed, inject, ref, watch } from "vue";
import { usePaddle } from "@/composables/paddle.js";
import { useSubscriptions } from "@/state/subscriptions.js";

export default {
  props: {
    space: {
      type: Object,
      required: true
    },
    subscription: {
      type: Object,
      default: null
    }
  },
  emits: ["quantity-updated", "datapack-created", "datapack-updated"],
  setup(props, { emit }) {
    const { getDatapackPrice } = usePaddle();
    const { createDatapack, updateDatapack } = useSubscriptions();

    const loading = inject("loading", false);

    const datapack = computed(() => props.subscription?.data_packs[0]);

    const quantity = ref(1);
    const unitPrice = ref(0);
    const currency = ref("");
    const totalPrice = computed(() => quantity.value * unitPrice.value);

    watch(
      () => quantity.value,
      () => emit("quantity-updated", quantity.value)
    );

    // Get localized datapack price from Paddle
    getDatapackPrice().then(({ price, currency: curr }) => {
      unitPrice.value = price;
      currency.value = curr;
    });

    const decrement = () => {
      if (quantity.value > 1) {
        quantity.value--;
      }
    };
    const increment = () => {
      quantity.value++;
    };

    const submit = async () => {
      try {
        loading.value = true;
        if (datapack.value) {
          await updateDatapack(
            props.space,
            datapack.value,
            datapack.value.quantity + quantity.value
          );
          emit("datapack-updated");
        } else {
          await createDatapack(props.space, quantity.value);
          emit("datapack-created");
        }
        quantity.value = 1; // Reset quantity value
      } finally {
        loading.value = false;
      }
    };

    return {
      // References
      currency,
      loading,
      quantity,
      totalPrice,
      unitPrice,
      // Methods
      decrement,
      increment,
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./DatapackForm.scss"></style>
