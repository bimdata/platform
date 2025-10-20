ARG PREVIOUS_IMAGE=docker-registry.bimdata.io/bimdata/platform
ARG PREVIOUS_TAG=staging
FROM node:24 AS node

WORKDIR /opt

COPY package.json package-lock.json /opt/

RUN npm ci

COPY . /opt/

ENV NODE_ENV=production

RUN npm run build

# Move index to be able to rewrite some security informations at runtime
RUN mv /opt/dist/index.html /opt/dist/index.html-original
# Move JS files with templated env variables in another folder to be able to replace tokens at runtime
RUN mv /opt/dist/assets /opt/dist/assets-original

# When creating a new tag, this will fail.
# Comment this line and the COPY --from=previous_build line
FROM ${PREVIOUS_IMAGE}:${PREVIOUS_TAG} AS previous_build
COPY --chmod=0744 etc/clean-previous-versions.sh /
RUN /clean-previous-versions.sh

FROM nginx:stable
RUN rm /etc/nginx/conf.d/default.conf
COPY etc/nginx.conf /etc/nginx/conf.d/default.conf
COPY etc/env.sh /docker-entrypoint.d
COPY --from=previous_build /usr/share/nginx/html/assets-original /usr/share/nginx/html/assets-original
COPY --from=node /opt/dist /usr/share/nginx/html
