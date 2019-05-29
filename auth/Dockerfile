# STEP 1 build executable binary

FROM golang:alpine AS builder

RUN apk update && apk add --no-cache git
RUN adduser -D -g '' appuser
WORKDIR $GOPATH/src/jwtServer
COPY ./jwtServer $GOPATH/src/jwtServer

RUN go get -d -v
RUN GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o /go/bin/jwtServer

# STEP 2 build minimal image
FROM scratch

COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /go/bin/jwtServer /go/bin/jwtServer

USER appuser
EXPOSE 3001
ENTRYPOINT ["/go/bin/jwtServer"]