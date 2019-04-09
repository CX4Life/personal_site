# personal_site
My personal website!

Copyright (c) Tim Woods - 2019

This is all the code that supports my personal website.

It breaks services into Docker containers, which are orchestrated using `docker-compose`.

Originally, I was hoping to use Google Cloud Platform's Kubernetes Engine to host this
site, but in reality, that's overkill even for me.

It's hosted on a Digital Ocean droplet running Linux. Content is served by NGINX, and
the NGINX configuration file can be found in this repo.

The site is "deployed" by ssh'ing to my Droplet, and running `docker-compose up`.
That makes me happy.

Currently, the front-end is React, and a Mongo database is being added to save posts to the site.

License is MIT
