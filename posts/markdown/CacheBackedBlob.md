# Cache-Backed Cloud Storage

## Motivation

While developing my site, one necessary component to tackle is persisting
the content of the site in one way or other. The traditional approach to
data persistance would be to spin up a relational database in one form
or another. For a number of reasons that I'll discuss, that approach felt
like overkill for my site.

My second thought was to use something very lightweight to persist data,
namely a Redis cache. However, in part because my site is composed of
Docker containers, making the same data available between the development
and "production" environments would involve a process roughly as enjoyable
as migrating data between relational databases. 

My ideal solution would require no migration of data between environments,
be highly available, and have fast reads. As a bonus, if it could be
containerized in its entirity, I'd be able to plug it in to other projects
in the future.

I'll cut to the chase - I'm going to use a hybrid local cache / cloud
storage solution. This will be containerized, and expose a minimal API
so that other containers may incur the responsibility for marshalling and
unmarshalling data.

## Considerations

The goal of the project would be to provide read and write times
comparable to a cloud-based Redis cache, for the price of cloud based
BLOB storage.

Like anything in software engineering, using a public Cloud provider's
BLOB storage for data persistence comes with a variety of advantages
and disadvantages. At Emergency Reporting, I've worked with Microsoft
Azure on a number of projects, and as such I'm most familiar with the
services it provides, and it's pricing. I've also used some services
on Google Cloud Platform, but haven't developed any apps hosted on GCP.
And I've hardly touched AWS, which tempts me to use S3 for this project
simply to learn more about the AWS landscape. However, because I'm
most familiar with Azure, I'll be using it as a reference point in this
post.

### Technical Concerns

Because the BLOB storage is cache-backed, latency and the number of
reads/writes allowed per unit time for any given cloud provider isn't a
particular concern at this point. In my experience with Azure storage,
when interacting with a storage account in the US West 2 region from a
client in Bellingham, WA, reads and writes have taken between 100-300ms.
While that's not exceedingly slow, it does represent a substantial
overhead if every API call doesn't return a response until a given read
or write to BLOB storage is complete. This can be mitigated by allowing
the storage client to return a status code to the calling service based
on the manipulation of some data structure that is held in memory --
the cache. The issue with this quick response to a calling service is
maintaining consistency across calls.

Ideally, this package would allow multiple clients to access the same BLOB storage, much like databases allow mulitple concurrent connections.
The challenge this introduces is maintaining a cannocial state in BLOB
storage when multiple clients are manipulating the data stored within.
At this point, I only need my site to manipulate the data which is
persisted in BLOB storage, so ensuring consistency across clients can
be a problem to solve later, so long as I leave room in the code for
a means of ensuring eventual consistency.

### Cost

From a cost perspective, I'm going to use Azure Cache for Redis as a
point of comparison. Azure provides three tiers of this cache: Basic,
Standard and Premium, which are meant for Development, Production and
Enterprise environments, respectively. The lowest price option available
is in the Basic tier, for a 250mb cache, which allows 256 concurrent
connections, has no SLA, failover or replication guarentees, etc., etc.
It is essentially just for development, and runs $0.022 per hour of
uptime. Realistically, even I would rule that out for a production
environment - losing the cache without any means of restoring the
contents sounds awful.

The cheapest option in the Standard tier is similar size, network
performance and support for concurrent connections, but Azure provides
something of a security blanket for ensuring availability and failover
in case the cache goes down. This lowest option goes for $0.028 per
hour of uptime.

Since their are 24 hours in a day, and... about 365.25 days in a year,
the cost per month on this lowest of Standard tier options is $20.454.
That's 4 times what I pay for my Digital Ocean droplet which hosts this
site, so the temptation is to install Redis on my droplet and
call it a day. However, that doesn't meet my final goal for this project.

### Reusability

This is really what I'd like to optimize for - some means of persisting
data that I can include in a project without having to consider where
that project is deployed, or what language that project is using. That
motivates the use of a Docker container which performs the maintanence
of this global state, and which can be agnostic of which platform it is
hosted on. Ideally, this container could be included in a docker-compose
file, and interacted with by any other container with which it is 
composed. I'm not particularly versed in Kubernetes, but I'd hope the
same principle holds true should I ever need this service in a
K8s-hosted service.

## Approach

I'm going to use Azure BLOB storage, as for a single GB of BLOB storage,
with <= 10,000 reads and writes per month, the cost would be approximately
$0.07 per month. Comparing S3, the price is almost identical, although it
does provide more granularity, as request-based costs are per 1,000 not
10,000. Still, 1 GB of storage accessed 10,000 times in a month would
a cool 7 cents. GCP follows suit - roughly 2 cents for storage and 5 cents
for access, although it seems to also support a free tier. Fortunately, I
can afford to spend 84 cents a year to store data on a platform with which
I'm familiar, so I'm going to use Azure.


