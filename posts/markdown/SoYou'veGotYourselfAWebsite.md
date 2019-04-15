Google recently started advertizing their `.dev` domain names,
and my vanity got the best of me...

In reality, after two years working at a SaaS company on an
IIS-hosted, classic ASP/PHP, jQueryish, Reactish website, I was
eager to try some different approaches to creating and hosting
a website; the fact that I could actually get timwoods._anything_
was the cherry on top. I don't imagine myself as wise Joel Spolsky,
Jeff Atwood, etc., but if there's anything the world needs now,
it's more markdown spilled over writing code.

And __here__ is where I would likely include a GIF to express
sarcasm, but I'm not sure how my site would actually acheive that,
at this point.

## That's sort of the point of this site

I'm creating this site, selfishly, to feel the pain of not being
able to put a GIF in my markdown, then seek a solution to that
problem. __It's intended as a vehicle for learning.__

## Architecture (if it deserves that moniker)

This site is currently hosted on a Digital Ocean Droplet. I say
currently, because I've tried to decouple the actual services of
this site from the infrastructure on which it is hosted using
[Docker](https://www.docker.com/) and
[docker-compose](https://docs.docker.com/compose/) to seperate
concerns. All the code for this site can be viewed on
[my GitHub](https://www.github.com/cx4life/personal_site).

One advantage of using `docker-compose` is that each portion
of this site can be created in a different language, in a different
environment, and can be developed independently of the other parts
of the site. In reality, a big advantage is that *ensures* each
part of the site is isolated - there is no temptation to develop
business logic surrounding database queries while tinkering with
the front-end, *if the front-end is incapable of connecting to the
database*.

An ancillary benefit is that it could potentially support
redeveloping a portion of the site in a new language in isolation,
or supporting blue-green deploys, or canary deploys, or...

In future posts, I'll go into the thinking and motivation behind
the various areas of the website. As a quick overview:
- The front-end uses [React.js](https://reactjs.org/)
- The DB is [Mongo](https://www.mongodb.com/)
- The API will probably be [Flask](http://flask.pocoo.org/)

Thanks for taking a peak!

-Tim
