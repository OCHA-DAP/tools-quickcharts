server {
	listen 80 default_server;
	listen [::]:80 default_server;

  access_log /var/log/nginx/access.log logstash_internal;

	# Everything is a 404
	location / {
		return 404;
	}

	# You may need this to prevent return 404 recursion.
	location = /404.html {
		internal;
	}

	location ^~ ${BASE_HREF} {
		alias /var/www/;
		try_files $uri /index.html =404;
		index index.html;
	}
}
