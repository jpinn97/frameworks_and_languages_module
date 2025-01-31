# Technical Report

The purpose of this report is to evaluate and critique the current
framework-less example server and client prototype, and justify and
describe an implementation that includes frameworks and specific
language features. For a simple CRUD (Create, Read, Update, Delete)
Single Page Application (SPA), the usage of frameworks and specific
languages are a necessity for the development of a commercial
application.

Building from scratch may offer complete control over every aspect of
the application if our application was highly unique, but we needn’t
reinvent the wheel. Well-established frameworks generally have large
communities, and thus have a wealth of resources, documentation, and
support in addition to thoroughly tested and community driven features.
Which will enable us to develop faster, and maintain our application
more easily over the long term.

## Critique of Server/Client prototype

### Overview

Commercial applications typically require a server to be scalable,
maintainable, and optimized for performance. Hand-rolling solutions
commonly found in frameworks can lead to challenges in development as
application complexity grows, which occurs as new features are added and
extended to improve customer experience.

This stacks up technical debt, it’s easier to hire developers who are
familiar with frameworks than it’s to hire and train developers with a
custom in-house solution.

### Issue 1

The server is not scalable or capable of asynchronous or concurrent
operations.

Function Reference:

- **Function Name**: `serve_app`
- **Located in**: `example_server/app/http_server.py`
- **Source Code**: [Link to
  Function](https://github.com/calaldees/frameworks_and_languages_module/blob/f396251252434a5a37f29d1ec684ac31d4644bbb/example_server/app/http_server.py#L99-L134)

```python
def serve_app(func_app, port, host=''):
   with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
       s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
       s.bind((host, port))
       while True:
            s.listen()
           try:
               conn, addr = s.accept()
           except KeyboardInterrupt as ex:
               break
           with conn:
```

The function `serve_app` is used to listen for incoming connections, and
handle them. On line 104, the function `s.listen()` is called, which
will block the thread until a connection is made. This means that the
server will not be able to handle any other requests until the current
request is completed. Furthermore, according to ([Am_I_Helpful,
2016](#ref-am_i_helpfulAnswerWhatBacklog2016)) and ([‘Socket
<span class="nocase">Low-level</span> networking interface’,
2023](#ref-SocketLowlevelNetworking2023)), the backlog size is
influenced by the operating system (OS)’s SOMAXCONN, Linux is currently
set to 4096 ([‘Net: Increase SOMAXCONN to 4096 -
kernel/git/torvalds/linux.git - Linux kernel source tree’,
2019](#ref-NetIncreaseSOMAXCONN2019)), the large buffer of unaccepted
connections will cause clients to experience latency if the server is
under heavy load due to the sequential handling of requests.

```python
#log.debug(f'Connected by ')
#while True:
data = conn.recv(65535)  # If the request does not come though in a single recv/packet then this server will fail and will not composit multiple TCP packets. Sometimes the head and the body are sent in sequential packets. This happens when the system switches task under load.
#if not data: break
try:
    request = parse_request(data)
except InvalidHTTPRequest as ex:
    log.exception("InvalidHTTPRequest")
    continue

# HACK: If we don't have a complete message - try to botch another recv - I feel dirty doing this
# This probably wont work because utf8 decoded data will have a different content length
# This needs more testing
while int(request.get('content-length', 0)) > len(request['body']):
    request['body'] += conn.recv(65535).decode('utf8')
```

The function struggles with handling TCP data that arrives in fragments,
attempting to make additional recv calls to gather more data. It relies
on the content-length header to decide if further recv calls are
necessary. However, this approach fails to properly decode non-UTF-8
data, such as binary image data. Additionally, UTF-8’s variable-width
encoding has multibyte characters such as “C3 A9” occupying two bytes
and is “é” ([‘UTF-8’, 2023](#ref-UTF82023)) that might be split across
different packets which when decoded could form an illegal sequence,
leading to a UnicodeDecodeError ([‘UnicodeDecodeError - Python Wiki’,
2008](#ref-UnicodeDecodeErrorPythonWiki2008)). As indicated in the
comments on line 121, the actual body size can become larger than what
the content-length suggests as data size increases once decoded. The
server will drop the connection if the content-length is exceeded, which
will result in a broken image or data corruption.

Finally, the function has no error handling in the case of timeouts or
resource exhaustion.

### Issue 2

File Reference:

- **File Name**: `index.html`
- **Location**: `example_client/index.html`
- **Description**: The example client.
- **Source Code**: [Link to
  File](https://github.com/calaldees/frameworks_and_languages_module/blob/0f55f66639768032a3f0c0d795e6517ca52f0a11/example_client/index.html)

A number of functions such as `renderItems`, `renderDataToTemplate`,
`attachDeleteAction`, and `clear_node` directly manipulate the DOM. This
is generally not recommended to do in such vast amounts. Especially when
the functions are tightly coupled.

Take for example the functions
[`renderItems`](https://github.com/calaldees/frameworks_and_languages_module/blob/0f55f66639768032a3f0c0d795e6517ca52f0a11/example_client/index.html#L402-L418)
and `render_items`:

```javascript
function renderItems(data) {
  const $item_list = document.querySelector(`[data-page="items"] ul`);
  const new_item_element = () =>
    document.querySelector(`[data-page="items"] li`).cloneNode(true);

  for (let item_data of data) {
    const $new_item_element = new_item_element();
    $item_list.appendChild($new_item_element);
    renderDataToTemplate(
      item_data,
      $new_item_element,
      renderItemListFieldLookup
    );
    attachDeleteAction($new_item_element);
  }
}
function render_items(params) {
  fetch(`${urlAPI}/items?${new URLSearchParams(params).toString()}`)
    .then((response) => response.json())
    .then(renderItems)
    .catch((err) => console.error(err));
}
```

The DOM is directly manipulated to manage state, for instance the
`document.querySelector` may not be performative on large trees. The DOM
is a hierarchical tree structure, the `document.querySelector` function
will traverse the entire tree to find the element. In a commercial
setting, this way of rendering the fetched data and DOM is not scalable
or performant, moreover, as the application grows teams will struggle to
test and refactor due to the increasing complexity. The list is returned
in full, some clients devices may suffer slower render times as the
large list is rendered in full, due to the iterative and linear nature
of the loop.

### Issue 3

Class Reference: - **Class Names**: `LatLon`, `LatLonRange`

- **Located in**: `example_client/index.html`
- **Source Code**: [Link to
  Classes](https://github.com/calaldees/frameworks_and_languages_module/blob/0f55f66639768032a3f0c0d795e6517ca52f0a11/example_server/app/datamodel.py#L4-L33)

The `LatLon` and `LatLonRange` classes are used to create tuples of
coordinates, and later to test if an item is within the range of another
item. These classes are very basic, and have no validation, are very
basic and have very little regard to efficiency.

```python
class LatLon(NamedTuple):
    lat: float
    lon: float
    @staticmethod
    def from_dict(data):
        try:
            return LatLon(*tuple(float(data[i]) for i in ('lat', 'lon')))
        except (KeyError, TypeError):
            return None
class LatLonRange(NamedTuple):
    lat: float
    lon: float
    radius: float
    @staticmethod
    def from_dict(data):
        try:
            return LatLonRange(*tuple(float(data[i]) for i in ('lat', 'lon', 'radius')))
        except (KeyError, TypeError):
            return None
    def in_range(self, latlon:LatLon) -> bool:
        if isinstance(latlon, dict):
            latlon = LatLon.from_dict(latlon)
        if not latlon:
            return False
        return \
            (latlon.lat > self.lat - self.radius) and \
            (latlon.lat < self.lat + self.radius) and \
            (latlon.lon > self.lon - self.radius) and \
            (latlon.lon < self.lon + self.radius) and \
        True # <---------- SERVES NO PURPOSE
```

Firstly, the `LatLon` class has no validation, allowing invalid
coordinates to be created. The `in_range` function has linear
performance scaling, as it will perform 4 comparisons for every item in
the database. In a commercial setting, for this type of application,
planning for hundreds of thousands if not millions of items is ideal. At
this level, the performance of the `in_range` function will be
unacceptable, and will need to be refactored to use a more efficient
algorithm as wasted resources will be costly, and also lead to a poor
customer experience. A better approach would be to use an interim
solution like GeoPandas ([‘Documentation GeoPandas
0+untagged.50.Gfb079bf.dirty documentation’,
2024](#ref-DocumentationGeoPandasUntagged2024)) before moving to a more
scalable solution like PostGIS ([‘PostGIS’, 2023](#ref-PostGIS2023)).
GeoPandas is a Python library that provides high-performance,
easy-to-use data structures and operations for manipulating geospatial
data. Such as R-tree, Quadtree, and KD-tree spatial indexes, that work
by reducing the overall search space and time. These indexes make it
easier for the algorithm to find nearer items.

In the future once the commercial application has grown to need a fully
fledged database, PostGIS is a spatial database extender for PostgreSQL
object-relational database. It adds support for geographic objects
allowing location queries to be run in SQL. PostGIS provides spatial
indexing features just like GeoPandas but on a larger scale. It also
provides functions like converting address to lat/long, which would be
useful for the application.

### Recommendation

The existing implementation hand-rolls various features such as decoding
and parsing HTTP requests, that are already implemented in frameworks.
Jamming code together so that it works is not a scalable solution, it’s
not time efficient to develop custom functionality that is already
available in frameworks. Frameworks are designed to provide a higher
level of abstraction, React state management ([‘State as a Snapshot
React’, 2024](#ref-StateSnapshotReact2024)) for example would be better
than the direct DOM manipulating being used, React’s declarative
approach is used to describe what the UI should look like, and React
handles the DOM manipulation for us.

Considering the complex nature of the application, and commercial
scalabality concerns, a database will no doubt be required, which will
neccessitate the usage of something akin to PostGIS.

## Server Framework Features

Server Framework: Gin ([‘Documentation’, 2022](#ref-Documentation2022))

### Middleware

Middleware is an intermediary layer that is used to provide modular pre-
or post-processing of data that is incoming/outgoing from an application
route, whilst maintaining the core functionality of the routing
function.

Feature Reference:

- **Feature Name**: `JSONMiddleware`
- **Located in**: `server/main.go`
- **Source Code**: [Link to
  Function](https://github.com/jpinn97/frameworks_and_languages_module/blob/b4f100c7aaab889d54233723247817b870699c80/server/main.go#L44-L149)
- **Feature Documentation**: [Link to
  Feature](https://gin-gonic.com/docs/examples/custom-middleware/)

```go
r.POST("/item", JSONMiddleware(), PostItemHandler)
```

When a client POSTs to the `/item` route, the `JSONMiddleware` function
is called before the `PostItemHandler` function.

```go
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
..
...

          // Set the request body to the updated JSON data.
          c.Request.Body = io.NopCloser(bytes.NewReader(updatedBody))

          // Call the next handler.
          c.Next()
      }
   }
```

The `JSONMiddleware` function, implemented from the Gin framework
([‘Custom Middleware’, 2022](#ref-CustomMiddleware2022)), is used to
pre-process the incoming request body, perform validation and
transformation of keywords and other field values. The data is modified
to the correct format that the `PostItemHandler` function and server
expects, it then updates the body with the new bytes. The
`PostItemHandler` function is then called, and the request body is
parsed, none the wiser of the middleware modifications.

This encapsulates the core functionality of the `PostItemHandler`
function, which is to create and store a new item. Furthermore, error
handling is done by the middleware, which prevents propagation of
malformed data entering deeper into the application. Finally,
componentization increases the maintainability and testability of the
application as changes are isolated to the middleware function.

Gin middleware is preferred over the standard Go `net/http` package: -
Less boilerplate. - pre-built logging, recovery, and static file serving
middleware. - Less cognitive load, the `net/http` package requires the
developer to understand the `http.Handler` interface more deeply.

### Automatic Binding of JSON to custom struct

The `gin.Context` struct is a simplified, and more developer friendly
interface to the `net/http` package. It provides a number of methods for
HTTP requests and response handling, data binding, rendering and
middleware support.

Feature Reference:

- **Feature Name**: `gin.Context` Automatic Model/Binding of JSON to
  custom struct
- **Located in**: `server/main.go`

```go
// Call ShouldBindJSON to attempt to bind the received JSON to Item struct.
if err := c.ShouldBindJSON(&ReceivedData); err != nil {
     c.JSON(http.StatusMethodNotAllowed, gin.H{
         "error":       "Invalid input",
         "description": "Some input fields may be missing",
     })
     return
}
```

```go
 type itemMiddleware struct {
    User_ID     string              `json:"user_id" binding:"required"`
    Keywords    map[string]struct{} `json:"keywords" binding:"required"`
    Description string              `json:"description" binding:"required"`
    Image       *string             `json:"image,omitempty"`
    Lat         float64             `json:"lat" binding:"required"`
    Lon         float64             `json:"lon" binding:"required"`
}
```

The `gin.Context` allows automatic binding and validation of JSON data
to a custom struct, Gin provides the additional `binding` tag option to
the struct fields ([‘Bind form-data request with custom struct’,
2022](#ref-BindFormdataRequest2022)). This allows the developer to
specify the required fields, and the `ShouldBindJSON` ([‘Model binding
and validation’, 2022](#ref-ModelBindingValidation2022)) function will
return an error if the required fields are missing. This saves
development time, as Go requires significantly more boilerplate to
achieve the same functionality through unmarshaling and manual
validation.

### Built-in Rendering

- **Feature Name**: `c.Data`
- **Located in**: `server/main.go`
- **Source Code**: [Link to
  Function](https://github.com/jpinn97/frameworks_and_languages_module/blob/b4f100c7aaab889d54233723247817b870699c80/server/main.go#L221)
- **Feature Documentation**: [Link to
  Feature](https://gin-gonic.com/docs/examples/html-rendering/)

Gin’s c.Data method is a built-in rendering feature for sending raw data
as an HTTP response. It allows setting custom Content-Type headers and
directly writing byte data to the response body, useful for various
content types including HTML.

```gin
220.    // Write README.md to response.
221.    c.Data(http.StatusOK, "text/html; charset=utf-8", readmeBytes)
```

This feature streamlines sending custom content types, like HTML,
without manual data writing and header management. It simplifies
response generation via an API, enhances flexibility, and is beneficial
when serving non-JSON content, such as images or HTML. This allows us to
serve the README.md on Github, and statically at the root of the server
as HTML. Moreover, this feature works for other data types such as JSON,
XML, YAML, and Protobuf which provides additionally extensibility and
flexibility.

## Server Language Features

Server Language: Golang (Go) ([‘Documentation - The Go Programming
Language’, 2023](#ref-DocumentationGoProgramming2023))

### Goroutines and Concurrency

Gin is based off the Go standard library’s `net/http` package, and
spawns one goroutine per connection ([‘Go/src/net/http/server.go at
master $\cdot$ golang/go’, 2023](#ref-GoSrcNet2023)).

```go
func (srv *Server) Serve(l net.Listener) error {
..
go c.serve(connCtx)
}
```

Goroutines are lightweight threads, which have a small, often a few
kilobytes of initial stack space that grows and drinks. Concurrency is
achieved by the Go runtime that manages resources and CPU time of
goroutines, and their state; when a goroutine performs a blocking I/O
operation, it is suspended, and the scheduler can run other goroutines
until the I/O operation completes.

Channels provide a way to synchronize and pass data between goroutines,
ensuring safe and efficient sharing of information ([‘Effective Go - The
Go Programming Language’, 2009](#ref-EffectiveGoGo2009)).

In a multi-core system, the Go runtime will multiplex/interleave
goroutines across multiple OS threads, which enables parallelism,
combined with work stealing; idle threads taking over other busy thread
goroutines to balance load.

Goroutines ensure optimal usage of CPU time and efficiency of resources,
as HTTP requests from connections are handled concurrently, and in
parallel, without blocking the main thread. The scalabality of the
server is proportional to the CPU cores/threads, and memory available.

### Synchronization

Enabling concurrency requires synchronization of certain resources as
the stores items, and keys. The Go standard library provides two
primitives, mutex ([‘Sync package - sync - Go Packages’,
2023](#ref-SyncPackageSync2023)) and atomic ([‘Atomic package -
sync/atomic - Go Packages’, 2023](#ref-AtomicPackageSync2023)):

- **Feature Name**: `Mutual Exclusion Lock, Atomic Primitives`
- **Located in**: `server/main.go`
- **Source Code**: [Link to
  Function](https://github.com/jpinn97/frameworks_and_languages_module/blob/7c30c485d2d33c0666fd4f8360ebcb1c40d07a7e/server/main.go#L230-L275)
- **Feature Documentation**: Mutex: ([‘Sync package - sync - Go
  Packages’, 2023](#ref-SyncPackageSync2023)) Atomic:([‘Atomic package -
  sync/atomic - Go Packages’, 2023](#ref-AtomicPackageSync2023))

```go
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
```

In Go, maps are not concurrently safe. This is because race conditions
or data corruption can occur when goroutines access/modify the map. The
`itemsMu` mutex is used to ensure safe reading and writing of the
`items` map. A goroutine aqcuires the `itemsMu.Lock()` for writing,
performs the modification, and releases lock. In this mean time, other
goroutines are scheduled and blocked from writing. Whilst this is
happening, other functions such as `GetItemHandler` can safely read the
map, as the mutex is not locked for reading.

The atomic indivisible operations `atomic.LoadInt64` and
`atomic.AddInt64` ensure the `idCounter` is safely incremented, and
read, which is used to maintain order of insertion of the `items` map
through the `keys` slice and generate unique IDs for each item.

Take Goroutines 1 and 2, they both attempt a read-write-cycle on
`idCounter` using a low-level CPU instruction compare-and-swap (CAS)
mechanism ([‘Compare-and-swap’, 2023](#ref-Compareandswap2023)). Usually
the Go runtime will schedule Goroutine A, to perform its operation in
entirety without interruption from B.

However, both can occur at roughly the same time:

#### Goroutine 1:

Loads counter value (e.g., 10). Prepares to increment (expected value:
10, new value: 11).

#### Goroutine 2: (roughly at the same time)

Loads counter value (10). Prepares to increment (expected value: 10, new
value: 11).

#### CAS Execution:

Goroutine 1: CAS succeeds, updating counter to 11. Goroutine 2: CAS
fails (expected 10, but it’s now 11), indicating a concurrent
modification.

#### Retry:

Goroutine 2: Reloads counter value (11). Prepares incremented value
(expected: 11, new: 12). CAS succeeds, updating counter to 12.

These primitives are required for handling safe concurrent acccess to
shared-resources in a scalable, high-traffic server.

## Client Framework Features

### Component Based Architecture

In React, a functional component is a Javascript function that is
designed to be modular and reusable. Each component is a function that
returns a React element, their state, logic and rendering is
encapsulated within the function, enhancing maintainability and
organization of the codebase.

Component Reference:

- **Component Name**: `App`
- **Located in**: `client/src/App.tsx`
- **Source Code**: [Link to
  Reference](https://github.com/jpinn97/frameworks_and_languages_module/blob/7c30c485d2d33c0666fd4f8360ebcb1c40d07a7e/client/src/App.tsx#L45-L72)

```javascript
return (
  <div>
    <NavigationBar />

    {/* Main content container */}
    <div className="container mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-200 p-4">
          <PostItemForm onSubmit={getItems} />
        </div>
        <div className="bg-gray-300 p-4">
          {items && (
            <ul className="flex flex-wrap -mx-2">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="px-2 w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3"
                >
                  <ListItem onDeleteItem={onDeleteItem} item={item} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  </div>
);
```

The `App` component splits the UI into dividable components, `ListItem`,
`NavigationBar`, and `PostItemsForm`. This declarative way of describing
the UI, is much more intuitive and readable than any verbose DOM
management. Furthermore, components allow us to reduce DOM manipulation
and improve state management. If we recieve a list of items from the
server, we can simply update the state of the App component, and the
`ListItem` component will automatically re-render with the new data.

### State

Feature Reference:

- **Feature Name**: `State`
- **Located in**: `client/src/App.tsx`
- **Source Code**: [Link to
  Reference](https://github.com/jpinn97/frameworks_and_languages_module/blob/7c30c485d2d33c0666fd4f8360ebcb1c40d07a7e/client/src/App.tsx#L13-L40)

State is a feature that components use to store and manage data
dynamically. State is managed primarily by hooks, when a item is posted
the client will check the server for any updated items, and update the
state of the `App` component. This will automatically re-render the
`ListItem` child components with the new data.

```javascript
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const getItems = async () => {
    try {
      setLoading(true);
      const itemData: Item[] = await apiService.getItems();
      console.log("Items from server:", itemData); // Log the response from the server
      setItems(itemData);
      setLoading(false);
      return itemData;
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onDeleteItem = async (id: number) => {
    await apiService.deleteItem(id);
    // Check if the delete request was successful
    console.log("I just deleted an item!");
    await getItems(); // Fetch the updated list of items
  };

  useEffect(() => {
    console.log("Items:", items);
  }, [items]);
```

The `useState` hook is used to create a state variable, and a function
to update the state variable. In the function `getItems`, updates the
`items` list with the retrieved server data. This simple function
results in the `ListItem` component being rendered with new data. React
under the hood performed the neccessary DOM manipulation to update the
`ListItem` component automatically.

### Props

Feature Reference:

- **Feature Name**: `Props`
- **Located in**: `client/src/components/ListItem.tsx`
- **Source Code**: [Link to
  Reference](https://github.com/jpinn97/frameworks_and_languages_module/blob/7c30c485d2d33c0666fd4f8360ebcb1c40d07a7e/client/src/components/ListItem.tsx#L8-L40)

Props are used to pass arguements (data, functions) unidirectionally
from a parent component to a child component. The `ListItem` component
recieves the `onDeleteItem` function and `item` data from the `App`
component. The `onDeleteItem` function is used to delete an item from
the server, and the `item` data is used to render the item data.

```javascript
function ListItem({ onDeleteItem, item }: ListItemProps) {
  return (
    <div className="border-soiid border-2 border-black max-w-max">
      <div data-field="id" key={item.id}>
        User ID: {item.user_id}
        <br />
        <div data-field="description">Description: {item.description}</div>
        <br />
        <ul>
          Keywords:{" "}
          {Object.keys(item.keywords).map((keyword) => (
            <li key={keyword}>- {keyword}</li>
          ))}
        </ul>
        <img className="object-scale-down h-48 w-96" src={item.image}></img>
        <br />
        Latitude: {item.lat}
        <br />
        Longitude: {item.lon}
        <br />
        Date From: {item.date_from}
        <br />
      </div>
      <button
        data-action="delete"
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => onDeleteItem(item.id)}
      >
        Delete
      </button>
    </div>
  );
}
```

This reusable component, can render any number of items, parsing the
`App` item data allows us to eliminate the need for internal state to
the component. Props enables separations of concerns, as the ListItem is
focused on rendering the item data, and the App component is focused on
managing the state of the application. \## Client Language Features

### Static Typing

TypeScript is a superset of JavaScript that when compiled produces
Javascript. TypeScript’s biggest offering is static typing, JavaScript
is dynamically typed, which means that variables can be assigned any
type of value and are inferred at runtime. TypeScript allows us to
specify the type of a variable, and the compiler will check if the
variable is assigned the correct type. This is useful for catching bugs,
and improving code quality before running the application.

Feature Reference:

- **Feature Name**: `Static Typing`
- **Located in**: `client/src/api_service.ts`
- **Source Code**: [Link to
  Reference](https://github.com/jpinn97/frameworks_and_languages_module/blob/7c30c485d2d33c0666fd4f8360ebcb1c40d07a7e/client/src/api_service.ts#L59-L74)

```typescript
async function postItem<T>(formData: Item): Promise<T> {
  const fullUrl = `${url}/item`;
  const response = await fetch(fullUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return (await response.json()) as T;
}
```

The intended data type is specified when declaring a variable. In the
example above, the `postItem` function is declared to return a generic
type `T`, which is asserted by the
`return (await response.json()) as T;` statement, the function also
expects a `formData` variable of type `Item`. The compiler then analyzes
and checks the code for type safety, and will throw an error if the
variable is assigned the wrong type. This treatment is akin to
guardrails for developers, and enhances overall code structure and
should reduce the likelihood of early runtime errors.

This increases the readability and clarity of the code, as the developer
can more easily understand the types of data that is being passed around
the application, which in a commercial application should reduce the
cognitive load.

### Interfaces

In a commercial application where the codebase is large and complex,
interfaces allow a clear and communicative of defining the structure of
an object, and the types of its properties. Any change to the interface
will cascade to all objects that implement the interface, which is
useful for maintaining consistency across the application.

Feature Reference:

- **Feature Name**: `Interface`
- **Located in**: `client/src/api_service.ts`
- **Source Code**: [Link to
  Reference](https://github.com/jpinn97/frameworks_and_languages_module/blob/7c30c485d2d33c0666fd4f8360ebcb1c40d07a7e/client/src/api_service.ts#L4-L14)

```typescript
export interface Item {
  id?: number;
  user_id: string;
  keywords: { [key: string]: string };
  description: string;
  image?: string;
  lat: number;
  lon: number;
  date_from?: string;
  date_to?: string;
}
```

Think of the interface as a blueprint, any object that implements the
interface must adhere to the blueprint. If an function is expecting an
object of type `Item`, a developer may expect the `lat` or `lon` as a
string. Without an interface, Javascript will be required to infer and
check the type at runtime, furthermore, runtime errors may occur and
cost the developer time to debug.

## Conclusions

In conclusion, the assessment of the prototype server/client application
demonstrates the substantial benefits of employing frameworks in the
development of commercial software, particularly for a CRUD-based Single
Page Application (SPA). Frameworks offer a structured approach,
encapsulating best practices, reducing development time, and enhancing
maintainability. They provide robust solutions to common problems,
allowing developers to focus on unique application features rather than
re-implementing foundational elements.

For the server, the Gin framework in Go is recommended due to its
efficient handling of concurrency with goroutines, robust middleware
support, and intuitive API for handling HTTP requests and JSON data
binding. These features facilitate the creation of scalable,
high-performance web services. The middleware feature, for instance,
streamlines request processing and validation, ensuring data integrity
and application security.

On the client side, React’s component-based architecture is ideal for
managing the SPA’s state and user interface. Its declarative nature
simplifies the rendering process, enhancing the application’s
maintainability and scalability. The usage of TypeScript adds the
benefit of static typing, improving code quality and reducing runtime
errors, which is critical in a commercial environment.

Overall, the combination of Gin and React, complemented by TypeScript,
provides a comprehensive solution for developing scalable, maintainable,
and efficient web applications. Their community support, extensive
documentation, and alignment with modern web development practices make
them a sound choice for this project.

<div id="refs" class="references csl-bib-body">

<div id="ref-am_i_helpfulAnswerWhatBacklog2016" class="csl-entry">

Am*I_Helpful (2016) ‘Answer to "What is "backlog" in TCP connections?"’,
\_Stack Overflow*. Available at: <https://stackoverflow.com/a/36596724>
(Accessed: 29 December 2023).

</div>

<div id="ref-AtomicPackageSync2023" class="csl-entry">

‘Atomic package - sync/atomic - Go Packages’ (2023). Available at:
<https://pkg.go.dev/sync/atomic> (Accessed: 8 January 2024).

</div>

<div id="ref-BindFormdataRequest2022" class="csl-entry">

‘Bind form-data request with custom struct’ (2022) _Gin Web Framework_.
Available at:
<https://gin-gonic.com/docs/examples/bind-form-data-request-with-custom-struct/>
(Accessed: 3 January 2024).

</div>

<div id="ref-Compareandswap2023" class="csl-entry">

‘Compare-and-swap’ (2023) _Wikipedia_ \[Preprint\]. Available at:
[https://en.wikipedia.org/w/index.php?title=Compare-and-swap\\oldid=1189977377](https://en.wikipedia.org/w/index.php?title=Compare-and-swap&oldid=1189977377)
(Accessed: 8 January 2024).

</div>

<div id="ref-CustomMiddleware2022" class="csl-entry">

‘Custom Middleware’ (2022) _Gin Web Framework_. Available at:
<https://gin-gonic.com/docs/examples/custom-middleware/> (Accessed: 3
January 2024).

</div>

<div id="ref-Documentation2022" class="csl-entry">

‘Documentation’ (2022) _Gin Web Framework_. Available at:
<https://gin-gonic.com/docs/> (Accessed: 2 January 2024).

</div>

<div id="ref-DocumentationGoProgramming2023" class="csl-entry">

‘Documentation - The Go Programming Language’ (2023). Available at:
<https://go.dev/doc/> (Accessed: 2 January 2024).

</div>

<div id="ref-DocumentationGeoPandasUntagged2024" class="csl-entry">

‘Documentation GeoPandas 0+untagged.50.Gfb079bf.dirty documentation’
(2024). Available at: <https://geopandas.org/en/stable/docs.html>
(Accessed: 8 January 2024).

</div>

<div id="ref-EffectiveGoGo2009" class="csl-entry">

‘Effective Go - The Go Programming Language’ (2009). Available at:
[https://go.dev/doc/effective\\go](https://go.dev/doc/effective_go)
(Accessed: 8 January 2024).

</div>

<div id="ref-GoSrcNet2023" class="csl-entry">

‘Go/src/net/http/server.go at master $\cdot$ golang/go’ (2023) _GitHub_.
Available at:
[https://github.com/golang/go/blob/8db131082d08e497fd8e9383d0ff7715e1bef478/src/net/http/server.go\\L3285](https://github.com/golang/go/blob/8db131082d08e497fd8e9383d0ff7715e1bef478/src/net/http/server.go#L3285)
(Accessed: 8 January 2024).

</div>

<div id="ref-ModelBindingValidation2022" class="csl-entry">

‘Model binding and validation’ (2022) _Gin Web Framework_. Available at:
<https://gin-gonic.com/docs/examples/binding-and-validation/> (Accessed:
3 January 2024).

</div>

<div id="ref-NetIncreaseSOMAXCONN2019" class="csl-entry">

‘Net: Increase SOMAXCONN to 4096 - kernel/git/torvalds/linux.git - Linux
kernel source tree’ (2019). Available at:
<https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=19f92a030ca6d772ab44b22ee6a01378a8cb32d4>
(Accessed: 30 December 2023).

</div>

<div id="ref-PostGIS2023" class="csl-entry">

‘PostGIS’ (2023) _PostGIS_. Available at: <https://postgis.net/>
(Accessed: 8 January 2024).

</div>

<div id="ref-SocketLowlevelNetworking2023" class="csl-entry">

‘Socket <span class="nocase">Low-level</span> networking interface’
(2023) _Python documentation_. Available at:
<https://docs.python.org/3/library/socket.html> (Accessed: 30 December
2023).

</div>

<div id="ref-StateSnapshotReact2024" class="csl-entry">

‘State as a Snapshot React’ (2024). Available at:
<https://react.dev/learn/state-as-a-snapshot> (Accessed: 2 January
2024).

</div>

<div id="ref-SyncPackageSync2023" class="csl-entry">

‘Sync package - sync - Go Packages’ (2023). Available at:
<https://pkg.go.dev/sync> (Accessed: 8 January 2024).

</div>

<div id="ref-UnicodeDecodeErrorPythonWiki2008" class="csl-entry">

‘UnicodeDecodeError - Python Wiki’ (2008). Available at:
<https://wiki.python.org/moin/UnicodeDecodeError> (Accessed: 1 January
2024).

</div>

<div id="ref-UTF82023" class="csl-entry">

‘UTF-8’ (2023) _Wikipedia_ \[Preprint\]. Available at:
[https://en.wikipedia.org/w/index.php?title=UTF-8\\oldid=1191368954](https://en.wikipedia.org/w/index.php?title=UTF-8&oldid=1191368954)
(Accessed: 1 January 2024).

</div>

</div>
