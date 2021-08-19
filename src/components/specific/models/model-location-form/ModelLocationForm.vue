<template>
  <div class="model-location-form">
    <MapboxWrapper :longitude="inputLongitude" :latitude="inputLatitude" />
    <div class="model-location-form__form-control">
      <AddressInput
        class="model-location-form__form-control__input"
        :placeholder="$t('ModelLocationForm.addressInputPlaceholder')"
        :loading="checkLoading"
        :disabled="isSubmitStep"
        v-model="inputAddress"
        @address-selected="checkAddress"
      />

      <template v-if="!isSubmitStep">
        <BIMDataButton color="primary" fill radius @click="checkAddress">
          {{ $t("ModelLocationForm.checkButtonText") }}
        </BIMDataButton>
      </template>
      <template v-else>
        <BIMDataButton color="primary" fill radius @click="submitAddress">
          {{ $t("ModelLocationForm.submitButtonText") }}
        </BIMDataButton>
        <BIMDataButton color="default" outline radius @click="cancel">
          {{ $t("ModelLocationForm.cancelButtonText") }}
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
import { inject, ref, watch } from "vue";
import { useErrors } from "@/composables/errors";
import { useModels } from "@/state/models";
import { DD2DMS, getCoordinatesFromAddress } from "@/utils/location";
// Components
import AddressInput from "@/components/generic/address-input/AddressInput";
import MapboxWrapper from "@/components/generic/mapbox-wrapper/MapboxWrapper";

export default {
  components: {
    AddressInput,
    MapboxWrapper
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    model: {
      type: Object,
      required: true
    },
    site: {
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
  emits: ["close", "success"],
  setup(props, { emit }) {
    const { handleError, MODEL_UPDATE_ERROR } = useErrors();
    const { createModelLocation, updateModelLocation } = useModels();

    const isSubmitStep = ref(false);
    const checkLoading = ref(false);
    const submitLoading = inject("loading", false);

    const inputAddress = ref("");
    const inputLongitude = ref(0);
    const inputLatitude = ref(0);

    const checkAddress = async () => {
      if (inputAddress.value) {
        checkLoading.value = true;
        const coord = await getCoordinatesFromAddress(inputAddress.value);
        checkLoading.value = false;
        if (coord.longitude && coord.latitude) {
          inputLongitude.value = coord.longitude;
          inputLatitude.value = coord.latitude;
          isSubmitStep.value = true;
        }
      }
    };

    const submitAddress = async () => {
      const location = {
        site: props.site,
        address: inputAddress.value,
        longitude: DD2DMS(inputLongitude.value),
        latitude: DD2DMS(inputLatitude.value)
      };
      try {
        submitLoading.value = true;
        if (props.site) {
          await updateModelLocation(props.project, props.model, location);
        } else {
          await createModelLocation(props.project, props.model, location);
        }
        emit("success");
      } catch (error) {
        handleError(MODEL_UPDATE_ERROR, error);
      } finally {
        submitLoading.value = false;
      }
    };

    const cancel = () => {
      isSubmitStep.value = false;
    };
    const close = () => {
      inputAddress.value = "";
      isSubmitStep.value = false;
      emit("close");
    };

    watch(
      [() => props.address, () => props.longitude, () => props.latitude],
      () => {
        if (props.address) {
          inputAddress.value = props.address;
          checkAddress();
        } else if (props.longitude && props.latitude) {
          inputLongitude.value = props.longitude;
          inputLatitude.value = props.latitude;
        }
      },
      { immediate: true }
    );

    return {
      // References
      checkLoading,
      inputAddress,
      inputLatitude,
      inputLongitude,
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
