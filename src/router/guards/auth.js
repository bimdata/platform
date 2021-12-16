import { useAuth } from "@/state/auth.js";

const { isAuthenticated, authenticate } = useAuth();

export default async function authGuard(route) {
  if (isAuthenticated.value) {
    return true;
  } else if (route.matched.some(r => r.meta.requiresAuth)) {
    await authenticate(route.path);
    // Navigate to target route if authentication succeeds (cancel navigation otherwise)
    return isAuthenticated.value;
  }
}
