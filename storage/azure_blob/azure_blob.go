package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/Azure/azure-storage-blob-go/azblob"
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

// GetRequest defines the structure of GetBlob requests
type GetRequest struct {
	ContainerName string `json:"containerName"`
	BlobName      string `json:"blobName"`
}

// GetResponse defines the response to GetBlob requests
type GetResponse struct {
	SASToken string `json:"sasToken"`
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
	credentials := getCredentials()

	var requestBody GetRequest
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&requestBody)
	handleError(err)

	sasQueryParams, err := azblob.BlobSASSignatureValues{
		Protocol:      azblob.SASProtocolHTTPS,
		ExpiryTime:    time.Now().UTC().Add(2 * time.Hour),
		ContainerName: requestBody.ContainerName,
		BlobName:      requestBody.BlobName,
		Permissions:   azblob.BlobSASPermissions{Add: false, Read: true, Write: false}.String(),
	}.NewSASQueryParameters(credentials)

	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	qp := sasQueryParams.Encode()
	blobURLWithSASToken := fmt.Sprintf("https://%s.blob.core.windows.net/%s/%s?%s",
		accountName, requestBody.ContainerName, requestBody.BlobName, qp)
	payload, err := json.Marshal(GetResponse{SASToken: blobURLWithSASToken})

	w.Header().Set("Content-Type", "application/json")
	w.Write(payload)
}

func copyFile(r io.ReadSeeker, w io.WriteSeeker) error {
	_, err := io.Copy(w, r)
	return err
}

func setBlob(w http.ResponseWriter, r *http.Request) {
	p := azblob.NewPipeline(
		getCredentials(),
		azblob.PipelineOptions{})

	r.ParseMultipartForm(10 << 20)
	containerName := r.FormValue("containerName")

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

	http.HandleFunc("/get", getBlob)
	http.HandleFunc("/set", setBlob)

	log.Fatal(http.ListenAndServe(":3003", LogRequest(http.DefaultServeMux)))
}
