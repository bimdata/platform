#!/bin/bash

set -euo pipefail

js_original_path="/usr/share/nginx/html/js-original"
js_path="/usr/share/nginx/html/js"

cp -r ${js_original_path} ${js_path}

sed -i "s/ENV_TOKEN_BASE_URL/$VUE_APP_BASE_URL/g" ${js_path}/*
sed -i "s/ENV_TOKEN_IAM_BASE_URL/$VUE_APP_IAM_BASE_URL/g" ${js_path}/*
sed -i "s/ENV_TOKEN_API_BASE_URL/$VUE_APP_API_BASE_URL/g" ${js_path}/*
sed -i "s/ENV_TOKEN_BACKEND_BASE_URL/$VUE_APP_BACKEND_BASE_URL/g" ${js_path}/*
sed -i "s/ENV_TOKEN_VIEWER_BASE_URL/$VUE_APP_VIEWER_BASE_URL/g" ${js_path}/*
sed -i "s/ENV_TOKEN_OIDC_CLIENT_ID/$VUE_APP_OIDC_CLIENT_ID/g" ${js_path}/*
sed -i "s/ENV_TOKEN_MAPBOX_TOKEN/$VUE_APP_MAPBOX_TOKEN/g" ${js_path}/*
sed -i "s/ENV_TOKEN_MAX_UPLOAD_SIZE/$VUE_APP_MAX_UPLOAD_SIZE/g" ${js_path}/*
sed -i "s/ENV_TOKEN_URL_BIMDATACONNECT/$VUE_APP_URL_BIMDATACONNECT/g" ${js_path}/*
sed -i "s/ENV_TOKEN_URL_DOCUMENTATION/$VUE_APP_URL_DOCUMENTATION/g" ${js_path}/*
sed -i "s/ENV_TOKEN_URL_MARKETPLACE/$VUE_APP_URL_MARKETPLACE/g" ${js_path}/*
sed -i "s/ENV_TOKEN_ARCHIVE_BASE_URL/$VUE_APP_ARCHIVE_BASE_URL/g" ${js_path}/*
sed -i "s/ENV_TOKEN_URL_OLD_PLATFORM/$VUE_APP_URL_OLD_PLATFORM/g" ${js_path}/*
sed -i "s/ENV_TOKEN_AUTHORIZED_IDENTITY_PROVIDERS/$VUE_APP_AUTHORIZED_IDENTITY_PROVIDERS/g" ${js_path}/*
