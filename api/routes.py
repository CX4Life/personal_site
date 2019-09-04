from flask import Flask, request, Response
from functools import wraps
import requests
import os
import json

from backend.data_access import DataAccess

app = Flask(__name__)
data_access = DataAccess()


def auth_token_valid(token):
    verify_url = "http://{}/verify".format(os.environ["AUTH_URL"])
    r = requests.post(verify_url, json={"token": token})
    body = json.loads(r.content)
    return r.status_code == 200 and body["username"] is not None


def auth_token_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth_token = request.headers.get("Authorization")
        if not auth_token_valid(auth_token):
            return Response("Unauthorized", status=401)
        else:
            return f(*args, **kwargs)

    return wrapper


def load_posts():
    global data_access


def check_post_structure(post_body):
    post_keys = ["title", "created_on", "body"]
    in_post_body = map(lambda key: key in post_body.keys(), post_keys)
    return all(in_post_body)


@app.route("/posts", methods=["GET", "POST"])
@auth_token_required
def get_or_post_posts():
    global data_access
    if request.method == "GET":
        return Response(data_access.get_posts(), mimetype="application/json")
    elif request.is_json and check_post_structure(request.json):
        return Response(
            data_access.add_post(request.json), mimetype="application/json", status=201
        )
    else:
        return Response(status=400)


@app.route("/posts/<int:postID>")
@auth_token_required
def get_post(postID):
    global data_access
    post = data_access.get_post(postID)
    if post is None:
        return Response("Not found", status=404)

    return Response(json.dumps(post), mimetype="application/json")


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
