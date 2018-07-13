build:
	dep ensure
	env GOOS=linux go build -ldflags="-s -w" -o bin/beerService beerService/main.go
	serverless deploy
