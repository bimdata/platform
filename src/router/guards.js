import { useAuth } from "@/state/auth";

const authGuard = async (to, from, next) => {
  const { isAuthenticated, authenticate } = useAuth();
  if (isAuthenticated.value) {
    next();
  } else if (to.matched.some(route => route.meta.requiresAuth)) {
    await authenticate(to.path);
    // Navigate to target route if authentication succeeds (cancel navigation otherwise)
    next(isAuthenticated.value);
  } else {
    next();
  }
};

export { authGuard };
