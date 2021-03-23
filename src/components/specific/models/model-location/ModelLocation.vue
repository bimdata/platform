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
    const { fetchModelSites } = useModels();

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
      const [modelSite] = await fetchModelSites(props.project, props.model);
      site.value = modelSite;
      if (modelSite && modelSite.attributes) {
        // Extract RefLongitude, RefLatitude and SiteAddress from
        // model site attributes.
        const {
          attributes: { properties }
        } = modelSite;
        const refLongitude = (
          properties.find(p => p.definition.name === "RefLongitude") || {}
        ).value;
        const refLatitude = (
          properties.find(p => p.definition.name === "RefLatitude") || {}
        ).value;
        const siteAddress = (
          properties.find(p => p.definition.name === "SiteAddress") || {}
        ).value;

        // If RefLongitude and RefLatitude are set,
        // set longitude/latitude accordingly.
        if (refLongitude && refLatitude) {
          address.value = siteAddress || ""; // Also set address if SiteAddress is set
          longitude.value = DMS2DD(refLongitude);
          latitude.value = DMS2DD(refLatitude);
          loading.value = false;
          return; // Stop here
        }

        // If RefLongitude and RefLatitude are not set, check for SiteAddress.
        // If SiteAddress is set, set address accordingly then
        // retrieve coordinates from this address to set longitude/latitude.
        if (siteAddress) {
          address.value = siteAddress;
          const coord = await getCoordinatesFromAddress(siteAddress);
          longitude.value = coord.longitude;
          latitude.value = coord.latitude;
          loading.value = false;
          return; // Stop here
        }
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
