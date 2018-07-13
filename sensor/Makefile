build:
	dep ensure
	env GOOS=linux GOARCH=arm GOARM=5 go build -ldflags="-s -w" -o bin/isBeerCold *.go
	# send to raspi
	scp ./bin/isBeerCold $(cat raspi.conf):~/isBeerCold