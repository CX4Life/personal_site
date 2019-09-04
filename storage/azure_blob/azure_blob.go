package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"github.com/Azure/azure-storage-blob-go/azblob"
	"log"
	"net/http"
	"net/url"
	"os"
)

var accountName string
var accountKey string
var credentials *azblob.SharedKeyCredential

// GetRequest defines the structure of GetBlob requests
type GetRequest struct {
	containerName string
	blobName      string
}

// SetRequest defines the structure of SetBlob requests
type SetRequest struct {
	containerName string
	blobName      string
	contents      []byte
}

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
	p := azblob.NewPipeline(
		getCredentials(),
		azblob.PipelineOptions{})

	var requestBody GetRequest
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&requestBody)
	handleError(err)

	URL, _ := url.Parse(
		fmt.Sprintf("https://%s.blob.core.windows.net/%s", accountName, requestBody.containerName))

	containerURL := azblob.NewContainerURL(*URL, p)
	blobURL := containerURL.NewBlockBlobURL(requestBody.blobName)
	ctx := context.Background()
	downloadResponse, err := blobURL.Download(ctx, 0, azblob.CountToEnd, azblob.BlobAccessConditions{}, false)
	handleError(err)

	bodyStream := downloadResponse.Body(azblob.RetryReaderOptions{MaxRetryRequests: 20})
	downloadedData := bytes.Buffer{}
	_, err = downloadedData.ReadFrom(bodyStream)
	handleError(err)
	w.Header().Set("Content-Type", "application/json")
	w.Write(downloadedData.Bytes())
}

func setBlob(w http.ResponseWriter, r *http.Request) {
	p := azblob.NewPipeline(
		getCredentials(),
		azblob.PipelineOptions{})

	var requestBody SetRequest
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&requestBody)
	handleError(err)

	URL, _ := url.Parse(
		fmt.Sprintf("https://%s.blob.core.windows.net/%s", accountName, requestBody.containerName))

	containerURL := azblob.NewContainerURL(*URL, p)
	ctx := context.Background() // This example uses a never-expiring context
	_, err = containerURL.Create(ctx, azblob.Metadata{}, azblob.PublicAccessNone)
	handleError(err)

	blobURL := containerURL.NewBlockBlobURL(requestBody.blobName)
	reader := bytes.NewReader(requestBody.contents)
	_, err = blobURL.Upload(ctx, reader, azblob.BlobHTTPHeaders{}, azblob.Metadata{}, azblob.BlobAccessConditions{})
	handleError(err)

	w.WriteHeader(http.StatusCreated)
}

func main() {
	logpath := os.Getenv("LOG_PATH")
	OpenLogFile(logpath)

	accountName = os.Getenv("AZURE_ACCOUNT_NAME")
	accountKey = os.Getenv("AZURE_STORAGE_KEY")

	if len(accountName) == 0 || len(accountKey) == 0 {
		log.Fatalln("Azure account name or storage key not provided. Exiting.")
	}

	http.HandleFunc("/get", getBlob)
	http.HandleFunc("/set", setBlob)

	log.Fatal(http.ListenAndServe(":3003", LogRequest(http.DefaultServeMux)))
}
