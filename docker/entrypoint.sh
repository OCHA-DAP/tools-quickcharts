#!/bin/sh

[ ! -z ${BASE_HREF} ] || export BASE_HREF=/tools/quickcharts

envsubst '${BASE_HREF}' < /srv/default.conf.tpl > /etc/nginx/http.d/default.conf

sed -i "s|<base href=.*>|<base href=\"${BASE_HREF}/\">|" /var/www/index.html

exec "$@"
