import { reactive, readonly, toRefs, watchEffect } from "vue";
import apiClient from "../services/api-client.js";
import AuthService from "../services/AuthService.js";

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
    const { status: loginCallbackStatus } =
      await AuthService.platformLoginCallback(user.access_token);
    const { setIsNew } = useUser();
    setIsNew(loginCallbackStatus === 201);
  }
};

const signInCallback = () => {
  return AuthService.signInCallback();
};

const signOut = () => {
  AuthService.signOut();
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
