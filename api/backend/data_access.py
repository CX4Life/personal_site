import os
import json
import requests

_posts_list_name = "POSTS"
_post_id_counter = "NEXT_POST_ID"


class DataAccess:
    def __init__(self):
        self._storageAPI = 'storage'

    def get_posts(self):
        foo = requests.post('http://{}/get'.format(os.environ['STORAGE_URL']), json={
            'containerName': 'test-container',
            'blobName': 'postman-1'})
        print(foo.content)
        return {'success': True}

    # def get_post(self, id):
    #     ret = self._redis.hget(_posts_list_name, id)
    #     return json.loads(ret)

    # def add_post(self, post):
    #     id = self._redis.incr(_post_id_counter, 1)
    #     self._redis.hset(_posts_list_name, id, json.dumps(post))
    #     return json.dumps({"post_id": id})

