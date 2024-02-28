FROM public.ecr.aws/unocha/nodejs-builder:20-alpine AS builder

ARG BASE_HREF=/tools/quickcharts
ARG BUILD_ENV=production

WORKDIR /src

COPY . .

RUN npm install -g npm@9.8.1 && \
    npm install -g @angular/cli@16.1 && \
    npm install
RUN ng build hxl-preview-ng-lib --configuration production
RUN ng build hxl-bites --configuration production --aot --base-href $BASE_HREF/

FROM public.ecr.aws/unocha/nginx:stable

COPY --from=builder /src/dist/hdx-hxl-preview /var/www

COPY docker/* /srv/

RUN apk add -U gettext

VOLUME /var/log/nginx

ENTRYPOINT ["/srv/entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]

# Volumes
# - Conf: /etc/nginx/conf.d (default.conf)
# - Cache: /var/cache/nginx
# - Logs: /var/log/nginx
# - Data: /var/www
