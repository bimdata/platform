import { useGlobalState } from '@/state/globalState';

const authGuard = async (to, from, next) => {
  const { isAuthenticated, authenticate } = useGlobalState();
  if (isAuthenticated.value) {
    next();
  } else if (to.matched.some(r => r.meta.requiresAuth)) {
    await authenticate(to.path);
    next();
  } else {
    next();
  }
};

export {
  authGuard
};
