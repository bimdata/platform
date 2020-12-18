import { createStore } from "vuex";
import { vuexOidcCreateStoreModule } from "vuex-oidc";
import { oidcSettings } from "@/config/oidcSettings";

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    oidcStore: vuexOidcCreateStoreModule(oidcSettings)
  }
});
