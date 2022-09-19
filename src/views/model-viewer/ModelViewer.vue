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
import { set, merge, cloneDeep } from "lodash";
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

    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const spaceID = +route.params.spaceID;
    const projectID = +route.params.projectID;
    const modelIDs = route.params.modelIDs.split(",").map(id => +id);
    const initialWindow = route.query.window || DEFAULT_WINDOW;
    const topicGuid = route.query.topicGuid;

    // Initial plugins config
    const pluginsConfig = cloneDeep(PLUGINS_CONFIG);
    merge(pluginsConfig, {
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
    const appPlugins = currentSpace.value.marketplace_apps
      .filter(app => app.viewer_plugins_urls && app.viewer_plugins_urls.length)
      .map(app => app.viewer_plugins_urls)
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
        locale: locale.value
      });

      await Promise.all(
        pluginUrls.map(url =>
          import(url)
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
