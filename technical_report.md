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

``` python
99 . def serve_app(func_app, port, host=''):
100.    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
101.        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
102.        s.bind((host, port))
103.        while True:
104.             s.listen()
105.            try:
106.                conn, addr = s.accept()
107.            except KeyboardInterrupt as ex:
108.                break
109.            with conn:
```

The function serve_app is used to listen for incoming connections, and
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

``` python
110. #log.debug(f'Connected by ')
111. #while True:
112.     data = conn.recv(65535)  # If the request does not come though in a single recv/packet then this server will fail and will not composit multiple TCP packets. Sometimes the head and the body are sent in sequential packets. This happens when the system switches task under load.
113.     #if not data: break
114.     try:
115.         request = parse_request(data)
116.     except InvalidHTTPRequest as ex:
117.         log.exception("InvalidHTTPRequest")
118.         continue
119. 
120.     # HACK: If we don't have a complete message - try to botch another recv - I feel dirty doing this 
121.     # This probably wont work because utf8 decoded data will have a different content length 
122.     # This needs more testing
123.     while int(request.get('content-length', 0)) > len(request['body']):
124.         request['body'] += conn.recv(65535).decode('utf8')
```

The function struggles with handling TCP data that arrives in fragments,
attempting to make additional recv calls to gather more data. It relies
on the content-length header to decide if further recv calls are
necessary. However, this approach fails to properly decode non-UTF-8
data, such as binary image data. Additionally, UTF-8’s variable-width
encoding has multi-byte characters such as “C3 A9” occupying two bytes
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

``` javascript
402. function renderItems(data) {
403.     const $item_list = document.querySelector(`[data-page="items"] ul`);
404.     const new_item_element = () => document.querySelector(`[data-page="items"] li`).cloneNode(true);
405. 
406.     for (let item_data of data) {
407.         const $new_item_element = new_item_element();
408.         $item_list.appendChild($new_item_element);
409.         renderDataToTemplate(item_data, $new_item_element, renderItemListFieldLookup);
410.         attachDeleteAction($new_item_element);
411.     }
412. }
413. function render_items(params) {
414.     fetch(`${urlAPI}/items?${new URLSearchParams(params).toString()}`)
415.         .then(response => response.json())
416.         .then(renderItems)
417.         .catch(err => console.error(err));
418. }
```

The DOM is directly manipulated to manage state, for instance the
`document.querySelector` may not be performative on large trees. The DOM
is a hierachical tree structure, the `document.querySelector` function
will traverse the entire tree to find the element. In a commercial
setting, this way of rendering the fetched data and DOM is not scalable
or performant, moreoever, as the application grows teams will struggle
to test and refactor due to the increasing complexity. The list is
returned in full, some clients devices may suffer slower render times as
the large list is rendered in full, due to the iterative and linear
nature of the loop.

### Recommendation

(why the existing implementation should not be used - 40ish words)
(suggested direction - frameworks 40ish words)

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

## Server Framework Features

