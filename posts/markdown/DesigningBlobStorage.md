# Designing my Blob storage Docker Container

As I discussed in [this blog post](https://timwoods.dev/posts/2), I'm using
Azure Blob Storage to persist static content for this site. That post motivates
that decision, and the general requirements I'd have of a given solution.
Here, I aim to highlight some design considerations I encountered while writing
the Go API.

## Considerations

- What content is going to be stored there? Markdown files, or JSON?
    - I originally was going to use a JSON-ified version of Markdown to organize
      blog posts, but the only extract data I need in that JSON document that is
      not intrisic to the Markdown file is a title, and a timestamp. After giving
      it some thought, I realized all I really need to do is upload the markdown,
      and use the blob's name as the title, and the created-on timestamp of the
      Blob itself as the post's date.
    - That allows a lot of flexibility, because it means I'm just uploading files
      to Blob storage. Any client that then requests a given blob from the Go API
      then gets those bytes, and can do with them as they please.
- How will I maintain a registry of Blobs?
    - At some point, it may be nice to be able to perform queries across the the
      contents of my Blob storage account, but that's a little bit cumbersome.
      The pattern I like to use for Blob storage is that each "noun" gets its own
      Blob container - Blog posts, Calendar events, Images, etc. would each be
      contained in a blobposts, calendar, or images Blob container, respectively.
      This makes listing each of the available Blobs for a given noun trivial,
      however the grouping or filtering of those Blobs within a container requires
      the use of convention when naming the Blobs, or reliance on timestamps alone.
    - A method that allows more robust queries across Blobs is to create a register
      of Blobs in Table storage. This allows for many attributes of those blobs to
      be broken out into columns of a table. Performing queries against Azure table
      storage is similar to using LINQ in C#, and provides a great deal of flexibility,
      at the added cost and complexity of maintaining the state of the registry.
- How will I secure the blobs?
    - Azure uses Shared Access Signature (or SAS) tokens to provide a secure means of
      access the contents of a blob. The storage container can be set such that access
      to the contents of a Blob is forbidden without a valid, non-expired SAS token.
      This works out great for me, because it fits into the authentication flow of my
      site. My React frontend can request the contents of a Blob from my secured Flask
      API by sending a request along with a valid JWT. The Flask API can make a request
      to my Go Blob API, which gets a SAS token from Azure and returns it to the Flask
      app. The Flask app can then make a request to Azure for the contents of the Blob
      using the SAS token, and return those contents to the React front-end.
    - You probably noticed in that last workflow, there are two "hops" to Azure, which
      isn't ideal. The alternative seems to me to allow the Blob API to communicate with
      the Auth server, but:
        1) I wanted to Blob API container to be as minimal as possible, so it encourages
           me to use it in other projects where I extend it's behavior by wrapping calls
           to the Blob API is some other logic, not by modifying the code within that Blob
           API.
        2) Adding Auth logic to the Blob API duplicates logic that exists in the Flask API.
      That motivates the control flow layed out above.
    