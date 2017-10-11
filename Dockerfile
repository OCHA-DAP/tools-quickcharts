FROM alpine:3.6 AS builder

ENV NPM_CONFIG_PROGRESS=false \
    NPM_CONFIG_SPIN=false

WORKDIR /srv/hxlpreview

COPY . .

RUN apk add --update-cache \
        nodejs \
        nodejs-npm \
        git \
        curl \
        nano && \
    npm install -g @angular/cli && \
    npm install && \
    ng build --prod -bh /hxlpreview/

FROM alpine:3.6

RUN apk add --update nginx && \
    mkdir -p /run/nginx

COPY ./docker/default.conf /etc/nginx/conf.d/

COPY --from=builder /srv/hxlpreview/dist /var/www

ENTRYPOINT ["nginx", "-g", "daemon off;"]
