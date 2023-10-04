package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	/* Resources to build these functions is from
	https://go.dev/doc/tutorial/web-service-gin */

	// Define route handler at root.
	r.GET("/", RootHandler)

	// Define route handler for POST a single item.
	r.GET("/item/", POSTSingleItemHandler)

	// Define route handler for GET a single item.
	r.GET("/item/:itemId/", GETSingleItemHandler)

	// Define route handler for DELETE a single item.
	r.GET("/item/:itemId/", DELETESingleItemHandler)

	// Define route handler for GET multiple items.
	r.GET("/items/", GETMultipleItemsHandler)

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

}

func GETSingleItemHandler(c *gin.Context) {

}

func DELETESingleItemHandler(c *gin.Context) {

}

func GETMultipleItemsHandler(c *gin.Context) {

}
