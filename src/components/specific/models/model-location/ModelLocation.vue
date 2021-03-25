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
          <MapboxWrapper :longitude="longitude" :latitude="latitude" />
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
          <div>{{ $t("ModelLocation.noLocationMessage") }}</div>
          <BIMDataButton
            v-if="project.isAdmin"
            color="primary"
            fill
            radius
            @click="openLocationForm"
          >
            {{ $t("ModelLocation.buttonAddLocation") }}
          </BIMDataButton>
        </div>
      </template>
    </transition>
  </div>
</template>

<script>
import { provide, ref, watch } from "vue";
import { useModels } from "@/state/models";
import { DMS2DD, getCoordinatesFromAddress } from "@/utils/location";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataSpinner from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSpinner.js";
import MapboxWrapper from "@/components/generic/mapbox-wrapper/MapboxWrapper";
import ModelLocationForm from "@/components/specific/models/model-location-form/ModelLocationForm";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataSpinner,
    MapboxWrapper,
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
    const { fetchModelSite } = useModels();

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
      const modelSite = await fetchModelSite(props.project, props.model);
      site.value = modelSite.site;

      if (modelSite.longitude && modelSite.latitude) {
        // If site coordinates are set,
        // set longitude/latitude accordingly.
        // Also set address if site address is set.
        address.value = modelSite.address || "";
        longitude.value = DMS2DD(modelSite.longitude);
        latitude.value = DMS2DD(modelSite.latitude);
      } else if (modelSite.address) {
        // If site coordinates are not set, check for site address.
        // If site address is set, set address accordingly then
        // retrieve coordinates from this address to set longitude/latitude.
        address.value = modelSite.address;
        const coord = await getCoordinatesFromAddress(modelSite.address);
        longitude.value = coord.longitude;
        latitude.value = coord.latitude;
      }

      loading.value = false;
    };

    watch(
      () => props.model,
      () => {
        reset();
        if (props.model) {
          setLocation();
        }
      },
      { immediate: true }
    );

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
