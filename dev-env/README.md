# RUNNING DEVELOPMENT CONTAINER FOR QUICKCHARTS

## CONFIGURE

Some configurations assume this app will be accessed within a HDX/CKAN stack. So you might need to do some of the changes underlined below:

*  code mapping from host to container: check the *docker-compose.yml* file to change the location of the files
*  *index.html* is configured as if the application is served on */hxlpreview*. If you don't use nginx to map */hxlpreview* and you plan to access directly the angular applicatino then change `<base href="/hxlpreview/">` to `<base href="/">`
*  *environment.ts* is configured to use the local *hxlproxy*. In case you want to use an external one, just change the *hxlProxy* property to something like: `hxlProxy: 'https://proxy.hxlstandard.org/data.json'`
*  the web server maps to port 4201 on the host by default. Check the *ports* section in the *docker-compose.yml* file

## START THE CONTAINER

`docker-compose up -d`

OR

`docker-compose start` if the container already exists

## ENTER THE CONTAINER

`docker-compose exec hxlpreview /bin/sh`

## BUILD AND START THE APP

1. `npm install`
2. `ng serve --disableHostCheck=true`

