from flask import Flask
import redis
import os

app = Flask(__name__)


@app.route("/redis-check")
def check_redis():
    r = redis.Redis(host="appnet/redis://redis", port=os.environ["REDIS_PORT"], db=0)
    r.set("foo", "bar")
    return '{"foo": "' + r.get("foo") + '"}'


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
