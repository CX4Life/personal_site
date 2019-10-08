import os
import json
import requests

from azure.cosmosdb.table.tableservice import TableService
from azure.cosmosdb.table.models import Entity

from .posts import Posts


class DataAccess:
    def __init__(self):
        account = os.environ["AZURE_ACCOUNT_NAME"]
        key = os.environ["AZURE_STORAGE_KEY"]
        self._table_service = TableService(account_name=account, account_key=key)
        self.posts = Posts(self._table_service)

    def get_posts(self):
        return json.dumps(self.posts.get_posts())

    def get_post(self, post_id):
        return json.dumps(self.posts.get_post(post_id))

    def add_post(self, post):
        return json.dumps(self.posts.add_post(post))
