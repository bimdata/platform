ARG TAG=staging
FROM node:20 AS node

WORKDIR /opt

COPY package.json package-lock.json /opt/

RUN npm ci

COPY . /opt/

ENV NODE_ENV=production

RUN npm run build

# Move JS files with templated env variables in another folder to be able to replace tokens at runtime
RUN mv /opt/dist/assets /opt/dist/assets-original

# When creating a new tag, this will fail.
# Comment this line and the COPY --from=previous_build line
FROM docker-registry.bimdata.io/bimdata/platform:${TAG} AS previous_build

FROM nginx:stable
RUN rm /etc/nginx/conf.d/default.conf
COPY etc/nginx.conf /etc/nginx/conf.d/default.conf
COPY etc/env.sh /docker-entrypoint.d
COPY --from=previous_build /usr/share/nginx/html/assets-original /usr/share/nginx/html/assets-original
COPY --from=node /opt/dist /usr/share/nginx/html
