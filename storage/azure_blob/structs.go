package main

// CreateContainerRequest defines the structure of CreateContainer requests
type CreateContainerRequest struct {
	ContainerName string `json:"containerName"`
}

// UploadBytesRequest defines the structure of JSON uploads to blobs. Contents is base64 encoded bytes
type UploadBytesRequest struct {
	BlobName string `json:"blobName"`
	Contents string `json:"contents"`
}

// ListContainerResponse defines the structure of responses to GET /containers
type ListContainerResponse struct {
	Containers []string `json:"containers"`
}

// ListBlobResponse defines the structure of responses to GET /containers/containerName/blob
type ListBlobResponse struct {
	Blobs []string `json:"blobs"`
}

// GetRequest defines the structure of GetBlob requests
type GetRequest struct {
	ContainerName string `json:"containerName"`
	BlobName      string `json:"blobName"`
}

// GetResponse defines the response to GetBlob requests
type GetResponse struct {
	SASToken string `json:"sasToken"`
}
