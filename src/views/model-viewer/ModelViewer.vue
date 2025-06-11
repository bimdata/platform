<template>
  <div data-test-id="view-model-viewer" class="view model-viewer">
    <AppSlotContent name="app-header-action">
      <span class="model-viewer__header__separator"></span>
      <GoBackButton class="model-viewer__header__btn-back" />
      <span class="model-viewer__header__separator"></span>
      <BIMDataTextbox class="p-x-12" :text="currentProject.name" maxWidth="250px"/>
    </AppSlotContent>

    <div id="viewer"></div>

    <div class="model-viewer__loader" v-show="loading">
      <BIMDataSpinner />
    </div>
  </div>
</template>

<script>
import makeBIMDataViewer from "@bimdata/viewer";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import set from "lodash/set";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import {
  AVAILABLE_PLUGINS,
  DEFAULT_WINDOW,
  PLUGINS_CONFIG
} from "../../config/viewer.js";
import { useAuth } from "../../state/auth.js";
import { useSpaces } from "../../state/spaces.js";
import { useProjects } from "../../state/projects.js";
// Components
import AppSlotContent from "../../components/specific/app/app-slot/AppSlotContent.js";
import GoBackButton from "../../components/specific/app/go-back-button/GoBackButton.vue";

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
    const { currentProject } = useProjects();

    const apiUrl = ENV.VUE_APP_API_BASE_URL;
    const archiveUrl = ENV.VUE_APP_ARCHIVE_BASE_URL;
    const pdfBackendUrl = ENV.VUE_APP_PDF_BACKEND_BASE_URL;
    const spaceID = +route.params.spaceID;
    const projectID = +route.params.projectID;
    const modelIDs =
      (route.params.modelIDs || undefined)?.split(",").map(id => +id) ?? [];
    const initialWindow = route.query.window || DEFAULT_WINDOW;
    const topicGuid = route.query.topicGuid;

    // Initial plugins config
    const pluginsConfig = cloneDeep(PLUGINS_CONFIG);
    if (topicGuid) {
      merge(pluginsConfig, {
        bcfManager: {
          topicGuid
        }
      });
    }

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
      .filter(app => app.viewer_plugins_urls?.length > 0)
      .map(app => app.viewer_plugins_urls)
      .reduce((set, urls) => {
        urls.forEach(url => set.add(url));
        return set;
      }, new Set());

    const pluginUrls = featurePlugins.concat(Array.from(appPlugins));

    let bimdataViewer;
    let unwatchAccessToken = () => {};
    let unwatchLocale = () => {};

    onMounted(async () => {
      loading.value = true;
      bimdataViewer = makeBIMDataViewer({
        api: {
          apiUrl,
          archiveUrl,
          pdfBackendUrl,
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
          import(/* @vite-ignore */ url)
            .then(pluginModule =>
              bimdataViewer.registerPlugin(pluginModule.default)
            )
            .catch(error =>
              console.error(`Error while registering plugin at ${url}: `, error)
            )
        )
      );
      loading.value = false;

      if (topicGuid) {
        bimdataViewer.mount("#viewer", null); // The viewer BCFManager plugin is responsible to open the corresponding topic window/layout
      } else {
        bimdataViewer.mount("#viewer", initialWindow);
      }

      // Keep viewer access token and locale in sync with application
      unwatchAccessToken = watch(accessToken, token => {
        bimdataViewer.setAccessToken(token);
      });
      unwatchLocale = watch(locale, lang => {
        bimdataViewer.setLocale(lang);
      });
    });

    onBeforeUnmount(() => {
      bimdataViewer?.destroy();
      unwatchAccessToken();
      unwatchLocale();
    });

    return {
      loading,
      currentProject,
    };
  }
};
</script>

<style lang="scss" src="./ModelViewer.global.scss"></style>
<style scoped lang="scss" src="./ModelViewer.scss"></style>
