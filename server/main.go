package main

import (
	"fmt"
	"net/http"
	"strconv"
	"sync"
	"sync/atomic"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/umahmood/haversine"
)

// Struct for Item schema that is POST to server.
type ItemPOST struct {
	User_ID     string   `json:"user_id" binding:"required"`
	Keywords    []string `json:"keywords" binding:"required"`
	Description string   `json:"description" binding:"required"`
	Image       *string  `json:"image,omitempty"`
	Lat         float64  `json:"lat" binding:"required"`
	Lon         float64  `json:"lon" binding:"required"`
}

// Struct for Item schema that is GET from server.
type Item struct {
	ID          int64      `json:"id" binding:"required"`
	User_ID     string     `json:"user_id" binding:"required"`
	Keywords    []string   `json:"keywords" binding:"required"`
	Description string     `json:"description" binding:"required"`
	Image       *string    `json:"image,omitempty"`
	Lat         float64    `json:"lat" binding:"required"`
	Lon         float64    `json:"lon" binding:"required"`
	Date_from   time.Time  `json:"date_from" binding:"required"`
	Date_to     *time.Time `json:"date_to,omitempty"`
}

// Converts an item recieved from POST to the struct that can be stored and returned later via GET.
func ConvertItemPOSTToItems(itemPOST ItemPOST, id int64, dateFrom time.Time, dateTo *time.Time) Item {
	return Item{
		ID:          id,
		User_ID:     itemPOST.User_ID,
		Keywords:    itemPOST.Keywords,
		Description: itemPOST.Description,
		Image:       itemPOST.Image,
		Lat:         itemPOST.Lat,
		Lon:         itemPOST.Lon,
		Date_from:   dateFrom,
		Date_to:     dateTo,
	}
}

// items map as package-level variable with mutex to ensure concurrency.
var (
	items   map[int64]Item
	itemsMu sync.Mutex
)

func init() { // initialize map
	items = make(map[int64]Item)
}

var idCounter int64 = 0 // initialise counter

func main() {
	r := gin.Default()

	/* Resources to build these functions is from
	https://go.dev/doc/tutorial/web-service-gin */

	// Define route handler at root.
	r.GET("/", RootHandler)

	// Define route handler for POST a single item.
	r.POST("/item", POSTSingleItemHandler)

	// Define route handler for GET a single item.
	r.GET("/item/:itemId", GETSingleItemHandler)

	// Define route handler for DELETE a single item.
	r.DELETE("/item/:itemId", DELETESingleItemHandler)

	// Define route handler for GET multiple items.
	r.GET("/items", GETMultipleItemsHandler)

	// Publish on port 8000.
	r.Run(":8000")
}

// Handles HTTP requests to root.
func RootHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Hello, World!",
	})
}

func POSTSingleItemHandler(c *gin.Context) {
	// Will attempt to bind to ItemPOST struct.
	var ReceivedData ItemPOST

	// Call ShouldBindJSON to attempt to bind the received JSON to Item struct.
	if err := c.ShouldBindJSON(&ReceivedData); err != nil {
		c.JSON(http.StatusMethodNotAllowed, gin.H{
			"error":       "Invalid input",
			"description": "Some input fields may be missing",
		})
		return
	}

	currentTime := time.Now().UTC()
	iso8601Time := currentTime.Format(time.RFC3339Nano)
	parsedTime, err := time.Parse(time.RFC3339Nano, iso8601Time)
	if err != nil {
		fmt.Println("Error parsing time:", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":       "Internal Server Error",
			"description": "Something went wrong :(",
		})
		return
	}

	newId := atomic.LoadInt64(&idCounter) // Safely read counter.
	atomic.AddInt64(&idCounter, 1)        // Safetly increment counter.

	StoredData := ConvertItemPOSTToItems(ReceivedData, newId, parsedTime, nil)

	itemsMu.Lock() // Lock item mutex, thus locking the Items map.
	defer itemsMu.Unlock()
	items[newId] = StoredData

	c.JSON(http.StatusCreated, StoredData)
}

