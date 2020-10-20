#!/bin/sh

[ ! -z ${BASE_HREF} ] || export BASE_HREF=/hxlpreview

envsubst '${BASE_HREF}' < /srv/default.conf.tpl > /etc/nginx/conf.d/default.conf

sed -i "s|<base href=.*>|<base href=\"${BASE_HREF}/\">|" /var/www/index.html

exec "$@"
