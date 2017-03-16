FROM alpine:3.5
#FROM unocha/hdx-hxlpreview-builder

MAINTAINER "Serban Teodorescu <teodorescu.serban@gmail.com>"

#ENV NODE_PATH=/usr/lib/node_modules \
ENV SRC_DIR=/src \
    DST_DIR=/srv/www \
    NPM_CONFIG_PROGRESS=false \
    NPM_CONFIG_SPIN=false

COPY . ${SRC_DIR}/

RUN mkdir -p ${DST_DIR} && \
    apk add --update --virtual .build-deps \
        build-base \
        git \
        nodejs-lts \
        rsync \
        ruby-bundler \
        ruby-dev \
        libffi-dev \
        python && \
    gem install --no-document \
        bootstrap-sass \
        font-awesome-sass \
        sass-globbing \
        compass && \
    apk add --update nginx && \
    mkdir -p /run/nginx && \
    mv ${SRC_DIR}/env/etc/nginx/conf.d/default.conf /etc/nginx/conf.d/ && \
    cd ${SRC_DIR} && \
    npm install && \
    #./node_modules/angular-cli/bin/ng test --watch=false && \
    ./node_modules/angular-cli/bin/ng build  --prod --bh /hxlpreview/ && \
    cd / && \
    rsync -avh --delete-after ${SRC_DIR}/dist/* ${DST_DIR}/ && \
    rm -rf ${SRC_DIR} && \
    npm cache clean && \
    apk del .build-deps && \
    rm -rf /usr/lib/ruby && \
    rm -rf /tmp/* && \
    rm -rf /var/cache/apk/*

ENTRYPOINT ["nginx", "-g", "daemon off;"]
