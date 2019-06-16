import redis
import os
import json

_posts_list_name = "POSTS"
_post_id_counter = "NEXT_POST_ID"


class DataAccess:
    def __init__(self):
        self._redis = redis.Redis(host="redis", password=os.environ["REDIS_PASSWORD"])

    def get_kv(self, key):
        value = self._redis.get(key)
        return json.dumps({key: value})

    def set_kv(self, key, value):
        return self._redis.set(key, value)

    def get_posts(self):
        return json.dumps(self._redis.hgetall(_posts_list_name))

    def get_post(self, id):
        ret = self._redis.hget(_posts_list_name, id)
        return json.loads(ret)

    def add_post(self, post):
        id = self._redis.incr(_post_id_counter, 1)
        self._redis.hset(_posts_list_name, id, json.dumps(post))
        return json.dumps({"post_id": id})

