package main

import (
	"embed"
	_ "embed"
	"fmt"
	"math"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/gin-gonic/gin"
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
	ID          int64               `json:"id" binding:"required"`
	User_ID     string              `json:"user_id" binding:"required"`
	Keywords    map[string]struct{} `json:"keywords" binding:"required"`
	Description string              `json:"description" binding:"required"`
	Image       *string             `json:"image,omitempty"`
	Lat         float64             `json:"lat" binding:"required"`
	Lon         float64             `json:"lon" binding:"required"`
	Date_from   time.Time           `json:"date_from" binding:"required"`
	Date_to     *time.Time          `json:"date_to,omitempty"`
}

// Converts an item recieved from POST to the struct that can be stored and returned later via GET.
func ConvertItemPOSTToItems(itemPOST ItemPOST, id int64, dateFrom time.Time, dateTo *time.Time) Item {
	keywordsMap := make(map[string]struct{})
	for _, keyword := range itemPOST.Keywords {
		keywordsMap[keyword] = struct{}{}
	}
	return Item{
		ID:          id,
		User_ID:     itemPOST.User_ID,
		Keywords:    keywordsMap,
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
	itemsMu sync.RWMutex
)

func init() { // initialize map
	items = make(map[int64]Item)
}

var idCounter int64 = 0 // initialise counter

//go:embed README.md
var readme embed.FS

func main() {
	r := gin.Default()

	// Allow CORS using middleware package??? https://github.com/gin-contrib/cors
	r.OPTIONS("/*any", func(c *gin.Context) {
		// Set the appropriate CORS headers
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE")

		// Respond with a 204 status code
		c.Status(204)
	})

	/* Resources to build these functions is from
	https://go.dev/doc/tutorial/web-service-gin */

	// Define route handler at root.
	r.GET("/", RootHandler)

	// Define route handler for POST a single item.
	r.POST("/item", PostItemHandler)

	// Define route handler for GET a single item.
	r.GET("/item/:itemId", GetItemHandler)

	// Define route handler for DELETE a single item.
	r.DELETE("/item/:itemId", DeleteItemHandler)

	// Define route handler for GET multiple items.
	r.GET("/items", GetItemsHandler)

	// Publish on port 8000.
	r.Run(":8000")
}

// Handles HTTP requests to root.
func RootHandler(c *gin.Context) {
	// Read README.md from embedded filesystem.
	readmeBytes, err := readme.ReadFile("README.md")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":       "Internal Server Error",
			"description": "Something went wrong :(",
		})
		return
	}

	// Write README.md to response.
	c.Data(http.StatusOK, "text/html; charset=utf-8", readmeBytes)
}

func PostItemHandler(c *gin.Context) {
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

	currentTime := time.Now().Format("2006-01-02T15:04:05.999999-0000")
	parsedTime, err := time.Parse("2006-01-02T15:04:05.999999-0000", currentTime)
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

	itemsMu.Lock() // Lock item mutex for write, thus locking the Items map.
	defer itemsMu.Unlock()
	items[newId] = StoredData

	c.JSON(http.StatusCreated, StoredData)
}

func GetItemHandler(c *gin.Context) {
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

	itemsMu.RLock() // Lock item mutex for read, thus locking the Items map.
	defer itemsMu.RUnlock()

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

func DeleteItemHandler(c *gin.Context) {
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

	itemsMu.Lock() // Lock item mutex for write, thus locking the Items map.
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
func Contains(itemKeywords map[string]struct{}, queryKeywords []string) bool {
	// Check if all query keywords are present in itemKeywords
	for _, queryKeyword := range queryKeywords {
		if _, exists := itemKeywords[queryKeyword]; !exists {
			return false
		}
	}
	// All query keywords were found in itemKeywords
	return true
}

func GetItemsHandler(c *gin.Context) {

	itemsMu.RLock()
	defer itemsMu.RUnlock()

	// Convert map values to a list (slice) of items.
	var itemList []Item
	for _, item := range items { // Go has no builtin map.values() function, so we iterate over the map as is the idiomatic Go way.
		itemList = append(itemList, item)
	}
	if c.Request.URL.RawQuery == "" {
		c.JSON(http.StatusOK, itemList)
		return
	} else {
		// Retrieve and process query parameters if they exist.
		user_id := c.Query("user_id")
		keywordsParam := c.Query("keywords")
		keywords := strings.Split(keywordsParam, ",")
		lat := c.Query("lat")
		lon := c.Query("lon")
		radius := c.DefaultQuery("radius", "5")
		date_from := c.Query("date_from")
		// date_to := c.DefaultQuery("date_to", time.Now().Format(time.RFC3339))

		/* query algorithm

		get key n = 1
		if key exists, check key values
		if any field contains values that matches to the query string,
		given the defaults if none given, and +- 5 to the latitude/longitude,
		take that key value add to slice1
		n +=1 and check next key

		*/

		itemResults := []Item{}

		for id, item := range items {
			radius, err := strconv.ParseFloat(radius, 64)
			if err != nil {
				c.JSON(http.StatusBadRequest, nil)
				return
			}
			if item.User_ID == user_id {
				itemResults = append(itemResults, items[id])
				continue
			}
			if Contains(item.Keywords, keywords) {
				itemResults = append(itemResults, items[id])
				continue
			}
			// we wont perform validation on already stored lat/long, do at binding?
			lat, _ := strconv.ParseFloat(lat, 64)
			lon, _ := strconv.ParseFloat(lon, 64)

			/* We use haversine packaged provided by: https://pkg.go.dev/github.com/umahmood/haversine
			// to calculate the distance, i.e our radius
			a := haversine.Coord{Lat: item.Lat, Lon: item.Lon}
			b := haversine.Coord{Lat: lat, Lon: lon}
			_, km := haversine.Distance(a, b)
			if km/100 <= radius {
				itemResults = append(itemResults, items[id])
				continue
			}
			*/ // We remove this realistic calculation for a simpler one, remove package.

			// Euclidean distance calculation / two for radius from center.
			distance := math.Sqrt(math.Pow(lat-item.Lat, 2) + math.Pow(lon-item.Lon, 2))
			if distance <= radius {
				itemResults = append(itemResults, items[id])
				continue
			}

			// date_to not required?     "2023-10-19T00:21:33.467886"
			date_from, err := time.Parse("2006-01-02T15:04:05.999999-0000", date_from+"-0000")

			if err == nil {
				fmt.Println("item.Date_from:", item.Date_from)
				fmt.Println("date_from:", date_from)
				if item.Date_from.Before(date_from) {
					itemResults = append(itemResults, items[id])
					continue
				}
			}
		}
		c.JSON(http.StatusOK, itemResults)
	}
}
