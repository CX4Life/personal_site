# Logging and Docker - Golang HTTP server example

## Introduction

In creating my site, one goal I had was separating the front-end,
back-end, data persistence, and authentication layers into their
own Docker containers. I did this for a few reasons, and also as a
learning exercise. Of the "legitmate" reasons (read: things I'd
actually argue for in a design meeting) there are:

1) Breaking each portion of the website out into its own container
means that development on said portion can largely be performed
without considering the impacts on the other containers
2) Each portion being isolated into it's own container requires
the adoption of a particular mental model - namely, that each of
the containers represents a distinct "service". 


Leaving off here for now - other points on my mind:
Each thing being a service means that you sort of need to approach
the architecture as "service-oriented", which is a pattern that
is becoming more broadly applicable. Particularly, it pops up
when designing cloud services, or how portions of an existing SaaS
product will interact with a cloud service.
The other thing I wanted to touch on is that I wanted to try out
solving some problems with Docker and docker-compose, namely that
developing in a mono-repo then breaking the repo apart into
individual packages, which are then each hosted independently,
makes it difficult for a developer to reason about who encapsulated
each of those services truly are. Breaking things apart into
different services, and going so far as to write them in different
languages (which is absolutely just an exercise in "what if I try
this"), ensures that a developer has to stop to think about
creating some type of "contract" between each service if they wish
to make those services interact. In OOP, this is the idea of an
Interface - a contract which must be upheld by independent library
code.

That is really a pretty different blog post than what this article
would suggest, which concerned logging from a golang container.
Really, that was a quick Google and expose a volume to the
container using `docker-compose.yml`. Tha