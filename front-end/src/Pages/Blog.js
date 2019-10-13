import React from 'react';
import styled from 'styled-components';
import { Header, Post, OneColumn } from '../Parts';

const Offset = styled.div`
    padding-top: 120px;
`;

const Content = ({ children }) => (
    <Offset>
        <OneColumn>
            {children}
        </OneColumn>
    </Offset>
);

export class Blog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [
                {
                    "RowKey": "000001",
                    "created_on": "2019-10-07T17:13:00",
                    "etag": "W/\"datetime'2019-10-08T04%3A45%3A52.0433034Z'\"",
                    "Timestamp": "2019-10-08T04:45:52",
                    "contents": "# Cache-Backed Cloud Storage\n\n## Motivation\n\nWhile developing my site, one necessary component to tackle is persisting\nthe content of the site in one way or other. The traditional approach to\ndata persistance would be to spin up a relational database in one form\nor another. For a number of reasons that I'll discuss, that approach felt\nlike overkill for my site.\n\nMy second thought was to use something very lightweight to persist data,\nnamely a Redis cache. However, in part because my site is composed of\nDocker containers, making the same data available between the development\nand \"production\" environments would involve a process roughly as enjoyable\nas migrating data between relational databases. \n\nMy ideal solution would require no migration of data between environments,\nbe highly available, and have fast reads. As a bonus, if it could be\ncontainerized in its entirity, I'd be able to plug it in to other projects\nin the future.\n\nI'll cut to the chase - I'm going to use a hybrid local cache / cloud\nstorage solution. This will be containerized, and expose a minimal API\nso that other containers may incur the responsibility for marshalling and\nunmarshalling data.\n\n## Considerations\n\nThe goal of the project would be to provide read and write times\ncomparable to a cloud-based Redis cache, for the price of cloud based\nBLOB storage.\n\nLike anything in software engineering, using a public Cloud provider's\nBLOB storage for data persistence comes with a variety of advantages\nand disadvantages. At Emergency Reporting, I've worked with Microsoft\nAzure on a number of projects, and as such I'm most familiar with the\nservices it provides, and it's pricing. I've also used some services\non Google Cloud Platform, but haven't developed any apps hosted on GCP.\nAnd I've hardly touched AWS, which tempts me to use S3 for this project\nsimply to learn more about the AWS landscape. However, because I'm\nmost familiar with Azure, I'll be using it as a reference point in this\npost.\n\n### Technical Concerns\n\nBecause the BLOB storage is cache-backed, latency and the number of\nreads/writes allowed per unit time for any given cloud provider isn't a\nparticular concern at this point. In my experience with Azure storage,\nwhen interacting with a storage account in the US West 2 region from a\nclient in Bellingham, WA, reads and writes have taken between 100-300ms.\nWhile that's not exceedingly slow, it does represent a substantial\noverhead if every API call doesn't return a response until a given read\nor write to BLOB storage is complete. This can be mitigated by allowing\nthe storage client to return a status code to the calling service based\non the manipulation of some data structure that is held in memory --\nthe cache. The issue with this quick response to a calling service is\nmaintaining consistency across calls.\n\nIdeally, this package would allow multiple clients to access the same BLOB storage, much like databases allow mulitple concurrent connections.\nThe challenge this introduces is maintaining a cannocial state in BLOB\nstorage when multiple clients are manipulating the data stored within.\nAt this point, I only need my site to manipulate the data which is\npersisted in BLOB storage, so ensuring consistency across clients can\nbe a problem to solve later, so long as I leave room in the code for\na means of ensuring eventual consistency.\n\n### Cost\n\nFrom a cost perspective, I'm going to use Azure Cache for Redis as a\npoint of comparison. Azure provides three tiers of this cache: Basic,\nStandard and Premium, which are meant for Development, Production and\nEnterprise environments, respectively. The lowest price option available\nis in the Basic tier, for a 250mb cache, which allows 256 concurrent\nconnections, has no SLA, failover or replication guarentees, etc., etc.\nIt is essentially just for development, and runs $0.022 per hour of\nuptime. Realistically, even I would rule that out for a production\nenvironment - losing the cache without any means of restoring the\ncontents sounds awful.\n\nThe cheapest option in the Standard tier is similar size, network\nperformance and support for concurrent connections, but Azure provides\nsomething of a security blanket for ensuring availability and failover\nin case the cache goes down. This lowest option goes for $0.028 per\nhour of uptime.\n\nSince their are 24 hours in a day, and... about 365.25 days in a year,\nthe cost per month on this lowest of Standard tier options is $20.454.\nThat's 4 times what I pay for my Digital Ocean droplet which hosts this\nsite, so the temptation is to install Redis on my droplet and\ncall it a day. However, that doesn't meet my final goal for this project.\n\n### Reusability\n\nThis is really what I'd like to optimize for - some means of persisting\ndata that I can include in a project without having to consider where\nthat project is deployed, or what language that project is using. That\nmotivates the use of a Docker container which performs the maintanence\nof this global state, and which can be agnostic of which platform it is\nhosted on. Ideally, this container could be included in a docker-compose\nfile, and interacted with by any other container with which it is \ncomposed. I'm not particularly versed in Kubernetes, but I'd hope the\nsame principle holds true should I ever need this service in a\nK8s-hosted service.\n\n## Approach\n\nI'm going to use Azure BLOB storage, as for a single GB of BLOB storage,\nwith <= 10,000 reads and writes per month, the cost would be approximately\n$0.07 per month. Comparing S3, the price is almost identical, although it\ndoes provide more granularity, as request-based costs are per 1,000 not\n10,000. Still, 1 GB of storage accessed 10,000 times in a month would\na cool 7 cents. GCP follows suit - roughly 2 cents for storage and 5 cents\nfor access, although it seems to also support a free tier. Fortunately, I\ncan afford to spend 84 cents a year to store data on a platform with which\nI'm familiar, so I'm going to use Azure.\n\n\n",
                    "PartitionKey": "blog",
                    "title": "Storage Plan, Version 1"
                },
                {
                    "RowKey": "000002",
                    "created_on": "2019-10-11T17:13:00",
                    "etag": "W/\"datetime'2019-10-08T04%3A45%3A52.0433034Z'\"",
                    "Timestamp": "2019-10-08T04:45:52",
                    "contents": "# Cache-Backed Cloud Storage\n\n## Motivation\n\nWhile developing my site, one necessary component to tackle is persisting\nthe content of the site in one way or other. The traditional approach to\ndata persistance would be to spin up a relational database in one form\nor another. For a number of reasons that I'll discuss, that approach felt\nlike overkill for my site.\n\nMy second thought was to use something very lightweight to persist data,\nnamely a Redis cache. However, in part because my site is composed of\nDocker containers, making the same data available between the development\nand \"production\" environments would involve a process roughly as enjoyable\nas migrating data between relational databases. \n\nMy ideal solution would require no migration of data between environments,\nbe highly available, and have fast reads. As a bonus, if it could be\ncontainerized in its entirity, I'd be able to plug it in to other projects\nin the future.\n\nI'll cut to the chase - I'm going to use a hybrid local cache / cloud\nstorage solution. This will be containerized, and expose a minimal API\nso that other containers may incur the responsibility for marshalling and\nunmarshalling data.\n\n## Considerations\n\nThe goal of the project would be to provide read and write times\ncomparable to a cloud-based Redis cache, for the price of cloud based\nBLOB storage.\n\nLike anything in software engineering, using a public Cloud provider's\nBLOB storage for data persistence comes with a variety of advantages\nand disadvantages. At Emergency Reporting, I've worked with Microsoft\nAzure on a number of projects, and as such I'm most familiar with the\nservices it provides, and it's pricing. I've also used some services\non Google Cloud Platform, but haven't developed any apps hosted on GCP.\nAnd I've hardly touched AWS, which tempts me to use S3 for this project\nsimply to learn more about the AWS landscape. However, because I'm\nmost familiar with Azure, I'll be using it as a reference point in this\npost.\n\n### Technical Concerns\n\nBecause the BLOB storage is cache-backed, latency and the number of\nreads/writes allowed per unit time for any given cloud provider isn't a\nparticular concern at this point. In my experience with Azure storage,\nwhen interacting with a storage account in the US West 2 region from a\nclient in Bellingham, WA, reads and writes have taken between 100-300ms.\nWhile that's not exceedingly slow, it does represent a substantial\noverhead if every API call doesn't return a response until a given read\nor write to BLOB storage is complete. This can be mitigated by allowing\nthe storage client to return a status code to the calling service based\non the manipulation of some data structure that is held in memory --\nthe cache. The issue with this quick response to a calling service is\nmaintaining consistency across calls.\n\nIdeally, this package would allow multiple clients to access the same BLOB storage, much like databases allow mulitple concurrent connections.\nThe challenge this introduces is maintaining a cannocial state in BLOB\nstorage when multiple clients are manipulating the data stored within.\nAt this point, I only need my site to manipulate the data which is\npersisted in BLOB storage, so ensuring consistency across clients can\nbe a problem to solve later, so long as I leave room in the code for\na means of ensuring eventual consistency.\n\n### Cost\n\nFrom a cost perspective, I'm going to use Azure Cache for Redis as a\npoint of comparison. Azure provides three tiers of this cache: Basic,\nStandard and Premium, which are meant for Development, Production and\nEnterprise environments, respectively. The lowest price option available\nis in the Basic tier, for a 250mb cache, which allows 256 concurrent\nconnections, has no SLA, failover or replication guarentees, etc., etc.\nIt is essentially just for development, and runs $0.022 per hour of\nuptime. Realistically, even I would rule that out for a production\nenvironment - losing the cache without any means of restoring the\ncontents sounds awful.\n\nThe cheapest option in the Standard tier is similar size, network\nperformance and support for concurrent connections, but Azure provides\nsomething of a security blanket for ensuring availability and failover\nin case the cache goes down. This lowest option goes for $0.028 per\nhour of uptime.\n\nSince their are 24 hours in a day, and... about 365.25 days in a year,\nthe cost per month on this lowest of Standard tier options is $20.454.\nThat's 4 times what I pay for my Digital Ocean droplet which hosts this\nsite, so the temptation is to install Redis on my droplet and\ncall it a day. However, that doesn't meet my final goal for this project.\n\n### Reusability\n\nThis is really what I'd like to optimize for - some means of persisting\ndata that I can include in a project without having to consider where\nthat project is deployed, or what language that project is using. That\nmotivates the use of a Docker container which performs the maintanence\nof this global state, and which can be agnostic of which platform it is\nhosted on. Ideally, this container could be included in a docker-compose\nfile, and interacted with by any other container with which it is \ncomposed. I'm not particularly versed in Kubernetes, but I'd hope the\nsame principle holds true should I ever need this service in a\nK8s-hosted service.\n\n## Approach\n\nI'm going to use Azure BLOB storage, as for a single GB of BLOB storage,\nwith <= 10,000 reads and writes per month, the cost would be approximately\n$0.07 per month. Comparing S3, the price is almost identical, although it\ndoes provide more granularity, as request-based costs are per 1,000 not\n10,000. Still, 1 GB of storage accessed 10,000 times in a month would\na cool 7 cents. GCP follows suit - roughly 2 cents for storage and 5 cents\nfor access, although it seems to also support a free tier. Fortunately, I\ncan afford to spend 84 cents a year to store data on a platform with which\nI'm familiar, so I'm going to use Azure.\n\n\n",
                    "PartitionKey": "blog",
                    "title": "Storage Plan, Version 2"
                }
            ],
        };
    }

    componentDidMount() {
        if (!this.props.api) {
            return;
        }
        this.props.api.get('/posts')
            .then(({ data }) => {
                this.setState({
                    posts: data
                });
            });
    }

    render() {
        return (
            <div className='app'>
                <Header />
                <Content>
                    {this.state.posts.map((post, idx) => (
                        <Post
                            {...post}
                            key={`post-${idx}`}
                        />
                    ))}
                </Content>
            </div>
        )
    }
}
