When Google released their `.dev` domains, I knew I just had to
snag one for myself. After a few weekends of designing and coding,
version 0.0.1 is here!

After two years working on an IIS-hosted, classic ASP/PHP,
jQuery / React website at work, I was eager to explore some
different approaches to creating and hosting a website; the fact
that I could actually get timwoods._anything_ was the cherry on
top. 

More than anything, I created this site to learn firsthand about
the various approaches to designing and deploying a modern site,
and to then share what I've learned here. As I work on other
projects, expect to see blog posts that provide an overview.

All of the code for this site can be found [on my GitHub](https://www.github.com/cx4life/personal_site).

## Overview

### Hosting

Right now, this site is hosted on a Digital Ocean droplet,
using Nginx and Docker Compose. I say right now, because one
benefit of using containers and breaking each part of my
site out into a service if my needs for resilence or scalability
change. For now, the DO droplet is good enough, and cheap.

### Docker

I'd had some experience working with containers and
[Docker](https://www.docker.com/), but I wanted to use the
creation of this site as an opportunity to get more in-depth
experience. 

Using Docker provided me with a few very valuable things, but maybe
the most valuable aspect of using Docker was that it required me
to think about each portion of this site as a separate service.
At this point, this site contains three separate services: an Auth
service that issues and verifies JWTs, an API service that receives
requests for data (like this post), and my front-end service which
hosts this React site. The Auth service is writen in Go, and the
API uses Python and [Flask](http://flask.pocoo.org/).

In the future, I'll go into more about how these services integrate
with one another. The upshot is that Docker allowed me to work on
each service more or less in isolation, and with the knowledge that
if the service worked correctly while developing it, it would
perform the same way when that container was deployed, regardless
of where it was deployed.

### Go

I've had the opportunity to use Go for a number of projects,
include a document indexer and the "Extract" and "Transform"
layers of a basic ETL pipeline. I really enjoy Go's simplicity,
and the CSP-based concurrency model is something I miss when
writing other languages, like .NET or Node. I knew I wanted to
use it for some backend service on this site, and the availabilty
of the `github.com/dgrijalva/jwt-go` library for issuing and
verifying JWTs made it simple to spin up my Auth service.

### Flask

I like Python a lot, and I hadn't used Flask to create an API
before.

I've used Slim in PHP to handle the routing layer of a REST API,
and have appreciated it's simplicity. Flask provides a similarly
simple routing layer, so I was drawn to it over Django.

### React

While I could have gone with any flavor of JavaScript framework
(or WASM, which would be... fun?), I write React at work. I like
it. Composing Components generally makes sense, state management
is simpler now that Hooks are part of React. 

### Docker Compose

Currently, I use Docker Compose to integrate these services
locally, and on the my live site. This is great for ease of
development, because it allows me to see exactly how each of
the services will iteract in production while running them on
my laptop, but it lacks a lot of the robustness of a real
container orchestration tool like Kubernetes of AWS ECS. I was
comfortable with making that trade-off for two reasons:
- Hosting this site on ECS or Azure Kubernetes Service would
have been at least 5 times as expensive
- If my site goes down, it's not the end of the world

If I had users who relied on this site in order to access their
data, or to perform work, I'd be using Kubernetes instead.

### Azure Cloud Storage

For persisting data (so far), I've been using an Azure Storage
account, and converting JSON back and forth to entities in Table
storage.

I had experience using Azure at work, and have come to appreciate
the way it manages idenities and ownership of various services.
In Azure, it's straightforward allow only a particular service
to read the secrets stored in an Azure Key Vault, for instance.

In any case, I've had a pleasant enough experience using Azure,
and it's what I'm most familiar with. The pricing model for its
storage was also very attractive - less than 10 cents a month for
my needs.

### Digital Ocean

I ended up hosting this site on a cheap DO droplet, because it's
really all I need. None of the services are computationally
expensive to run, so $5 a month gets me a static IP and an tiny Ubuntu VM. Which, when you think about it, is pretty amazing.

This site is currently hosted on a Digital Ocean Droplet. I say
currently, because I've tried to decouple the actual services of
this site from the infrastructure on which it is hosted using

## More to come

In future posts, I'll dive into each of those areas a bit more.
In particular, I've already learned a few things concerning my
persistence layer that I'll highlight in the future.

-Tim
