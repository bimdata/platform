<template>
  <div class="model-location-form">
    <MaplibreWrapper
      containerID="model-location-form"
      :longitude="inputLongitude"
      :latitude="inputLatitude"
    />
    <div class="model-location-form__form-control" :class="{ submit: isSubmitStep }">
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
          {{ $t("t.verify") }}
        </BIMDataButton>
      </template>
      <template v-else>
        <div style="position: relative">
          <BIMDataCheckbox
            v-show="isSubmitStep"
            class="model-location-form__form-control__checkbox"
            v-model="applyToAllModels"
            :text="$t('ModelLocationForm.applyToAllModels')"
          />
          <BIMDataButton color="primary" fill radius @click="submitAddress">
            {{ $t("t.validate") }}
          </BIMDataButton>
        </div>
        <BIMDataButton color="default" outline radius @click="changeAddress">
          {{ $t("t.change") }}
        </BIMDataButton>
      </template>

      <BIMDataButton
        class="model-location-form__form-control__close-btn"
        ghost
        rounded
        icon
        @click="close"
      >
        <BIMDataIconClose size="xs" />
      </BIMDataButton>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, watch } from "vue";
import { useModels } from "../../../../state/models.js";
import {
  DD2DMS,
  getCoordinatesFromAddress
} from "../../../../utils/location.js";
// Components
import AddressInput from "../../../generic/address-input/AddressInput.vue";
import MaplibreWrapper from "../../../generic/maplibre-wrapper/MaplibreWrapper.vue";

const props = defineProps({
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
});

const emit = defineEmits(["close", "location-updated"]);

const { createModelLocation, updateModelLocation, updateProjectModelsLocation } = useModels();

const isSubmitStep = ref(false);
const checkLoading = ref(false);
const submitLoading = inject("loading", false);

const inputAddress = ref("");
const inputLongitude = ref(0);
const inputLatitude = ref(0);
const applyToAllModels = ref(false);

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
  const [latDMS, longDMS] = DD2DMS(inputLatitude.value, inputLongitude.value)

  const location = {
    site: props.site,
    address: inputAddress.value,
    longitude: longDMS,
    latitude: latDMS
  };

  try {
    submitLoading.value = true;
    if (applyToAllModels.value) {
      await updateProjectModelsLocation(props.project, location);
    } else if (props.site) {
      await updateModelLocation(props.project, props.model, location);
    } else {
      await createModelLocation(props.project, props.model, location);
    }
    emit("location-updated");
  } finally {
    submitLoading.value = false;
  }
};

const changeAddress = () => {
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
</script>

<style scoped src="./ModelLocationForm.css"></style>
