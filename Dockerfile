FROM golang:alpine as builder
RUN mkdir /build
ADD . /build
WORKDIR /build
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags '-extldflags "-static"' -o main .

FROM scratch
COPY --from=builder /build/main /app/
COPY /static/stylesheets/* /app/static/stylesheets/
COPY /templates/* /app/templates/
WORKDIR /app
EXPOSE 8080
CMD ["./main"]