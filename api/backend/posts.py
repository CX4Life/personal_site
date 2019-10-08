import datetime
from .table_backed import TableBacked


class Posts(TableBacked):
    def __init__(self, table_service):
        super(Posts, self).__init__("posts", table_service)

    @staticmethod
    def _convert_datetimes(entity):
        convert_datetime = (
            lambda val: val.strftime("%Y-%m-%dT%H:%M:%S")
            if isinstance(val, datetime.datetime)
            else val
        )

        return {key: convert_datetime(value) for key, value in entity.items()}

    def get_posts(self):
        posts = self.get_all()
        return [x for x in map(self._convert_datetimes, posts)]

    def get_post(self, post_id, partition="blog"):
        post = self.get_single(partition, post_id)
        return self._convert_datetimes(post)

    def add_post(self, post, partition="blog"):
        return self.add_entity(partition, post)
