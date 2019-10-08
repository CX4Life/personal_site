from waitress import serve
from flask import Flask, request, Response
from functools import wraps
import requests
import os
import json

from backend.data_access import DataAccess

app = Flask(__name__)
data_access = DataAccess()


def auth_token_valid(token):
    try:
        verify_url = "http://{}/verify".format(os.environ["AUTH_URL"])
        r = requests.post(verify_url, json={"token": token})
        return {"content": r.json, "status": r.status_code}
    except:
        return False


def auth_token_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth_token = request.headers.get("Authorization")
        valid = auth_token_valid(auth_token)
        if valid["status"] != 200:
            return Response("Unauthorized", status=401)
        else:
            return f(*args, **kwargs)

    return wrapper


def check_post_structure(post_body):
    post_keys = ["title", "created_on", "contents"]
    in_post_body = map(lambda key: key in post_body.keys(), post_keys)
    return all(in_post_body)


@app.route("/posts", methods=["POST"])
@auth_token_required
def create_post():
    global data_access
    if request.is_json:
        body = request.json
    else:
        f = request.files.get("file")
        keys = request.form.to_dict()
        body = {
            "contents": f.read().decode("utf-8"),
            "created_on": keys["created_on"],
            "title": keys["title"],
        }

    if not check_post_structure(body):
        return Response("Expecting contents, title and created_on", status=400)

    return Response(data_access.add_post(body), status=201)


@app.route("/posts", methods=["GET"])
def get_posts():
    global data_access
    return Response(data_access.get_posts(), mimetype="application/json")


@app.route("/posts/<postName>")
def get_post(postName):
    global data_access
    post = data_access.get_post(postName)
    if post is None:
        return Response("Not found", status=404)

    return Response(json.dumps(post), mimetype="application/json")


@app.route("/ping")
@auth_token_required
def ping():
    return Response(json.dumps({"party": "hard"}), mimetype="application/json")


if __name__ == "__main__":
    serve(app, host="0.0.0.0", port=5000)
