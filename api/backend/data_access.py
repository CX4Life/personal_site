import os
import json
import requests

_posts_list_name = "POSTS"
_post_id_counter = "NEXT_POST_ID"


class DataAccess:
    def __init__(self):
        self._base_url = 'http://{}'.format(os.environ['STORAGE_URL'])

    def get_posts(self):
        postsURL = '{}/container/posts/blob'.format(self._base_url)

        r = requests.get(postsURL)
        listOfBlobs = json.loads(r.content)['blobs']
        return json.dumps(listOfBlobs)

    def get_post(self, postName):
        postURL = '{}/container/posts/blob/{}'.format(self._base_url, postName)
        r = requests.get(postURL)

        sasToken = json.loads(r.content)['sasToken']
        r = requests.get(sasToken)
        return r.content

    # def add_post(self, post):
    #     id = self._redis.incr(_post_id_counter, 1)
    #     self._redis.hset(_posts_list_name, id, json.dumps(post))
    #     return json.dumps({"post_id": id})

