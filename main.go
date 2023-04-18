package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"
	"os"
	"sort"
	"strconv"
)

type Score struct {
	Name  string `json:"name"`
	Score string `json:"score"`
	Rank  string `json:"rank"`
	Timer string `json:"timer"`
}

var player string

type Scores []Score

type Page struct {
	Scores     []Score
	Percentile string
	Rank       int
}

func (s Scores) Len() int {
	return len(s)
}

func (s Scores) Less(i, j int) bool {
	if s[i].Score == s[j].Score {
		fmt.Println(s[i].Timer, s[j].Timer, "TIMER")
		return s[i].Timer < s[j].Timer
	}
	return s[i].Score > s[j].Score
}

func (s Scores) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}

func main() {
	fileServer := http.FileServer(http.Dir("./public"))
	http.Handle("/", fileServer)
	http.HandleFunc("/scores", scoresHandler)
	http.HandleFunc("/submit", submitHandler)
	fmt.Println("http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}

func submitHandler(w http.ResponseWriter, r *http.Request) {
	theName := r.FormValue("theName")
	player = theName
	theScore := r.FormValue("theScore")
	theTimer := r.FormValue("theTimer")
	fmt.Println(theName)
	fmt.Println(theScore)
	fmt.Println(theTimer)
	// check each score in the json file and add a rank to each
	scores, _ := readScoresFromFile()
	for i := range scores {
		if scores[i].Name == theName {
			// found an existing score with the same name, update it
			scores[i].Score = theScore
			scores[i].Timer = theTimer
			sort.Sort(Scores(scores))
			for j, score := range scores {
				score.Rank = fmt.Sprintf("%d", j+1)
			}
			writeScoresToFile(scores)
			http.Redirect(w, r, "/scores", http.StatusFound)
			return
		}
	}
	// did not find an existing score with the same name, add a new entry
	scores = append(scores, Score{Name: theName, Score: theScore, Timer: theTimer})
	sort.Sort(Scores(scores))
	for i, score := range scores {
		score.Rank = fmt.Sprintf("%d", i+1)
		writeScoresToFile(scores)
	}
	writeScoresToFile(scores)
	http.Redirect(w, r, "/scores", http.StatusFound)
}

func readScoresFromFile() (Scores, int) {
	// open the existing file for reading
	f, err := os.OpenFile("data.json", os.O_RDWR|os.O_CREATE, 0o644)
	if err != nil {
		fmt.Println(err)
		return nil, 0
	}
	defer f.Close()
	fmt.Println(f)
	// read the existing JSON data into memory
	var jsonData Scores
	dec := json.NewDecoder(f)
	if err := dec.Decode(&jsonData); err != nil && err != io.EOF {
		fmt.Println(err)
		return nil, 0
	}
	fmt.Println(jsonData)

	// update the rank field of each score based on its position in the slice
	sort.Sort(Scores(jsonData))
	for i, score := range jsonData {
		score.Rank = fmt.Sprintf("%d", i+1)
		jsonData[i] = score
	}
	fmt.Println(len(jsonData))
	lenJson := len(jsonData)
	return jsonData, lenJson
}

func writeScoresToFile(scores []Score) {
	// open the existing file for writing
	f, err := os.OpenFile("data.json", os.O_WRONLY|os.O_TRUNC, 0o644)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer f.Close()

	// sort the scores and update the rank field based on their position in the slice
	sort.Sort(Scores(scores))
	for i, score := range scores {
		score.Rank = fmt.Sprintf("%d", i+1)
		scores[i] = score
	}

	// encode the updated JSON data and write it back to the file
	enc := json.NewEncoder(f)
	if err := enc.Encode(scores); err != nil {
		fmt.Println(err)
		return
	}
}

func scoresHandler(w http.ResponseWriter, r *http.Request) {
	scores, len := readScoresFromFile()
	rank, _ := strconv.Atoi(getRank())
	percentile := fmt.Sprintf("%.2f", float64(rank)/float64(len)*100)
	fmt.Println(scores)
	page := Page{Scores: scores, Percentile: percentile, Rank: rank}
	t := template.New("scores")
	t = template.Must(t.ParseFiles("./public/scores.html"))
	t.ExecuteTemplate(w, "scores", page)
}

// function to get player rank by name

func getRank() string {
	theName := player
	scores, _ := readScoresFromFile()
	for i := range scores {
		if scores[i].Name == theName {
			return scores[i].Rank
		}
	}
	return ""
}
