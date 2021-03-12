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
          :longitude="longitude"
          :latitude="latitude"
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
import { provide, ref, watchEffect } from "vue";
import { useModels } from "@/state/models";
import { DMS2DD, getCoordinatesFromAddress } from "@/utils/coordinate";
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

    const longitude = ref(null);
    const latitude = ref(null);

    watchEffect(async () => {
      loading.value = false;
      showLocationForm.value = false;
      longitude.value = null;
      latitude.value = null;

      if (props.model) {
        loading.value = true;
        const [site] = await fetchModelSites(props.project, props.model);
        if (site && site.attributes) {
          const {
            attributes: { properties }
          } = site;

          // Look for RefLongitude and RefLatitude in site properties
          // and, if found, set longitude/latitude accordingly.
          const refLongitude = (
            properties.find(p => p.definition.name === "RefLongitude") || {}
          ).value;
          const refLatitude = (
            properties.find(p => p.definition.name === "RefLatitude") || {}
          ).value;
          if (refLongitude && refLatitude) {
            longitude.value = DMS2DD(refLongitude);
            latitude.value = DMS2DD(refLatitude);
            loading.value = false;
            return; // Stop here
          }

          // If no RefLongitude and RefLatitude are set, look for SiteAddress
          // in site properties and, if found, retrieve coordinates from this
          // address to set longitude/latitude.
          const siteAddress = (
            properties.find(p => p.definition.name === "SiteAddress") || {}
          ).value;
          if (siteAddress) {
            const coord = await getCoordinatesFromAddress(siteAddress);
            longitude.value = coord.longitude;
            latitude.value = coord.latitude;
            loading.value = false;
            return; // Stop here
          }
        }
        loading.value = false;
      }
    });

    return {
      // References
      latitude,
      loading,
      longitude,
      showLocationForm,
      // Methods
      closeLocationForm,
      openLocationForm
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelLocation.scss"></style>
