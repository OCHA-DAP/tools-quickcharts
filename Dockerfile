FROM public.ecr.aws/unocha/nodejs-builder:12-alpine AS builder

ARG BASE_HREF=/hxlpreview
ARG BUILD_ENV=production

WORKDIR /src

COPY . .

RUN npm install -g @angular/cli@9.1 && \
    npm install && \
    npm run build_lib && \
    ng build --prod --aot --base-href $BASE_HREF/


FROM public.ecr.aws/unocha/nginx:1.20

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
