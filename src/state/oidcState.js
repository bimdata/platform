import { vuexOidcCreateReactiveState } from 'vuex-oidc';
import { oidcSettings } from '@/config/oidcSettings';

const state = vuexOidcCreateReactiveState(oidcSettings);

export function useOidcState() {
  return state;
}
