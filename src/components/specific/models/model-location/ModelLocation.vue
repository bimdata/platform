<template>
  <div class="model-location">
    <transition name="fade" mode="out-in">
      <template v-if="isOpenForm">
        <ModelLocationForm
          class="model-location__form"
          :project="project"
          :model="model"
          :site="site"
          :address="address"
          :longitude="longitude"
          :latitude="latitude"
          @location-updated="onLocationUpdated"
          @close="closeLocationForm"
        />
      </template>

      <template v-else-if="longitude && latitude">
        <div class="model-location__map">
          <MaplibreWrapper :longitude="longitude" :latitude="latitude" />
          <BIMDataButton
            v-if="project.isAdmin"
            class="model-location__map__edit-btn"
            width="36px"
            height="36px"
            fill
            square
            icon
            @click="openLocationForm"
          >
            <BIMDataIconEdit size="s" />
          </BIMDataButton>
        </div>
      </template>

      <template v-else>
        <div class="model-location__empty">
          <BIMDataIconLocation size="xxl" />
          <div>{{ $t("ModelLocation.emptyLocationMessage") }}</div>
          <BIMDataButton
            v-if="project.isAdmin"
            width="100px"
            color="primary"
            fill
            radius
            @click="openLocationForm"
          >
            {{ $t("ModelLocation.addLocationButtonText") }}
          </BIMDataButton>
        </div>
      </template>
    </transition>

    <transition name="fade">
      <div v-show="loading" class="model-location__loader">
        <BIMDataSpinner />
      </div>
    </transition>
  </div>
</template>

<script>
import { onActivated, provide, ref, watch } from "vue";
import { useToggle } from "../../../../composables/toggle.js";
import { useModels } from "../../../../state/models.js";
import {
  DMS2DD,
  getCoordinatesFromAddress
} from "../../../../utils/location.js";
// Components
import MaplibreWrapper from "../../../generic/maplibre-wrapper/MaplibreWrapper.vue";
import ModelLocationForm from "../model-location-form/ModelLocationForm.vue";

export default {
  components: {
    MaplibreWrapper,
    ModelLocationForm
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    model: {
      type: Object
    }
  },
  setup(props) {
    const { fetchModelLocation } = useModels();

    const loading = ref(false);
    provide("loading", loading);

    const {
      isOpen: isOpenForm,
      open: openLocationForm,
      close: closeLocationForm
    } = useToggle();

    const site = ref(null);
    const address = ref("");
    const longitude = ref(0);
    const latitude = ref(0);

    const reset = () => {
      loading.value = false;
      isOpenForm.value = false;
      site.value = null;
      address.value = "";
      longitude.value = 0;
      latitude.value = 0;
    };

    const setLocation = async () => {
      loading.value = true;
      const location = await fetchModelLocation(props.project, props.model);
      site.value = location.site;

      if (location.longitude && location.latitude) {
        // If site coordinates are set,
        // set longitude/latitude accordingly.
        // Also set address if site address is set.
        address.value = location.address || "";
        longitude.value = DMS2DD(location.longitude);
        latitude.value = DMS2DD(location.latitude);
      } else if (location.address) {
        // If site coordinates are not set, check for site address.
        // If site address is set, set address accordingly then
        // retrieve coordinates from this address to set longitude/latitude.
        address.value = location.address;
        const coord = await getCoordinatesFromAddress(location.address);
        longitude.value = coord.longitude;
        latitude.value = coord.latitude;
      }

      loading.value = false;
    };

    const onLocationUpdated = async () => {
      await setLocation();
      closeLocationForm();
    };

    watch(
      () => props.model,
      () => {
        reset();
        if (props.model) setLocation();
      },
      { immediate: true }
    );

    onActivated(() => {
      if (props.model) setLocation();
    });

    return {
      // References
      address,
      latitude,
      loading,
      longitude,
      isOpenForm,
      site,
      // Methods
      closeLocationForm,
      onLocationUpdated,
      openLocationForm,
      setLocation
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelLocation.scss"></style>
