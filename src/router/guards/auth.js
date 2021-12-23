import { useAuth } from "@/state/auth.js";

const { isAuthenticated, authenticate } = useAuth();

export default async function authGuard(route) {
  if (isAuthenticated.value) {
    // Continue navigation if already authenticated
    return true;
  } else if (route.matched.some(r => r.meta.requiresAuth)) {
    // Trigger authentication process if required
    await authenticate(route.path);
    // Continue navigation if authentication succeeds (cancel navigation otherwise)
    return isAuthenticated.value;
  }
}
