import { reactive, readonly, toRefs, watchEffect } from "vue";
import apiClient from "@/api";
import UserService from "@/api/UserService";

const state = reactive({
  isAuthenticated: false,
  loading: false,
  user: null
});

const authenticate = async redirectPath => {
  const user = await UserService.getUser();
  if (user) {
    if (!state.isAuthenticated) {
      state.isAuthenticated = true;
      state.user = user;
    }
  } else {
    await UserService.signIn(redirectPath);
  }
};

const signIn = async redirectPath => {
  await UserService.signIn(redirectPath);
};

const signInCallback = async () => {
  const user = await UserService.signInCallback();
  return user;
};

const signOut = async () => {
  await UserService.signOut();
  state.isAuthenticated = false;
  state.user = null;
};

// Keep access token up to date across refresh
watchEffect(() => {
  if (state.user) {
    apiClient.accessToken = state.user.access_token;
  }
});

export function useGlobalState() {
  const readonlyState = readonly(state);
  return {
    ...toRefs(readonlyState),
    authenticate,
    signIn,
    signInCallback,
    signOut
  };
}
