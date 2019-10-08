FROM ubuntu:16.04

LABEL maintainer="Tim Woods tim.woods.tw@gmail.com"
RUN apt-get update
RUN apt-get install -y python3 python3-dev python3-pip nginx
RUN pip3 install --upgrade pip

COPY ./ /app
WORKDIR /app
RUN pip3 install -r requirements.txt

EXPOSE 5000

ENTRYPOINT [ "python3" ]
CMD [ "routes.py" ]