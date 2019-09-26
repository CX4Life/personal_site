#!/bin/bash

git pull
docker-compose down
docker-compose build --parallel
docker-compose up -d
