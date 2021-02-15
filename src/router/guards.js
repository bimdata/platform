import { useAuth } from "@/state/auth";

const authGuard = async (to, from, next) => {
  const { isAuthenticated, authenticate } = useAuth();
  if (isAuthenticated.value) {
    next();
  } else if (to.matched.some(r => r.meta.requiresAuth)) {
    await authenticate(to.path);
    next(isAuthenticated.value);
  } else {
    next();
  }
};

export { authGuard };
