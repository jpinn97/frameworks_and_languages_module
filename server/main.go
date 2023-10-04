package main

import (
	"fmt"
	"net/http"
	"strconv"
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
	Long        float64  `json:"long" binding:"required"`
}

// Struct for Item schema that is GET from server.
type Item struct {
	ID          int64      `json:"id" binding:"required"`
	User_ID     string     `json:"user_id" binding:"required"`
	Keywords    []string   `json:"keywords" binding:"required"`
	Description string     `json:"description" binding:"required"`
	Image       *string    `json:"image,omitempty"`
	Lat         float64    `json:"lat" binding:"required"`
	Long        float64    `json:"long" binding:"required"`
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
		Long:        itemPOST.Long,
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

var idCounter int64 // initialise counter

func generateUniqueID() int64 {
	atomic.AddInt64(&idCounter, 1)      // Safely increment the counter
	return atomic.LoadInt64(&idCounter) // Safely retrieve the counter value
}

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

	newId := generateUniqueID() // Get Id.
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

	StoredData := ConvertItemPOSTToItems(ReceivedData, newId, parsedTime, nil)

	itemsMu.Lock() // Lock item mutex, thus locking the Items map.
	defer itemsMu.Unlock()
	items[newId] = StoredData

	c.JSON(http.StatusCreated, gin.H{"description": "Item created successfully"})
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

}

func GETMultipleItemsHandler(c *gin.Context) {

}
