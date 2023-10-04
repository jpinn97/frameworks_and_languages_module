package main

import (
	"net/http"
	"sync"
	"sync/atomic"
	"time"

	"github.com/gin-gonic/gin"
)

// Item Struct is designed to be serialized to and deserialized from JSON. Note optional fields.
type Item struct {
	ID          int64      `json:"id"`
	User_ID     string     `json:"user_id"`
	Keywords    []string   `json:"keywords"`
	Description string     `json:"description"`
	Image       *string    `json:"image,omitempty"`
	Lat         float64    `json:"lat"`
	Long        float64    `json:"long"`
	Date_from   time.Time  `json:"date_from"`
	Date_to     *time.Time `json:"date_to,omitempty"`
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
	var newItem Item

	// Call BindJSON to bind the received JSON to newItem.
	if err := c.BindJSON(&newItem); err != nil {
		c.JSON(http.StatusMethodNotAllowed, gin.H{
			"error":       "Invalid input",
			"description": "Some input fields may be missing",
		})
		return
	}
	newID := generateUniqueID()
	// Add the new item to the locked items map.
	itemsMu.Lock()
	items[newID] = newItem
	itemsMu.Unlock()
	c.JSON(http.StatusCreated, gin.H{"description": "Item created successfully"})
}

func GETSingleItemHandler(c *gin.Context) {

}

func DELETESingleItemHandler(c *gin.Context) {

}

func GETMultipleItemsHandler(c *gin.Context) {

}
