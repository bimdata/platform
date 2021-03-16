<template>
  <div class="model-location-form">
    <MapboxWrapper
      :longitude="coordinates.longitude"
      :latitude="coordinates.latitude"
    />
    <div class="model-location-form__form-control">
      <AddressInput
        class="model-location-form__form-control__input"
        :placeholder="$t('ModelLocationForm.inputAddress')"
        :loading="checkLoading"
        :disabled="isSubmitStep"
        v-model="inputAddress"
        @address-selected="checkAddress"
      />
      <template v-if="!isSubmitStep">
        <BIMDataButton color="primary" fill radius @click="checkAddress">
          {{ $t("ModelLocationForm.buttonCheck") }}
        </BIMDataButton>
      </template>
      <template v-else>
        <BIMDataButton color="primary" fill radius @click="submitAddress">
          {{ $t("ModelLocationForm.buttonSubmit") }}
        </BIMDataButton>
        <BIMDataButton color="default" outline radius @click="cancel">
          {{ $t("ModelLocationForm.buttonCancel") }}
        </BIMDataButton>
      </template>
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
import AddressInput from "@/components/generic/address-input/AddressInput";
import MapboxWrapper from "@/components/generic/mapbox-wrapper/MapboxWrapper";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    AddressInput,
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
    address: {
      type: String,
      default: ""
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
    const isSubmitStep = ref(false);
    const checkLoading = ref(false);
    const submitLoading = inject("loading", false);

    const inputAddress = ref("");
    const coordinates = reactive({
      longitude: 0,
      latitude: 0
    });
    watchEffect(() => {
      if (props.address) {
        inputAddress.value = props.address;
        checkAddress();
      } else if (props.longitude && props.latitude) {
        coordinates.longitude = props.longitude;
        coordinates.latitude = props.latitude;
      }
    });

    const checkAddress = async () => {
      if (inputAddress.value) {
        checkLoading.value = true;
        const coord = await getCoordinatesFromAddress(inputAddress.value);
        checkLoading.value = false;
        if (coord.longitude && coord.latitude) {
          coordinates.longitude = coord.longitude;
          coordinates.latitude = coord.latitude;
          isSubmitStep.value = true;
        }
      }
    };
    const submitAddress = () => {
      submitLoading.value = true;
      // TODO: set IFC site properties
      console.log("Address: ", inputAddress.value);
      console.log("Longitude: ", coordinates.longitude);
      console.log("Latitude: ", coordinates.latitude);
      submitLoading.value = false;
    };

    const cancel = () => {
      isSubmitStep.value = false;
    };
    const close = () => {
      inputAddress.value = "";
      isSubmitStep.value = false;
      emit("close");
    };

    return {
      // References
      inputAddress,
      checkLoading,
      coordinates,
      isSubmitStep,
      // Methods
      cancel,
      checkAddress,
      close,
      submitAddress
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelLocationForm.scss"></style>
