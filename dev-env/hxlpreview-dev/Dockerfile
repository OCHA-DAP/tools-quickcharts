FROM node:12-alpine

RUN mkdir -p /srv/hxlpreview && \
    apk add --update-cache \
        mc \
        gettext \
        python-dev \
        git \
        automake \
        autoconf \
        g++ \
        make \
        linux-headers && \
    cd /srv/hxlpreview && \
    npm install -g @angular/cli@9.1.0

WORKDIR /srv/hxlpreview
