<template>
  <div class="model-location-form">
    <MapboxWrapper
      :longitude="coordinates.longitude"
      :latitude="coordinates.latitude"
    />
    <div class="model-location-form__form-control">
      <BIMDataInput
        class="model-location-form__form-control__input"
        :placeholder="$t('ModelLocationForm.inputAddress')"
        v-model="address"
        @keyup.enter.stop="checkAddress"
        :loading="checkLoading"
      />
      <BIMDataButton color="primary" fill radius @click="checkAddress">
        {{ $t("ModelLocationForm.buttonValidate") }}
      </BIMDataButton>
      <BIMDataButton
        class="model-location-form__form-control__close-btn"
        ghost
        rounded
        icon
        @click="close"
      >
        <BIMDataIcon name="close" size="xs" />
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { inject, reactive, ref, watchEffect } from "vue";
import { getCoordinatesFromAddress } from "@/utils/coordinate";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataInput from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataInput.js";
import MapboxWrapper from "@/components/generic/mapbox-wrapper/MapboxWrapper";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataInput,
    MapboxWrapper
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    model: {
      type: Object
    },
    longitude: {
      type: Number,
      default: 0
    },
    latitude: {
      type: Number,
      default: 0
    }
  },
  emits: ["close"],
  setup(props, { emit }) {
    const checkLoading = ref(false);
    const submitLoading = inject("loading", false);

    const coordinates = reactive({
      longitude: 0,
      latitude: 0
    });
    watchEffect(() => {
      coordinates.longitude = props.longitude;
      coordinates.latitude = props.latitude;
    });

    const address = ref("");
    const checkAddress = async () => {
      if (address.value) {
        checkLoading.value = true;
        const coord = await getCoordinatesFromAddress(address.value);
        coordinates.longitude = coord.longitude;
        coordinates.latitude = coord.latitude;
        checkLoading.value = false;
      }
    };
    const submitAddress = () => {
      // TODO
    };

    const close = () => {
      address.value = "";
      emit("close");
    };

    return {
      // References
      address,
      checkLoading,
      coordinates,
      // Methods
      checkAddress,
      close
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelLocationForm.scss"></style>
