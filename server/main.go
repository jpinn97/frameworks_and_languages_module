package main

import (
	"bytes"
	"embed"
	"encoding/json"
	"fmt"
	"io"
	"math"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/mitchellh/mapstructure"
	"github.com/russross/blackfriday/v2"
)

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

type itemMiddleware struct {
	User_ID     string              `json:"user_id" binding:"required"`
	Keywords    map[string]struct{} `json:"keywords" binding:"required"`
	Description string              `json:"description" binding:"required"`
	Image       *string             `json:"image,omitempty"`
	Lat         float64             `json:"lat" binding:"required"`
	Lon         float64             `json:"lon" binding:"required"`
}

func JSONMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Read the request body and store it in a byte slice.
		body, err := c.GetRawData()
		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		// Unmarshal the JSON into itemMiddleware
		var customItem interface{}
		if err := json.Unmarshal(body, &customItem); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		if m, ok := customItem.(map[string]interface{}); ok {
			keywordsValue, exists := m["keywords"]
			if !exists {
				// 'Keywords' field is not present, handle accordingly or skip it
			} else {
				switch keywords := keywordsValue.(type) {
				case string:
					// Handle the case where 'Keywords' is a string
					// Split the string by comma and store in a map
					keywordsList := strings.Split(keywords, ",")
					keywordMap := make(map[string]struct{})
					for _, keyword := range keywordsList {
						keywordMap[keyword] = struct{}{}
					}
					m["keywords"] = keywordMap
				case []interface{}:
					// Handle the case where 'Keywords' is a slice of interfaces
					// Iterate through the elements and process them as needed.
					keywordMap := make(map[string]struct{})
					for _, val := range keywords {
						if keyword, ok := val.(string); ok {
							// Add the string value to the map
							keywordMap[keyword] = struct{}{}
						}
					}
					m["keywords"] = keywordMap
				default:
					c.JSON(400, gin.H{"error": "Invalid 'Keywords' field type"})
					c.Abort()
					return
				}
				latValue, exists := m["lat"]
				if !exists {
					// 'lat' field is not present, handle accordingly or skip it
				} else {
					switch lat := latValue.(type) {
					case string:
						latFloat, _ := strconv.ParseFloat(lat, 64)
						m["lat"] = latFloat
					case float64:
						//
					default:
						c.JSON(400, gin.H{"error": "Invalid 'Lat' field type"})
						c.Abort()
						return
					}
				}
				lonValue, exists := m["lon"]
				if !exists {
					// 'lon' field is not present, handle accordingly or skip it
				} else {
					switch lon := lonValue.(type) {
					case string:
						lonFloat, _ := strconv.ParseFloat(lon, 64)
						m["lon"] = lonFloat
					case float64:
						//
					default:
						c.JSON(400, gin.H{"error": "Invalid 'Lon' field type"})
						c.Abort()
						return
					}
				}
			}
		}
		// Marshal the customItem as an itemMiddleware
		var item itemMiddleware
		err = mapstructure.Decode(customItem, &item)
		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			c.Abort()
			return
		}
		// Marshal the updated itemMiddleware back into a byte slice.
		updatedBody, err := json.Marshal(item)
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		// Set the request body to the updated JSON data.
		c.Request.Body = io.NopCloser(bytes.NewReader(updatedBody))

		// Call the next handler.
		c.Next()
	}
}

// items map as package-level variable with mutex to ensure concurrency.
var (
	items   map[int64]Item
	keys    []int64
	itemsMu sync.RWMutex
)

func init() { // initialize map
	items = make(map[int64]Item)
	keys = make([]int64, 0)
}

var idCounter int64 = 1 // initialise counter

//go:embed README.md
var readme embed.FS

func main() {
	r := gin.Default()

	// OPTIONS request handler
	r.OPTIONS("/*any", func(c *gin.Context) {
		// Set the appropriate CORS headers
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE")
		c.Header("Access-Control-Allow-Headers", "Content-Type")

		// Respond with a 204 status code
		c.Status(204)
	})
	// CORS using gin-contrib/cors
	r.Use(cors.New(cors.Config{
		AllowAllOrigins: true,
		AllowMethods:    []string{"POST, GET, OPTIONS, DELETE"},
		AllowHeaders:    []string{"Content-Type"},
	}))

	/* Resources to build these functions is from
	https://go.dev/doc/tutorial/web-service-gin */

	// Define route handler at root.
	r.GET("/", RootHandler)

	// Define route handler for POST a single item.
	r.POST("/item", JSONMiddleware(), PostItemHandler)

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

	// Convert Markdown to HTML.
	htmlContent := blackfriday.Run(readmeBytes) // https://github.com/russross/blackfriday/v2 to render md to html for clients.

	// Write HTML to response.
	c.Data(http.StatusOK, "text/html; charset=utf-8", htmlContent)
}

func PostItemHandler(c *gin.Context) {
	// Will attempt to bind to ItemPOST struct.
	var ReceivedData itemMiddleware

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

	StoredData := Item{
		ID:          newId,
		User_ID:     ReceivedData.User_ID,
		Keywords:    ReceivedData.Keywords,
		Description: ReceivedData.Description,
		Image:       ReceivedData.Image,
		Lat:         ReceivedData.Lat,
		Lon:         ReceivedData.Lon,
		Date_from:   parsedTime,
		Date_to:     nil,
	}

	itemsMu.Lock() // Lock item mutex for write, thus locking the Items map.
	defer itemsMu.Unlock()
	items[newId] = StoredData
	keys = append(keys, newId)

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
		fmt.Printf("Before deletion: %+v\n", items)

		// Find the index of the key in the keys slice
		for i, k := range keys {
			if k == id {
				// Remove the key from the keys slice
				keys = append(keys[:i], keys[i+1:]...)
				break
			}
		}

		delete(items, id) // Delete the item from the items map
		fmt.Printf("After deletion: %+v\n", items)
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
	var itemsOrdered []Item
	for _, key := range keys {
		itemsOrdered = append(itemsOrdered, items[key])
	}
	if c.Request.URL.RawQuery == "" {
		c.JSON(http.StatusOK, itemsOrdered)
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
			fmt.Println("no format date_from:", date_from)
			date_from, err := time.Parse("2006-01-02T15:04:05.999999", date_from)
			fmt.Println("format date_from:", date_from)
			if err == nil {
				fmt.Println("item.Date_from:", item.Date_from)
				if item.Date_from.Before(date_from) {
					itemResults = append(itemResults, items[id])
					continue
				}
			}
		}
		c.JSON(http.StatusOK, itemResults)
	}
}
