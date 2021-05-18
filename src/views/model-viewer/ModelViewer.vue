<template>
  <div data-test="model-viewer" class="view model-viewer">
    <div id="viewer"></div>
  </div>
</template>

<script>
import { merge, set } from "lodash";
import { onMounted, onUnmounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import makeBIMDataViewer from "@bimdata/viewer";
import { useAuth } from "@/state/auth";
import { useSpaces } from "@/state/spaces";

const availablePlugins = {
  bimobject: "https://unpkg.com/@bimdata/bimobject-viewer-plugin@1.0.0",
  iot: "https://unpkg.com/@bimdata/iot-viewer-plugin@1.0.7",
  gltfExtractor:
    "https://unpkg.com/@bimdata/gltf-extractor-viewer-plugin@1.0.0",
  svgExtractor: "https://unpkg.com/@bimdata/svg-extractor-viewer-plugin@1.0.0",
  realiz3D: "https://unpkg.com/@bimdata/realiz3d-viewer-plugin@0.0.2",
  backgroundColor:
    "https://unpkg.com/@bimdata/background-color-viewer-plugin@1.0.0",
  idex: "https://unpkg.com/@bimdata/idex-viewer-plugin@1.0.6"
};

export default {
  setup() {
    const route = useRoute();
    const { locale } = useI18n();
    const { accessToken } = useAuth();
    const { currentSpace } = useSpaces();

    const apiUrl = process.env.VUE_APP_API_BASE_URL;
    const spaceID = +route.params.spaceID;
    const projectID = +route.params.projectID;
    const modelIDs = route.params.modelIDs.split(",").map(id => +id);
    const window = route.query.window || "3d";

    // Initial plugins config
    const pluginsConfig = {
      header: {
        warnings: false
      },
      split: true,
      "structure-properties": {
        merge: true,
        export: true,
        editProperties: true
      }
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

    // Extract space specific plugins urls
    const pluginUrls = currentSpace.value.features
      .filter(feature => feature.name.startsWith("viewer-plugin-"))
      .map(feature => feature.name.split("viewer-plugin-")[1])
      .map(pluginName => availablePlugins[pluginName])
      .filter(Boolean); // keep only existing plugins

    let unwatchAccessToken;
    let unwatchLocale;

    onMounted(async () => {
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

      const loadedPlugins = await Promise.all(
        // Webpack annotation is needed to prevent Webpack from using its own
        // import function instead of standard JS import function.
        // (see: https://stackoverflow.com/a/56998596/8298197)
        pluginUrls.map(url => import(/* webpackIgnore: true */ url))
      );
      loadedPlugins.forEach(pluginModule => {
        bimdataViewer.registerPlugin(pluginModule.default);
      });

      const viewer = bimdataViewer.mount("#viewer", window);

      unwatchAccessToken = watch(accessToken, token => {
        viewer.setAccessToken(token);
      });
      unwatchLocale = watch(locale, lang => {
        viewer.$i18n.locale = lang;
      });
    });

    onUnmounted(() => {
      unwatchAccessToken();
      unwatchLocale();
    });
  }
};
</script>

<style scoped lang="scss" src="./ModelViewer.scss"></style>
