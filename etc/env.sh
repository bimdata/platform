#!/bin/bash

set -euo pipefail

nginx_root="/usr/share/nginx/html"
assets_original_folder="assets-original"
assets_folder="assets"

js_original_path="${nginx_root}/${assets_original_folder}"
js_path="${nginx_root}/${assets_folder}"

index_original_path="${nginx_root}/index.html-original"
index_path="${nginx_root}/index.html"

hash_algo="sha384"

# Associative var_name => placeholder_value
declare -A vars_to_placeholders=(
    [VUE_APP_BASE_URL]="ENV.VUE_APP_BASE_URL"
    [VUE_APP_IAM_BASE_URL]="ENV.VUE_APP_IAM_BASE_URL"
    [VUE_APP_API_BASE_URL]="ENV.VUE_APP_API_BASE_URL"
    [VUE_APP_BACKEND_BASE_URL]="ENV.VUE_APP_BACKEND_BASE_URL"
    [VUE_APP_OIDC_CLIENT_ID]="ENV.VUE_APP_OIDC_CLIENT_ID"
    [VUE_APP_MAPTILER_TOKEN]="ENV.VUE_APP_MAPTILER_TOKEN"
    [VUE_APP_MAX_UPLOAD_SIZE]="ENV.VUE_APP_MAX_UPLOAD_SIZE"
    [VUE_APP_URL_BIMDATACONNECT]="ENV.VUE_APP_URL_BIMDATACONNECT"
    [VUE_APP_URL_DOCUMENTATION]="ENV.VUE_APP_URL_DOCUMENTATION"
    [VUE_APP_URL_MARKETPLACE]="ENV.VUE_APP_URL_MARKETPLACE"
    [VUE_APP_ARCHIVE_BASE_URL]="ENV.VUE_APP_ARCHIVE_BASE_URL"
    [VUE_APP_URL_OLD_PLATFORM]="ENV.VUE_APP_URL_OLD_PLATFORM"
    [VUE_APP_AUTHORIZED_IDENTITY_PROVIDERS]="ENV.VUE_APP_AUTHORIZED_IDENTITY_PROVIDERS"
    [VUE_APP_SUBSCRIPTION_ENABLED]="ENV.VUE_APP_SUBSCRIPTION_ENABLED"
    [VUE_APP_PADDLE_SANDBOX]="ENV.VUE_APP_PADDLE_SANDBOX"
    [VUE_APP_PADDLE_VENDOR_ID]="ENV.VUE_APP_PADDLE_VENDOR_ID"
    [VUE_APP_FREE_PLAN_STORAGE]="ENV.VUE_APP_FREE_PLAN_STORAGE"
    [VUE_APP_PRO_PLAN_ID]="ENV.VUE_APP_PRO_PLAN_ID"
    [VUE_APP_PRO_PLAN_STORAGE]="ENV.VUE_APP_PRO_PLAN_STORAGE"
    [VUE_APP_DATAPACK_PLAN_ID]="ENV.VUE_APP_DATAPACK_PLAN_ID"
    [VUE_APP_PROJECT_STATUS_LIMIT_NEW]="ENV.VUE_APP_PROJECT_STATUS_LIMIT_NEW"
    [VUE_APP_PROJECT_STATUS_LIMIT_ACTIVE]="ENV.VUE_APP_PROJECT_STATUS_LIMIT_ACTIVE"
    [VUE_APP_USER_IFRAME_PROFILE]="ENV.VUE_APP_USER_IFRAME_PROFILE"
    [VUE_APP_GUIDED_TOUR_ENABLED]="ENV.VUE_APP_GUIDED_TOUR_ENABLED"
    [VUE_APP_TRANSLATE_IFC_TYPE]="ENV.VUE_APP_TRANSLATE_IFC_TYPE"
    [VUE_APP_NOTIFICATION_ENABLED]="ENV.VUE_APP_NOTIFICATION_ENABLED"
    [VUE_APP_AVOID_SPACE_DELETION]="ENV.VUE_APP_AVOID_SPACE_DELETION"
    [VUE_APP_DELETION_TEMP_WORKAROUND_ENABLED]="ENV.VUE_APP_DELETION_TEMP_WORKAROUND_ENABLED"
    [VUE_APP_PDF_BACKEND_BASE_URL]="ENV.VUE_APP_PDF_BACKEND_BASE_URL"
)

# Function to compute the hash of a resource
function compute_hash() {
    local resource_path=$1
    local hash=$(cat "${resource_path}" | openssl dgst -${hash_algo} -binary | openssl base64 -A)
    echo "${hash}"
}

function initialize() {
    # Cleanup old files for example after a restart & copy fresh one in case variables changed
    if [[ -d "${js_path}" ]] ; then
        rm -r "${js_path}"
    fi
    cp -r "${js_original_path}" "${js_path}"

    if [[ -f "${index_path}" ]] ; then
        rm "${index_path}"
    fi
    cp "${index_original_path}" "${index_path}"
}

function customize_assets_for_env() {
    for var_name in "${!vars_to_placeholders[@]}" ; do
        if [[ -z ${!var_name+x} ]] ; then
            declare ${var_name}=""
        fi
        sed -i "s|${vars_to_placeholders[$var_name]}|\"${!var_name}\"|g" "${js_path}"/*
    done
}

function customize_index_resources_integrity() {
    # Read the index file and find all the local css and js files
    js_files=($(grep -oP "src=\"/${assets_folder}\K/[^\"]+\.js" "${index_path}"))
    css_files=($(grep -oP "href=\"/${assets_folder}\K/[^\"]+\.css" "${index_path}"))

    # Compute the hash of each file and update the index file with the integrity attribute
    for js_file in "${js_files[@]}" ; do
        js_file_path="${js_path}/${js_file}"
        js_hash=$(compute_hash "${js_file_path}")
        sed -i "s|src=\"/${assets_folder}${js_file}\"|src=\"/${assets_folder}${js_file}\" integrity=\"${hash_algo}-${js_hash}\"|g" ${index_path}
    done
    for css_file in "${css_files[@]}" ; do
        css_file_path="${js_path}/${css_file}"
        css_hash=$(compute_hash "${css_file_path}")
        sed -i "s|href=\"/${assets_folder}${css_file}\"|href=\"/${assets_folder}${css_file}\" integrity=\"${hash_algo}-${css_hash}\"|g" ${index_path}
    done
}

# Copy the original files
initialize
customize_assets_for_env
customize_index_resources_integrity