Server Language: Golang (Go) ([‘Documentation - The Go Programming
Language’, 2023](#ref-DocumentationGoProgramming2023))  
Server Framework: Gin ([‘Documentation’, 2022](#ref-Documentation2022))

### Middleware

(Technical description of the feature - 40ish words) (A code block
snippet example demonstrating the feature) (Explain the
problem-this-is-solving/why/benefits/problems - 40ish words) (Provide
reference urls to your sources of information about the feature -
required)

An important feature of a framework is middleware ([‘Custom Middleware’,
2022](#ref-CustomMiddleware2022)). Middleware is a intermediatary layer
that is used to provide modular pre or post processing of data that is
incoming/outgoing from an application route, whilst maintaining the core
functionality of the routing function.

Feature Reference:

- **Feature Name**: `JSONMiddleware`  
- **Located in**: `server/main.go`  
- **Source Code**: [Link to
  Function](https://github.com/jpinn97/frameworks_and_languages_module/blob/b4f100c7aaab889d54233723247817b870699c80/server/main.go#L44-L149)

``` gin
191 r.POST("/item", JSONMiddleware(), PostItemHandler)
```

([‘Using middleware’, 2022](#ref-UsingMiddleware2022))

When a client POSTs to the `/item` route, the `JSONMiddleware` function
is called before the `PostItemHandler` function.

``` gin
45. func JSONMiddleware() gin.HandlerFunc {
46.     return func(c *gin.Context) {
47.         // Read the request body and store it in a byte slice.
48.         body, err := c.GetRawData()
49.         if err != nil {
50.             c.JSON(400, gin.H{"error": err.Error()})
51.             c.Abort()
52.             return
53.         }
54. 
55.         // Unmarshal the JSON into itemMiddleware
56.         var customItem interface{}
57.         if err := json.Unmarshal(body, &customItem); err != nil {
58.             c.JSON(400, gin.H{"error": err.Error()})
59.             c.Abort()
60.             return
61.         }
62. 
63.         if m, ok := customItem.(map[string]interface{}); ok {
64.             keywordsValue, exists := m["keywords"]
65.             if !exists {
66.                 // 'Keywords' field is not present, handle accordingly or skip it
67.             } else {
68.                 switch keywords := keywordsValue.(type) {
69.                 case string:
70.                     // Handle the case where 'Keywords' is a string
71.                     // Split the string by comma and store in a map
72.                     keywordsList := strings.Split(keywords, ",")
73.                     keywordMap := make(map[string]struct{})
74.                     for _, keyword := range keywordsList {
75.                         keywordMap[keyword] = struct{}{}
76.                     }
77.                     m["keywords"] = keywordMap
78.                 case []interface{}:
79.                     // Handle the case where 'Keywords' is a slice of interfaces
80.                     // Iterate through the elements and process them as needed.
81.                     keywordMap := make(map[string]struct{})
82.                     for _, val := range keywords {
83.                         if keyword, ok := val.(string); ok {
84.                             // Add the string value to the map
85.                             keywordMap[keyword] = struct{}{}
86.                         }
87.                     }
88.                     m["keywords"] = keywordMap
89.                 default:
90.                     c.JSON(400, gin.H{"error": "Invalid 'Keywords' field type"})
91.                     c.Abort()
92.                     return
93. 
...
143. 
144.        // Set the request body to the updated JSON data.
145.        c.Request.Body = io.NopCloser(bytes.NewReader(updatedBody))
146. 
147.        // Call the next handler.
148.        c.Next()
149.    }
150. }
```

The `JSONMiddleware` function is used to pre-process the incoming
request body, perform validation and transformation. This encapulates
the core functionality of the `PostItemHandler` function, which is to
create and store a new item. Furthermore, error handling is done by the
middleware, which prevents propagation of malformed data entering deeper
into the application.

### (name of Feature 2)

(Technical description of the feature - 40ish words) (A code block
snippet example demonstrating the feature) (Explain the
problem-this-is-solving/why/benefits/problems - 40ish words) (Provide
reference urls to your sources of information about the feature -
required)

### (name of Feature 3)

(Technical description of the feature - 40ish words) (A code block
snippet example demonstrating the feature) (Explain the
problem-this-is-solving/why/benefits/problems - 40ish words) (Provide
reference urls to your sources of information about the feature -
required)

## Server Language Features

### (name of Feature 1)

(Technical description of the feature - 40ish words) (A code block
snippet example demonstrating the feature) (Explain the
problem-this-is-solving/why/benefits/problems - 40ish words) (Provide
reference urls to your sources of information about the feature -
required)

### (name of Feature 2)

(Technical description of the feature - 40ish words) (A code block
snippet example demonstrating the feature) (Explain the
problem-this-is-solving/why/benefits/problems - 40ish words) (Provide
reference urls to your sources of information about the feature -
required)

## Client Framework Features

### (name of Feature 1)

(Technical description of the feature - 40ish words) (A code block
snippet example demonstrating the feature) (Explain the
problem-this-is-solving/why/benefits/problems - 40ish words) (Provide
reference urls to your sources of information about the feature -
required)

### (name of Feature 2)

(Technical description of the feature - 40ish words) (A code block
snippet example demonstrating the feature) (Explain the
problem-this-is-solving/why/benefits/problems - 40ish words) (Provide
reference urls to your sources of information about the feature -
required)

### (name of Feature 3)

(Technical description of the feature - 40ish words) (A code block
snippet example demonstrating the feature) (Explain the
problem-this-is-solving/why/benefits/problems - 40ish words) (Provide
reference urls to your sources of information about the feature -
required)

## Client Language Features

### (name of Feature 1)

(Technical description of the feature - 40ish words) (A code block
snippet example demonstrating the feature) (Explain the
problem-this-is-solving/why/benefits/problems - 40ish words) (Provide
reference urls to your sources of information about the feature -
required)

### (name of Feature 2)

(Technical description of the feature - 40ish words) (A code block
snippet example demonstrating the feature) (Explain the
problem-this-is-solving/why/benefits/problems - 40ish words) (Provide
reference urls to your sources of information about the feature -
required)

## Conclusions

(justify why frameworks are recommended - 120ish words) (justify which
frameworks should be used and why 180ish words)

## Notes

- Routing is defined in server.py: [Lines
  9-16](https://github.com/calaldees/frameworks_and_languages_module/blob/0cfd7c18081da94854f2a8423b12c39ac136d19a/example_server/app/server.py#L9-L16).
  Thousands of routes in a single file is not scalable. Each route
  requires its own import.
- CORS seems to be manually embedded in the response here: [Line
  71](https://github.com/calaldees/frameworks_and_languages_module/blob/0cfd7c18081da94854f2a8423b12c39ac136d19a/example_server/app/http_server.py#L71).
- Middleware is used to build modularality into an application. It’s
  used to enable customization and or modification of data incoming and
  outgoing from a route. This enables a routes core functionallity to be
  left intact.

<div id="refs" class="references csl-bib-body">

<div id="ref-am_i_helpfulAnswerWhatBacklog2016" class="csl-entry">

Am_I_Helpful (2016) ‘Answer to "What is "backlog" in TCP connections?"’,
*Stack Overflow*. Available at: <https://stackoverflow.com/a/36596724>
(Accessed: 29 December 2023).

</div>

<div id="ref-CustomMiddleware2022" class="csl-entry">

‘Custom Middleware’ (2022) *Gin Web Framework*. Available at:
<https://gin-gonic.com/docs/examples/custom-middleware/> (Accessed: 3
January 2024).

</div>

<div id="ref-Documentation2022" class="csl-entry">

‘Documentation’ (2022) *Gin Web Framework*. Available at:
<https://gin-gonic.com/docs/> (Accessed: 2 January 2024).

</div>

<div id="ref-DocumentationGoProgramming2023" class="csl-entry">

‘Documentation - The Go Programming Language’ (2023). Available at:
<https://go.dev/doc/> (Accessed: 2 January 2024).

</div>

<div id="ref-NetIncreaseSOMAXCONN2019" class="csl-entry">

‘Net: Increase SOMAXCONN to 4096 - kernel/git/torvalds/linux.git - Linux
kernel source tree’ (2019). Available at:
<https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=19f92a030ca6d772ab44b22ee6a01378a8cb32d4>
(Accessed: 30 December 2023).

</div>

<div id="ref-SocketLowlevelNetworking2023" class="csl-entry">

‘Socket <span class="nocase">Low-level</span> networking interface’
(2023) *Python documentation*. Available at:
<https://docs.python.org/3/library/socket.html> (Accessed: 30 December
2023).

</div>

<div id="ref-StateSnapshotReact2024" class="csl-entry">

‘State as a Snapshot React’ (2024). Available at:
<https://react.dev/learn/state-as-a-snapshot> (Accessed: 2 January
2024).

</div>

<div id="ref-UnicodeDecodeErrorPythonWiki2008" class="csl-entry">

‘UnicodeDecodeError - Python Wiki’ (2008). Available at:
<https://wiki.python.org/moin/UnicodeDecodeError> (Accessed: 1 January
2024).

</div>

<div id="ref-UsingMiddleware2022" class="csl-entry">

‘Using middleware’ (2022) *Gin Web Framework*. Available at:
<https://gin-gonic.com/docs/examples/using-middleware/> (Accessed: 3
January 2024).

</div>

<div id="ref-UTF82023" class="csl-entry">

‘UTF-8’ (2023) *Wikipedia* \[Preprint\]. Available at:
[https://en.wikipedia.org/w/index.php?title=UTF-8\\oldid=1191368954](https://en.wikipedia.org/w/index.php?title=UTF-8\&oldid=1191368954)
(Accessed: 1 January 2024).

</div>

</div>
