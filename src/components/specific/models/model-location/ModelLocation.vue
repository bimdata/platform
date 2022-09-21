<template>
  <div class="model-location">
    <transition name="fade" mode="out-in">
      <template v-if="loading">
        <div class="model-location__loader">
          <BIMDataSpinner />
        </div>
      </template>

      <template v-else-if="showLocationForm">
        <ModelLocationForm
          class="model-location__form"
          :project="project"
          :model="model"
          :site="site"
          :address="address"
          :longitude="longitude"
          :latitude="latitude"
          @success="setLocation"
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
            <BIMDataIcon name="edit" size="s" />
          </BIMDataButton>
        </div>
      </template>

      <template v-else>
        <div class="model-location__empty">
          <BIMDataIcon name="location" size="xxl" />
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
  </div>
</template>

<script>
import { onActivated, provide, ref, watch } from "vue";
import { useModels } from "@/state/models.js";
import { DMS2DD, getCoordinatesFromAddress } from "@/utils/location.js";
// Components
import MaplibreWrapper from "@/components/generic/maplibre-wrapper/MaplibreWrapper.vue";
import ModelLocationForm from "@/components/specific/models/model-location-form/ModelLocationForm.vue";

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

    const showLocationForm = ref(false);
    const openLocationForm = () => {
      showLocationForm.value = true;
    };
    const closeLocationForm = () => {
      showLocationForm.value = false;
    };

    const site = ref(null);
    const address = ref("");
    const longitude = ref(0);
    const latitude = ref(0);

    const reset = () => {
      loading.value = false;
      showLocationForm.value = false;
      site.value = null;
      address.value = "";
      longitude.value = 0;
      latitude.value = 0;
    };

    const setLocation = async () => {
      reset();
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
      showLocationForm,
      site,
      // Methods
      closeLocationForm,
      openLocationForm,
      setLocation
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelLocation.scss"></style>
