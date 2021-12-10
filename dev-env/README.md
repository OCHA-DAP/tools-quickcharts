# RUNNING DEVELOPMENT CONTAINER FOR QUICKCHARTS

## CONFIGURE

Some configurations assume this app will be accessed within a HDX/CKAN stack. So you might need to do some of the changes underlined below:

*  code mapping from host to container: check the *docker-compose.yml* file to change the location of the files (if needed. There's a relative path there by default which might work for you)
*  *src/index.html* is configured as if the application is served on */tools/quickcharts*. If you don't use nginx to map */tools/quickcharts* and you plan to access directly the angular application then change `<base href="/tools/quickcharts/">` to `<base href="/">`
*  *src/environments/environment.ts* is configured to use the local *hxlproxy*. In case you want to use an external one, just change the *hxlProxy* property to something like: `hxlProxy: 'https://proxy.hxlstandard.org/data.json'`
*  the web server maps to port 4201 on the host by default. Check the *ports* section in the *docker-compose.yml* file
*  all docker-related commands must be executed as root (or via sudo). Basically the user running the docker-related commands must have the necessarry permissions (being part of the *docker* group might also work).

## START THE CONTAINER

`docker-compose up -d`

OR

`docker-compose start` if the container already exists

## ENTER THE CONTAINER

`docker-compose exec quickcharts /bin/sh`

## BUILD AND START THE APP

1. `npm install`
2. `npm run build_lib` - This builds the common library that we reuse in different angular apps.
3. `ng serve --disableHostCheck=true`

