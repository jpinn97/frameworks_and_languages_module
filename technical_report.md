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
- **Located in**: `http_server.py`
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

([Am_I_Helpful, 2016](#ref-am_i_helpfulAnswerWhatBacklog2016))

The function serve_app is used to listen for incoming connections, and
handle them. On line 104, the function `s.listen()` is called, which
will block the thread until a connection is made. This means that the
server will not be able to handle any other requests until the current
request is completed.

### (name of Issue 2)

(A code snippet example demonstrating the issue) (Explain why this
pattern is problematic - 40ish words)

### Recommendation

(why the existing implementation should not be used - 40ish words)
(suggested direction - frameworks 40ish words)

## Server Framework Features

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

</div>
