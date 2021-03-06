package main

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

// Item is interface when getting dynamo data
type Item struct {
	Time int64   `json:"time"`
	Temp float64 `json:"temp"`
}

// ResponseJSON stuct which will sent back
type ResponseJSON struct {
	Times  []string  `json:"times"`
	Values []float64 `json:"values"`
}

// Handler handles
func Handler() (events.APIGatewayProxyResponse, error) {
	fmt.Println("Send response")

	// Create AWS connection
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String("eu-west-1"),
	})
	if err != nil {
		log.Fatal("Error creating session", err)
	}

	// Dynamo client
	svc := dynamodb.New(sess)

	// Start getting data
	result, err := svc.Scan(&dynamodb.ScanInput{
		TableName: aws.String("IsBeerCold"),
	})
	if err != nil {
		log.Fatal("Error getting item(s)")
	}

	var res []Item
	err = dynamodbattribute.UnmarshalListOfMaps(result.Items, &res)

	var times []string
	var values []float64

	loc, _ := time.LoadLocation("Europe/Helsinki")

	for i := range res {
		t := time.Unix(res[i].Time, 0).In(loc)
		times = append(times, t.Format("15:04"))

		values = append(values, res[i].Temp)
	}

	// Limit must be positive
	limit := len(values) - 120
	if limit < 0 {
		limit = 0
	}

	r, _ := json.Marshal(ResponseJSON{
		Values: values[limit:],
		Times:  times[limit:],
	})

	if json.Valid(r) {
		return events.APIGatewayProxyResponse{
			Body:       string(r),
			StatusCode: 200,
			Headers: map[string]string{
				"Content-Type":                "application/json",
				"Access-Control-Allow-Origin": "*",
			},
		}, nil

	}

	return events.APIGatewayProxyResponse{
		Body:       "no",
		StatusCode: 200,
	}, nil

}

func main() {
	lambda.Start(Handler)
	// Handler()
}
