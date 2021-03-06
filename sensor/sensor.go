package main

import (
	"bufio"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"regexp"
	"strconv"
	"time"
)

// Sensor is interface for temp sensor
type Sensor struct {
	Name  string  `json:"Name"`
	Value float64 `json:"Temp"`
	Time  int64   `json:"Time"`
	TTL   int64   `json:"ttl"`
}

var tempDeviceFolder = "/sys/bus/w1/devices/"
var tempFileName = "w1_slave"

var sensors []Sensor

// FindSensors will find temp sensors from Pi file system
func FindSensors(sensors *[]Sensor) {
	fmt.Println("Find sensors")
	files, err := ioutil.ReadDir(tempDeviceFolder)
	if err != nil {
		log.Fatal(err)
	}

	for _, f := range files {
		sensorRegexp := regexp.MustCompile("^28.*$")

		if sensorRegexp.MatchString(f.Name()) {
			// register sensor
			*sensors = append(*sensors, Sensor{
				Name:  f.Name(),
				Value: 0.0,
				Time:  time.Now().Unix(),
				TTL:   0,
			},
			)
		}
	}
}

// ReadTemps will read temps and return them
func ReadTemps() []Sensor {
	if len(sensors) == 0 {
		FindSensors(&sensors)
	}
	for i := range sensors {
		ReadTemp(&sensors[i])
	}

	return sensors
}

// ReadTemp will read temp as int from sensor path
func ReadTemp(sensor *Sensor) {
	fmt.Println("Read temp")
	file, err := os.Open(tempDeviceFolder + sensor.Name + "/" + tempFileName)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	// Regex
	var validTemp = regexp.MustCompile(`t=([0-9]*$)`)

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		if validTemp.MatchString(scanner.Text()) {
			m := validTemp.FindStringSubmatch(scanner.Text())
			if l := len(m); l > 1 {
				temp, err := strconv.Atoi(m[1])
				if err != nil {
					log.Fatal(err)
				}
				sensor.Value = float64(temp) / 1000
				sensor.Time = time.Now().Unix()
				sensor.TTL = time.Now().Add(
					time.Hour * time.Duration(48),
				).Unix()

				fmt.Println("set temp", sensor)
			}
		}
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
}
