package main

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github.com/Azure/azure-storage-blob-go/azblob"
	"github.com/gorilla/mux"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"
)

var accountName string
var accountKey string
var credentials *azblob.SharedKeyCredential

// Borrowed from Azure example Go program, ignores if container already exists
func handleError(err error) {
	if err != nil {
		if serr, ok := err.(azblob.StorageError); ok { // This error is a Service-specific
			switch serr.ServiceCode() { // Compare serviceCode to ServiceCodeXxx constants
			case azblob.ServiceCodeContainerAlreadyExists:
				fmt.Println("Received 409. Container already exists")
				return
			}
		}
		log.Fatal(err)
	}
}

func getCredentials() *azblob.SharedKeyCredential {
	if credentials == nil {
		creds, err := azblob.NewSharedKeyCredential(accountName, accountKey)
		if err != nil {
			log.Fatal("Invalid credentials with error: " + err.Error())
		}
		credentials = creds
	}
	return credentials
}

func getBlob(w http.ResponseWriter, r *http.Request) {
	credentials := getCredentials()
	vars := mux.Vars(r)

	sasQueryParams, err := azblob.BlobSASSignatureValues{
		Protocol:      azblob.SASProtocolHTTPS,
		ExpiryTime:    time.Now().UTC().Add(2 * time.Hour),
		ContainerName: vars["containerName"],
		BlobName:      vars["blobName"],
		Permissions:   azblob.BlobSASPermissions{Add: false, Read: true, Write: false}.String(),
	}.NewSASQueryParameters(credentials)

	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	qp := sasQueryParams.Encode()
	blobURLWithSASToken := fmt.Sprintf("https://%s.blob.core.windows.net/%s/%s?%s",
		accountName, vars["containerName"], vars["blobName"], qp)
	payload, err := json.Marshal(GetResponse{SASToken: blobURLWithSASToken})

	w.Header().Set("Content-Type", "application/json")
	w.Write(payload)
}

func copyFile(r io.ReadSeeker, w io.WriteSeeker) error {
	_, err := io.Copy(w, r)
	return err
}

func listBlobs(w http.ResponseWriter, r *http.Request) {
	containerName := mux.Vars(r)["containerName"]
	p := azblob.NewPipeline(
		getCredentials(),
		azblob.PipelineOptions{})

	URL, _ := url.Parse(fmt.Sprintf("https://%s.blob.core.windows.net/%s", accountName, containerName))
	containerURL := azblob.NewContainerURL(*URL, p)

	ctx := context.Background()
	blobs, err := containerURL.ListBlobsFlatSegment(ctx, azblob.Marker{}, azblob.ListBlobsSegmentOptions{})
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	blobNames := []string{}
	for _, v := range blobs.Segment.BlobItems {
		blobNames = append(blobNames, v.Name)
	}

	payload, err := json.Marshal(ListBlobResponse{Blobs: blobNames})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(payload)
}

func uploadBytesToStorage(w http.ResponseWriter, r *http.Request) {
	p := azblob.NewPipeline(
		getCredentials(),
		azblob.PipelineOptions{})

	containerName := mux.Vars(r)["containerName"]

	var uploadRequest UploadBytesRequest
	d := json.NewDecoder(r.Body)
	err := d.Decode(&uploadRequest)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	data, err := base64.StdEncoding.DecodeString(uploadRequest.Contents)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	URL, _ := url.Parse(
		fmt.Sprintf("https://%s.blob.core.windows.net/%s", accountName, containerName))

	ctx := context.Background()
	containerURL := azblob.NewContainerURL(*URL, p)
	blockBlobURL := containerURL.NewBlockBlobURL(uploadRequest.BlobName)
	reader := bytes.NewReader(data)

	_, err = blockBlobURL.Upload(ctx, reader, azblob.BlobHTTPHeaders{}, azblob.Metadata{}, azblob.BlobAccessConditions{})
	if err != nil {
		w.WriteHeader(http.StatusNotModified)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

func listContainers(w http.ResponseWriter, r *http.Request) {
	p := azblob.NewPipeline(
		getCredentials(),
		azblob.PipelineOptions{})

	URL, _ := url.Parse(
		fmt.Sprintf("https://%s.blob.core.windows.net/", accountName))

	s := azblob.NewServiceURL(*URL, p)
	ctx := context.Background()
	containers, err := s.ListContainersSegment(ctx, azblob.Marker{}, azblob.ListContainersSegmentOptions{})
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	containerNames := []string{}
	for _, v := range containers.ContainerItems {
		containerNames = append(containerNames, v.Name)
	}

	payload, err := json.Marshal(ListContainerResponse{Containers: containerNames})
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(payload)
}

func createContainer(w http.ResponseWriter, r *http.Request) {
	p := azblob.NewPipeline(
		getCredentials(),
		azblob.PipelineOptions{})

	var request CreateContainerRequest
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	URL, _ := url.Parse(
		fmt.Sprintf("https://%s.blob.core.windows.net/%s", accountName, request.ContainerName))

	containerURL := azblob.NewContainerURL(*URL, p)
	ctx := context.Background()
	_, err = containerURL.Create(ctx, azblob.Metadata{}, azblob.PublicAccessNone)
	if err != nil {
		w.WriteHeader(http.StatusConflict)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

func uploadFileToStorage(w http.ResponseWriter, r *http.Request) {
	p := azblob.NewPipeline(
		getCredentials(),
		azblob.PipelineOptions{})

	containerName := mux.Vars(r)["containerName"]
	r.ParseMultipartForm(10 << 20)

	f, handler, err := r.FormFile("upload")
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	defer f.Close()

	tempfile, err := os.Create("tempfile")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer os.Remove("tempfile")

	err = copyFile(f, tempfile)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	blobName := handler.Filename
	URL, _ := url.Parse(
		fmt.Sprintf("https://%s.blob.core.windows.net/%s", accountName, containerName))

	containerURL := azblob.NewContainerURL(*URL, p)
	ctx := context.Background()
	_, err = containerURL.Create(ctx, azblob.Metadata{}, azblob.PublicAccessNone)
	handleError(err)

	blobURL := containerURL.NewBlockBlobURL(blobName)
	_, err = azblob.UploadFileToBlockBlob(ctx, tempfile, blobURL, azblob.UploadToBlockBlobOptions{
		BlockSize:   4 * 1024 * 1024,
		Parallelism: 16})

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func main() {
	logpath := os.Getenv("STORAGE_LOG_PATH")
	OpenLogFile(logpath)

	accountName = os.Getenv("AZURE_ACCOUNT_NAME")
	accountKey = os.Getenv("AZURE_STORAGE_KEY")

	if len(accountName) == 0 || len(accountKey) == 0 {
		log.Fatalln("Azure account name or storage key not provided. Exiting.")
	}

	r := mux.NewRouter()

	r.HandleFunc("/container", listContainers).
		Methods("GET")
	r.HandleFunc("/container", createContainer).
		Methods("POST")
	r.HandleFunc("/container/{containerName}/blob", listBlobs).
		Methods("GET")
	r.HandleFunc("/container/{containerName}/blob", uploadFileToStorage).
		Methods("POST").
		Headers("Content-Type", "application/x-www-form-urlencoded")
	r.HandleFunc("/conatiner/{containerName}/blob", uploadBytesToStorage).
		Methods("POST").
		Headers("Content-Type", "application/json")
	r.HandleFunc("/container/{containerName}/blob/{blobName}", getBlob).
		Methods("GET")

	log.Fatal(http.ListenAndServe(":3003", LogRequest(r)))
}
