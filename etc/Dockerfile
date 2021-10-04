FROM node:16

WORKDIR /opt

COPY package.json package-lock.json /opt/

RUN npm ci

COPY . /opt/

ENV NODE_ENV production

# Don't forget to update env.bash script too
ARG VUE_APP_BASE_URL=ENV_TOKEN_BASE_URL \
    VUE_APP_IAM_BASE_URL=ENV_TOKEN_IAM_BASE_URL \
    VUE_APP_API_BASE_URL=ENV_TOKEN_API_BASE_URL \
    VUE_APP_BACKEND_BASE_URL=ENV_TOKEN_BACKEND_BASE_URL \
    VUE_APP_OIDC_CLIENT_ID=ENV_TOKEN_OIDC_CLIENT_ID \
    VUE_APP_MAPBOX_TOKEN=ENV_TOKEN_MAPBOX_TOKEN \
    VUE_APP_MAX_UPLOAD_SIZE=ENV_TOKEN_MAX_UPLOAD_SIZE \
    VUE_APP_URL_BIMDATACONNECT=ENV_TOKEN_URL_BIMDATACONNECT \
    VUE_APP_URL_DOCUMENTATION=ENV_TOKEN_URL_DOCUMENTATION \
    VUE_APP_URL_MARKETPLACE=ENV_TOKEN_URL_MARKETPLACE \
    VUE_APP_ARCHIVE_BASE_URL=ENV_TOKEN_ARCHIVE_BASE_URL \
    VUE_APP_URL_OLD_PLATFORM=ENV_TOKEN_URL_OLD_PLATFORM \
    VUE_APP_AUTHORIZED_IDENTITY_PROVIDERS=ENV_TOKEN_AUTHORIZED_IDENTITY_PROVIDERS

RUN npm run build

# Move JS files with templated env variables in another folder to be able to replace tokens at runtime
RUN mv /opt/dist/js /opt/dist/js-original

FROM nginx:stable
RUN rm /etc/nginx/conf.d/default.conf
COPY etc/nginx.conf /etc/nginx/conf.d/default.conf
COPY etc/env.sh /docker-entrypoint.d
COPY --from=0 /opt/dist /usr/share/nginx/html
