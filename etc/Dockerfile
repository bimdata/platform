FROM node:20

WORKDIR /opt

COPY package.json package-lock.json /opt/

RUN npm ci

COPY . /opt/

ENV NODE_ENV=production

RUN npm run build

# Move JS files with templated env variables in another folder to be able to replace tokens at runtime
RUN mv /opt/dist/assets /opt/dist/assets-original

FROM nginx:stable
RUN rm /etc/nginx/conf.d/default.conf
COPY etc/nginx.conf /etc/nginx/conf.d/default.conf
COPY etc/nginx-security-headers.conf /etc/nginx/nginx-security-headers.conf
COPY etc/env.sh /docker-entrypoint.d
COPY --from=0 /opt/dist /usr/share/nginx/html
