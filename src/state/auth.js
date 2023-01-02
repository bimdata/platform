import { reactive, readonly, toRefs, watchEffect } from "vue";
import apiClient from "../services/api-client.js";
import AuthService from "../services/AuthService.js";
import PlatformService from "../services/PlatformService.js";

import { useUser } from "./user.js";

const state = reactive({
  isAuthenticated: false,
  accessToken: null
});

// Keep api client access token in sync with state
watchEffect(() => (apiClient.accessToken = state.accessToken));

const authenticate = async path => {
  const user = await AuthService.signIn(
    path,
    state.isAuthenticated,
    usr => (state.accessToken = usr.access_token)
  );

  if (user) {
    // Set auth state
    state.isAuthenticated = true;
    state.accessToken = user.access_token;

    // Trigger login callback and check its status
    const { status: loginCallbackStatus } = await PlatformService.loginCallback(
      user.access_token
    );
    const { setIsNew } = useUser();
    setIsNew(loginCallbackStatus === 201);
  }
};

const signInCallback = async () => {
  const user = await AuthService.signInCallback();
  return user;
};

const signOut = async () => {
  await AuthService.signOut();
  state.isAuthenticated = false;
  state.accessToken = null;
};

export function useAuth() {
  const readonlyState = readonly(state);
  return {
    // References
    ...toRefs(readonlyState),
    // Methods
    authenticate,
    signInCallback,
    signOut
  };
}
