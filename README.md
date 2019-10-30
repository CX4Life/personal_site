# personal_site

Tim Woods personal website

Copyright (c) Tim Woods - 2019

It's hosted on a Digital Ocean droplet running Linux. Content is served by NGINX reverse
proxy, which forwards traffic to several Docker containers running on the droplet.

To run the site locally, Docker and an Azure Storage account are required, then:

1- Clone this repository.
2- In the root of the directory, an `.env` file must be included, which specifies all of
the environment variables that appear in the `docker-compose.yml` file. This includes
the name and access key for the Azure Storage account as is visible in the `api`
section of the compose file.
3- With the `.env` file in place, run:

```sh
    docker-compose build
    docker-compose up
```

4- The front-end, API and auth servers will now be running locally, and can be accessed
by sending HTTP traffic to `localhost:<container port>`, where `<container port>` is the
port specified in the `.env` file for each service.
