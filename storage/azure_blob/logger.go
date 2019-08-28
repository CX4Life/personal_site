package main

import (
	"log"
	"net/http"
	"os"
)

// LogRequest wraps http.Handlers and logs the basics of all requests received
func LogRequest(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s %s %s\n", r.RemoteAddr, r.Method, r.URL, r.Body)
		handler.ServeHTTP(w, r)
	})
}

// OpenLogFile opens a log file which is set as the output of log calls
func OpenLogFile(logfile string) {
	if logfile != "" {
		lf, err := os.OpenFile(logfile, os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0640)

		if err != nil {
			log.Fatal("OpenLogFile: os.OpenFile:", err)
		}

		log.SetOutput(lf)
		log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)
	}
}
