<template>
  <div class="datapack-sub-form">
    <h1 class="datapack-sub-form__title">
      {{ $t("DatapackSubForm.title") }}
    </h1>
    <div class="datapack-sub-form__text">
      {{ $t("DatapackSubForm.text") }}
    </div>
    <div class="datapack-sub-form__price">
      <span class="datapack-sub-form__price__label">
        {{ $t("DatapackSubForm.priceLabel") }}
      </span>
      <span class="datapack-sub-form__price__value">
        {{ unitPrice }}{{ currency }}
      </span>
      <span class="datapack-sub-form__price__unit">
        {{ $t("DatapackSubForm.priceUnit") }}
      </span>
    </div>
    <div class="datapack-sub-form__control">
      <div class="datapack-sub-form__control__label">
        {{ $t("DatapackSubForm.controlLabel", { spaceName: space.name }) }}
      </div>
      <div class="datapack-sub-form__control__input">
        <BIMDataButton color="primary" fill square icon @click="decrement">
          <BIMDataIcon name="minus" size="xxxs" />
        </BIMDataButton>
        <span class="datapack-sub-form__control__input__value">
          {{ quantity }}
        </span>
        <BIMDataButton color="primary" fill square icon @click="increment">
          <BIMDataIcon name="plus" size="xxxs" />
        </BIMDataButton>
      </div>
    </div>
    <div class="datapack-sub-form__total">
      <span class="datapack-sub-form__total__label">
        {{ $t("DatapackSubForm.totalLabel") }}
      </span>
      <span>
        <span class="datapack-sub-form__total__value">
          {{ totalPrice }}{{ currency }}
        </span>
        <span class="datapack-sub-form__total__unit">
          {{ $t("DatapackSubForm.totalUnit") }}
        </span>
      </span>
    </div>
    <BIMDataButton width="100%" color="primary" fill radius @click="submit">
      {{ $t("DatapackSubForm.submitButtonText") }}
    </BIMDataButton>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useSubscriptions } from "@/state/subscriptions.js";
import { getPrice } from "@/utils/price.js";

export default {
  props: {
    space: {
      type: Object,
      required: true
    }
  },
  emits: ["quantity-updated", "datapack-created"],
  setup(props, { emit }) {
    const { createDatapackSubscription } = useSubscriptions();

    const loading = ref(false);
    const quantity = ref(1);
    const unitPrice = ref(0);
    const currency = ref("");
    const totalPrice = computed(() => quantity.value * unitPrice.value);

    // Get localized datapack price from Paddle
    Paddle.Product.Prices(12405, response => {
      const { price, currency: curr } = getPrice(response);
      unitPrice.value = price;
      currency.value = curr;
    });

    const decrement = () => {
      if (quantity.value > 1) {
        quantity.value--;
        emit("quantity-updated", quantity.value);
      }
    };
    const increment = () => {
      quantity.value++;
      emit("quantity-updated", quantity.value);
    };

    const submit = async () => {
      try {
        loading.value = true;
        await createDatapackSubscription(props.space, quantity.value);
        emit("datapack-created");
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

<style scoped lang="scss" src="./DatapackSubForm.scss"></style>
