## Persisting Data

For this site, I'm using Azure Table storage to store these blog posts,
and Azure Blob storage for the images you see on the home page. That's
not especially exciting, which I'd argue is a good thing. Prior to
using those Azure resources for storage, I contemplated a number of much
more exciting solutions, and decided against them. I'll run through a
handful of those exciting, bad ideas here, and make the case that my boring
solution was the right one.

### Redis Container

Because the rest of the components of this site are broken out into containers,
I first considered just spinning up another container running a Redis server.
This would probably have worked, but it has some limitations and added complexity,
namely that I'd need to mount a volume on the host machine to persist the data
stored in the Redis cache between container restarts, and then sync the contents
of that volume between environments. There are also
[different options for persisting data in Redis](https://redis.io/topics/persistence),
and querying with a filter to some collection persisted in Redis is less
straightforward than other solutions. Finally, I don't really need the performance
that Redis offers; I somehow doubt that I'm going to be getting tens of thousands
of request for any blob post per second.

### MongoDB Container

Since I planned on mostly storing documents, a document database like Mongo seemed
appropriate, and would provide more flexibility in querying data than a key-value
store like Redis. However, persisting data to a volume, and syncing data between
environments would still be an issue.

### Cache-Backed Blob storage

This was my favorite idea, but ultimately was too complex. Essentially this would
be a container which exposes an API over HTTP, allowing other containers to request
resources. This API would maintain a lookup table in memory, which would associate
resources with BLOBs in Azure Storage. Once a resource had been requested from
BLOB storage, it could be decoded and cached at this layer. Because all of the
data is persisted in the Cloud, syncing between development and live sites wouldn't
be necessary.

There are a few downsides of this approach. First, using BLOB storage means that
some metadata about the BLOBs needs to be maintained. I've been able to do this
with naming conventions and file extensions, but it's not as flexible as adding
a column to a table. Second, the lookup table in the container would need to be
populated whenever the container restarts.

However, those reasons aren't why I abandoned this approach. As I began to build it
out, I realized that I was duplicating a lot of the work done on my Flask API.
Each type of resource would need its own endpoint, and I'd be calling GET/POST/PATCH/
DELETE on those endpoints for CRUD operations... I was more or less recreating my
REST API. So, instead of duplicating that work, I went with...

### Azure Table storage

Viola. I created a data-access object to be referenced in my Flask API, which queried
Azure Table storage. This allows me to use Microsoft's Azure SDK in Python to do all
my querying, and affords all the flexibility that I need for different entities.
The read times for this solution aren't incredible, like they would be with Redis,
but they're fine. Data is available to both development and live without having to
do any syncing. And, for the amount of data I'm storing and accessing, it has yet
to cost me anything.

### Future

I'd like to explore the in-memory cache / cloud storage hybrid approach more, and
specifically find a way to containerize that so it can be pulled into future projects,
but would need to spend more time coming up with a sufficiently flexible API that
doesn't just duplicate the work of building a RESTful HTTP API.