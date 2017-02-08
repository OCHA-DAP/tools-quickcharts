How to build documentation
==========================

How to build this documentation:
 - docker run -d --name sphinx -v /path-to-your-repo/hxl-bites:/doc minimum2scp/sphinx:latest "tail -f /dev/null"
 - bash inside sphinx
 - cd /doc
 - make html
 - now you can check the documentation in /path-to-your-repo/hxl-bites/docs/build/html
