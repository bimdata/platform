<template>
  <div data-test="model-viewer" class="view model-viewer">
    <app-slot-content name="app-header-action">
      <span class="model-viewer__header__separator"></span>
      <GoBackButton class="model-viewer__header__btn-back" />
    </app-slot-content>

    <div id="viewer"></div>

    <div class="model-viewer__loader" v-show="loading">
      <BIMDataSpinner />
    </div>
  </div>
</template>

<script>
import makeBIMDataViewer from "@bimdata/viewer";
import { merge, set } from "lodash";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useAuth } from "@/state/auth";
import { useSpaces } from "@/state/spaces";
// Components
import AppSlotContent from "@/components/generic/app-slot/AppSlotContent";
import GoBackButton from "@/components/specific/app/go-back-button/GoBackButton";

import christmasPlugin from '@bimdata/christmas-sleigh-viewer-plugin';

const availablePlugins = {
  bimobject: "https://unpkg.com/@bimdata/bimobject-viewer-plugin@1.0.1",
  iot: "https://unpkg.com/@bimdata/iot-viewer-plugin@1.0.9",
  gltfExtractor:
    "https://unpkg.com/@bimdata/gltf-extractor-viewer-plugin@1.0.2",
  svgExtractor: "https://unpkg.com/@bimdata/svg-extractor-viewer-plugin@1.0.2",
  realiz3D: "https://unpkg.com/@bimdata/realiz3d-viewer-plugin@0.0.2",
  backgroundColor:
    "https://unpkg.com/@bimdata/background-color-viewer-plugin@1.0.1",
  idex: "https://unpkg.com/@bimdata/idex-viewer-plugin@1.0.6"
};

export default {
  components: {
    AppSlotContent,
    GoBackButton
  },
  setup() {
    const route = useRoute();
    const { locale } = useI18n();
    const { accessToken } = useAuth();
    const { currentSpace } = useSpaces();
    const loading = ref(false);

    const apiUrl = process.env.VUE_APP_API_BASE_URL;
    const spaceID = +route.params.spaceID;
    const projectID = +route.params.projectID;
    const modelIDs = route.params.modelIDs.split(",").map(id => +id);
    const initialWindow = route.query.window || "3d";

    // Initial plugins config
    const pluginsConfig = {
      header: {
        warnings: false
      },
      measure3d: true,
      split: true,
      "structure-properties": {
        merge: false,
        export: true,
        editProperties: true
      },
      "viewer2d-background": true
    };

    // Extract space specific plugins config
    // and merges it into initial config
    const spacePluginsConfig = currentSpace.value.features
      .filter(feature => feature.name.startsWith("viewer-bimdata-plugin-"))
      .map(feature => feature.name.split("viewer-bimdata-plugin-")[1])
      .map(config => config.split(":"))
      .reduce((config, [featurePath, state]) => {
        const path = featurePath.split(".");
        set(config, path, state === "true");
        return config;
      }, {});

    merge(pluginsConfig, spacePluginsConfig);

    // Extract space specific plugins urls from deprecated features
    const featurePlugins = currentSpace.value.features
      .filter(feature => feature.name.startsWith("viewer-plugin-"))
      .map(feature => feature.name.split("viewer-plugin-")[1])
      .map(pluginName => availablePlugins[pluginName])
      .filter(Boolean); // keep only existing plugins

    // Extract space specific plugins urls from marketplace
    const appPlugins = currentSpace.value.marketplaceApps
      .filter(app => app.viewerPluginsUrls && app.viewerPluginsUrls.length)
      .map(app => app.viewerPluginsUrls)
      .reduce((set, urls) => {
        urls.forEach(url => set.add(url));
        return set;
      }, new Set());

    const pluginUrls = featurePlugins.concat(Array.from(appPlugins));

    let unwatchAccessToken = () => {};
    let unwatchLocale = () => {};
    onMounted(async () => {
      loading.value = true;
      const bimdataViewer = makeBIMDataViewer({
        api: {
          apiUrl,
          accessToken: accessToken.value,
          cloudId: spaceID,
          projectId: projectID,
          ifcIds: modelIDs
        },
        plugins: pluginsConfig,
        locale: locale.value
      });

      await Promise.all(
        // Webpack annotation is needed to prevent Webpack from using its own
        // import function instead of standard JS import function.
        // (see: https://stackoverflow.com/a/56998596/8298197)
        pluginUrls.map(url =>
          import(/* webpackIgnore: true */ url)
            .then(pluginModule =>
              bimdataViewer.registerPlugin(pluginModule.default)
            )
            .catch(error =>
              console.error(`Error while registering plugin at ${url}: `, error)
            )
        )
      );
      loading.value = false;
      bimdataViewer.registerPlugin(christmasPlugin);

      bimdataViewer.mount("#viewer", initialWindow);

      // Keep viewer access token and locale in sync with application
      unwatchAccessToken = watch(accessToken, token => {
        bimdataViewer.setAccessToken(token);
      });
      unwatchLocale = watch(locale, lang => {
        bimdataViewer.setLocale(lang);
      });
    });

    onBeforeUnmount(() => {
      unwatchAccessToken();
      unwatchLocale();
    });

    return {
      loading
    };
  }
};
</script>

<style lang="scss" src="./ModelViewer.global.scss"></style>
<style scoped lang="scss" src="./ModelViewer.scss"></style>
