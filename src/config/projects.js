const STATUS_LIMIT_NEW = ENV.VUE_APP_PROJECT_STATUS_LIMIT_NEW;
const STATUS_LIMIT_ACTIVE = ENV.VUE_APP_PROJECT_STATUS_LIMIT_ACTIVE;

const statusLimitNew = +STATUS_LIMIT_NEW;
const statusLimitActive = +STATUS_LIMIT_ACTIVE;

const PROJECT_ROLE = Object.freeze({
  ADMIN: 100,
  USER: 50,
  GUEST: 25
});

const DEFAULT_PROJECT_VIEW = "overview";

export {
  statusLimitNew,
  statusLimitActive,
  PROJECT_ROLE,
  DEFAULT_PROJECT_VIEW
};
