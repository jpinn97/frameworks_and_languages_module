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

	// Publish on port 8000.
	r.Run(":8000")
}

// Handles HTTP requests to root.
func RootHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Hello, World!",
	})
}
