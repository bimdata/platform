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
import { set } from "lodash";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import {
  AVAILABLE_PLUGINS,
  DEFAULT_WINDOW,
  PLUGINS_CONFIG
} from "@/config/viewer.js";
import { useAuth } from "@/state/auth.js";
import { useSpaces } from "@/state/spaces.js";
// Components
import AppSlotContent from "@/components/specific/app/app-slot/AppSlotContent.vue";
import GoBackButton from "@/components/specific/app/go-back-button/GoBackButton.vue";

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
    const initialWindow = route.query.window || DEFAULT_WINDOW;
    const topicGuid = route.query.topicGuid;

    // Initial plugins config
    const pluginsConfig = PLUGINS_CONFIG;
    Object.assign(pluginsConfig, {
      bcf: {
        topicGuid
      }
    });

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

    Object.assign(pluginsConfig, spacePluginsConfig);

    // Extract space specific plugins urls from deprecated features
    const featurePlugins = currentSpace.value.features
      .filter(feature => feature.name.startsWith("viewer-plugin-"))
      .map(feature => feature.name.split("viewer-plugin-")[1])
      .map(pluginName => AVAILABLE_PLUGINS[pluginName])
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
          modelIds: modelIDs
        },
        plugins: pluginsConfig,
        locale: locale.value,
        ui: {
          version: false,
          bimdataLogo: false
        }
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
