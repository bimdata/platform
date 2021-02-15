import { reactive, readonly, toRefs, watchEffect } from "vue";
import apiClient from "@/server/api-client";
import AuthService from "@/server/AuthService";

const state = reactive({
  isAuthenticated: false,
  user: null
});

const authenticate = async redirectPath => {
  const user = await AuthService.getUser();
  if (user) {
    if (!state.isAuthenticated) {
      state.isAuthenticated = true;
      state.user = {
        accessToken: user.access_token,
        firstName: user.profile.given_name,
        lastName: user.profile.family_name,
        email: user.profile.email
      };
    }
  } else {
    await AuthService.signIn(redirectPath);
  }
};

const signIn = async redirectPath => {
  await AuthService.signIn(redirectPath);
};

const signInCallback = async () => {
  const user = await AuthService.signInCallback();
  return user;
};

const signOut = async () => {
  await AuthService.signOut();
  state.isAuthenticated = false;
  state.user = null;
};

// Keep access token up to date across refresh
watchEffect(() => {
  if (state.user) {
    apiClient.accessToken = state.user.accessToken;
  }
});

export function useAuth() {
  const readonlyState = readonly(state);
  return {
    ...toRefs(readonlyState),
    authenticate,
    signIn,
    signInCallback,
    signOut
  };
}
