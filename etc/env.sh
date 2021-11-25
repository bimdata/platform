#!/bin/bash

set -euo pipefail

js_original_path="/usr/share/nginx/html/js-original"
js_path="/usr/share/nginx/html/js"

# Associative var_name => placeholder_value
declare -A vars_to_placeholders=(
  [VUE_APP_BASE_URL]="ENV_TOKEN_BASE_URL"
  [VUE_APP_IAM_BASE_URL]="ENV_TOKEN_IAM_BASE_URL"
  [VUE_APP_API_BASE_URL]="ENV_TOKEN_API_BASE_URL"
  [VUE_APP_BACKEND_BASE_URL]="ENV_TOKEN_BACKEND_BASE_URL"
  [VUE_APP_OIDC_CLIENT_ID]="ENV_TOKEN_OIDC_CLIENT_ID"
  [VUE_APP_MAPBOX_TOKEN]="ENV_TOKEN_MAPBOX_TOKEN"
  [VUE_APP_MAX_UPLOAD_SIZE]="ENV_TOKEN_MAX_UPLOAD_SIZE"
  [VUE_APP_URL_BIMDATACONNECT]="ENV_TOKEN_URL_BIMDATACONNECT"
  [VUE_APP_URL_DOCUMENTATION]="ENV_TOKEN_URL_DOCUMENTATION"
  [VUE_APP_URL_MARKETPLACE]="ENV_TOKEN_URL_MARKETPLACE"
  [VUE_APP_ARCHIVE_BASE_URL]="ENV_TOKEN_ARCHIVE_BASE_URL"
  [VUE_APP_URL_OLD_PLATFORM]="ENV_TOKEN_URL_OLD_PLATFORM"
  [VUE_APP_AUTHORIZED_IDENTITY_PROVIDERS]="ENV_TOKEN_AUTHORIZED_IDENTITY_PROVIDERS"
  [VUE_APP_SUBSCRIPTION_ENABLED]="ENV_TOKEN_SUBSCRIPTION_ENABLED"
  [VUE_APP_FREE_PLAN_STORAGE]="ENV_TOKEN_FREE_PLAN_STORAGE"
  [VUE_APP_PRO_PLAN_ID]="ENV_TOKEN_PRO_PLAN_ID"
  [VUE_APP_PRO_PLAN_STORAGE]="ENV_TOKEN_PRO_PLAN_STORAGE"
  [VUE_APP_DATAPACK_PLAN_ID]="ENV_TOKEN_DATAPACK_PLAN_ID"
  [VUE_APP_PROJECT_STATUS_LIMIT_NEW]="ENV_TOKEN_PROJECT_STATUS_LIMIT_NEW"
  [VUE_APP_PROJECT_STATUS_LIMIT_ACTIVE]="ENV_TOKEN_PROJECT_STATUS_LIMIT_ACTIVE"
)

# Copy the original JS
if [[ -d "${js_path}" ]] ; then
  rm -r "${js_path}"
fi
cp -r "${js_original_path}" "${js_path}"

# For each env variable, if unset, set it to empty string and replace
# the placeholder by the wanted value in the JS files
for var_name in "${!vars_to_placeholders[@]}" ; do
  if [[ -z ${!var_name+x} ]] ; then
    declare ${var_name}=""
  fi
  sed -i "s|${vars_to_placeholders[$var_name]}|${!var_name}|g" "${js_path}"/*
done
