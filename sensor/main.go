package main

import (
	"fmt"
	"log"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"

	"github.com/aws/aws-sdk-go/aws/session"
)

func main() {
	saveValue()
	count := time.Tick(60 * time.Second)
	for range count {
		saveValue()
	}
}

func saveValue() {
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String("eu-west-1"),
	})
	if err != nil {
		log.Fatal("Error creating session")
	}
	svc := dynamodb.New(sess)
	sensors := ReadTemps()
	av, err := dynamodbattribute.MarshalMap(sensors[0])

	input := &dynamodb.PutItemInput{
		Item:      av,
		TableName: aws.String("IsBeerCold"),
	}

	_, err = svc.PutItem(input)
	if err != nil {
		fmt.Println("Cant put it in")
	}
}
