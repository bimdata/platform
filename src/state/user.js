import { reactive, readonly, toRefs } from "vue";
import UserService from "@/server/UserService";

const state = reactive({
  user: null
});

const loadUser = async () => {
  state.user = await UserService.fetchUserData();
  return state.user;
};

export function useUser() {
  const readonlyState = readonly(state);
  return {
    ...toRefs(readonlyState),
    loadUser
  };
}
