package main

import (
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"log"
	"net/http"
	"os"
	"time"
)

var users = map[string]string{
	"tim": os.Getenv("TIM_PASSWORD"),
}

// Credentials represents user
type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// Claims holds the jwt claims
type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

// TokenJSON is used to marshal and unmarshal requests to validate issued JWTs
type TokenJSON struct {
	Token string `json:"token"`
}

func issueJwt(w http.ResponseWriter, r *http.Request) {
	var creds Credentials
	err := json.NewDecoder(r.Body).Decode(&creds)

	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if creds.Password != users[creds.Username] {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	expiration := time.Now().Add(time.Hour)
	claims := &Claims{
		Username: creds.Username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expiration.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SIGNING_KEY")))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	payload, err := json.Marshal(TokenJSON{tokenString})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(payload)
}

func verifyJwt(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.Header, r.Body, r.URL, r.RemoteAddr)
	var tokenStruct TokenJSON
	err := json.NewDecoder(r.Body).Decode(&tokenStruct)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	claims := &Claims{}

	// Parse the JWT string and store the result in `claims`.
	// Note that we are passing the key in this method as well. This method will return an error
	// if the token is invalid (if it has expired according to the expiry time we set on sign in),
	// or if the signature does not match
	tkn, err := jwt.ParseWithClaims(tokenStruct.Token, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SIGNING_KEY")), nil
	})

	if !tkn.Valid {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	w.Write([]byte(fmt.Sprintf("Welcome %s!", claims.Username)))
}

func openLogFile(logfile string) {
	if logfile != "" {
		lf, err := os.OpenFile(logfile, os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0640)

		if err != nil {
			log.Fatal("OpenLogfile: os.OpenFile:", err)
		}

		log.SetOutput(lf)
	}
}

func logRequest(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s %s %s\n", r.RemoteAddr, r.Method, r.URL, r.Body)
		handler.ServeHTTP(w, r)
	})
}

func main() {
	logpath := os.Getenv("LOG_PATH")
	openLogFile(logpath)

	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)

	http.HandleFunc("/issue", issueJwt)
	http.HandleFunc("/verify", verifyJwt)

	log.Fatal(http.ListenAndServe(":3001", logRequest(http.DefaultServeMux)))
}