func GETSingleItemHandler(c *gin.Context) {
	itemId := c.Param("itemId") // Retrive itemId from request.

	// Convert the itemID to an integer
	id, err := strconv.ParseInt(itemId, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":       "Invalid item Id",
			"description": "Item ID must be a valid integer",
		})
		return
	}

	itemsMu.Lock()
	defer itemsMu.Unlock()

	// Check if the item with the specified ID exists
	item, exists := items[id]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{
			"error":       "Item not found",
			"description": "No item with the specified ID",
		})
		return
	}

	c.JSON(http.StatusOK, item)
}

func DELETESingleItemHandler(c *gin.Context) {
	itemId := c.Param("itemId") // Retrive itemId from request.

	// Convert the itemID to an integer
	id, err := strconv.ParseInt(itemId, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":       "Invalid item Id",
			"description": "Item ID must be a valid integer",
		})
		return
	}

	itemsMu.Lock()
	defer itemsMu.Unlock()

	// Check if the item with the specified ID exists
	_, exists := items[id]
	if exists { // If true we delete.
		delete(items, id)
		c.JSON(http.StatusNoContent, nil)
	} else { // If false we escape gracefully.
		c.JSON(http.StatusNotFound, gin.H{
			"error":       "Item not found",
			"description": "No item with the specified ID",
		})
		return
	}
}

/*
As Go doesn't contains.. this built-in, inspired by: https://stackoverflow.com/a/10485970
*/
func contains(itemKeywords []string, arrayQueryKeywords []string) bool {
	// Create a map to store the itemKeywords for faster lookup
	keywordMap := make(map[string]bool)

	// Populate the map with itemKeywords
	for _, keyword := range itemKeywords {
		keywordMap[keyword] = true
	}

	// Check if all query keywords are present in itemKeywords
	for _, queryKeyword := range arrayQueryKeywords {
		if _, found := keywordMap[queryKeyword]; !found {
			// If a query keyword is not found in itemKeywords, return false
			return false
		}
	}

	// All query keywords were found in itemKeywords
	return true
}

func GETMultipleItemsHandler(c *gin.Context) {
	// Convert map values to a list (slice) of items.
	var itemList []Item
	for _, item := range items {
		itemList = append(itemList, item)
	}
	if c.Request.URL.RawQuery == "" {
		c.JSON(http.StatusOK, itemList)
		return
	} else {
		// Retrieve and process query parameters if they exist.
		user_id := c.Query("user_id")
		keywords := c.QueryArray("keywords")
		lat := c.Query("lat")
		lon := c.Query("lon")
		radius := c.DefaultQuery("radius", "5")
		date_from := c.Query("date_from")
		date_to := c.DefaultQuery("date_to", time.Now().UTC().Format(time.RFC3339Nano))

		/* query algorithm

		get key n = 1
		if key exists, check key values
		if any field contains values that matches to the query string,
		given the defaults if none given, and +- 5 to the latitude/longitude,
		take that key value add to slice1
		n +=1 and check next key

		*/

		itemResults := []Item{}

		for key, val := range items {
			println(val.ID)
			radius, err := strconv.ParseFloat(radius, 64)
			if err != nil {
				c.JSON(http.StatusBadRequest, nil)
				return
			}
			if val.User_ID == user_id {
				itemResults = append(itemResults, items[key])
				continue
			}
			if contains(val.Keywords, keywords) {
				println(val.Keywords)
				println(keywords)
				itemResults = append(itemResults, items[key])
				continue
			}
			// we wont perform validation on already stored lat/long, do at binding
			lat, _ := strconv.ParseFloat(lat, 64)
			lon, _ := strconv.ParseFloat(lon, 64)

			// We use haversine packaged provided by: https://pkg.go.dev/github.com/umahmood/haversine
			// to calculate the distance, i.e our radius
			a := haversine.Coord{Lat: val.Lat, Lon: val.Lon}
			b := haversine.Coord{Lat: lat, Lon: lon}
			_, km := haversine.Distance(a, b)
			if km <= radius {
				itemResults = append(itemResults, items[key])
				continue
			}
			date_from, _ := time.Parse(time.RFC3339Nano, date_from)
			date_to, _ := time.Parse(time.RFC3339Nano, date_to)

			if val.Date_from.Before(date_from) || (!val.Date_to.IsZero() && val.Date_to.After(date_to)) {
				itemResults = append(itemResults, items[key])
				continue
			}
		}
		c.JSON(http.StatusOK, itemResults)
	}
}
