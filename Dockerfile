FROM unocha/nodejs-builder:10.14 AS builder

ARG BASE_HREF=/hxlpreview
ARG BUILD_ENV=production

WORKDIR /src

COPY . .

RUN npm install -g @angular/cli@9.1 && \
    npm install && \
    npm run build_lib && \
    ng build --prod --aot --base-href /$BASE_HREF/ && \
    cp -a docker/default.conf dist && \
    sed -i "s%{{BASE_HREF}}%${BASE_HREF}%" dist/default.conf

FROM unocha/nginx:1.14

COPY --from=builder /src/dist /var/www

RUN mv /var/www/default.conf /etc/nginx/conf.d/

VOLUME /var/log/nginx

# Volumes
# - Conf: /etc/nginx/conf.d (default.conf)
# - Cache: /var/cache/nginx
# - Logs: /var/log/nginx
# - Data: /var/www
