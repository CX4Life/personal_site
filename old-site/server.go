package main

import (
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
)

func getTemplateFileNames(templateDir string) []string {
	fileInfos, err := ioutil.ReadDir(templateDir)
	if err != nil {
		log.Fatal(err)
	}

	var files []string
	for _, fileInfo := range fileInfos {
		files = append(files, templateDir+fileInfo.Name())
	}
	return files
}

func main() {
	files := getTemplateFileNames("templates/")
	templates := template.Must(template.ParseFiles(files...))

	http.Handle(
		"/static/",
		http.StripPrefix(
			"/static/",
			http.FileServer(
				http.Dir("static"))))

	http.HandleFunc("/test", func(w http.ResponseWriter, r *http.Request) {
		if err := templates.ExecuteTemplate(w, "test.html", nil); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if err := templates.ExecuteTemplate(w, "welcome.html", nil); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	})

	fmt.Println("Listening")
	fmt.Println(http.ListenAndServe(":8080", nil))
}
