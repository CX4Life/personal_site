# Managing secrets

The issue I ran into was trying to propogate secrets
in the form on environment variables to a React
frontend running inside a Docker container.
`docker-compose` makes those vars readily available
to the container, but getting them into the app itself
is a little trickier, and ensuring that those secrets
don't get checked in, or exposed to any users of the
site becomes a bit more challenging.

