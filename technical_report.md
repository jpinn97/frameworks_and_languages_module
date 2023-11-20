Technical Report
================

(intro describing purpose of report - 200ish words)


Critique of Server/Client prototype
---------------------

### Overview
()

### (name of Issue 1)

(A code snippet example demonstrating the issue)
(Explain why this pattern is problematic - 40ish words)

### (name of Issue 2)

(A code snippet example demonstrating the issue)
(Explain why this pattern is problematic - 40ish words)

### Recommendation
(why the existing implementation should not be used - 40ish words)
(suggested direction - frameworks 40ish words)


Server Framework Features
-------------------------

### Middleware


Middleware is used to build modularality into an application. It's used to enable customization and or modification of data incoming and outgoing from a route. This enables a routes core functionallity to be left intact.

```python
def json_response(data, response=None):
    r"""
    >>> json_response({'hello': 'world'}, response={'code': 201})
    {'code': 201, 'Content-type': 'application/json; charset=utf-8', 'body': '{"hello": "world"}'}
    """
    response = response or {}
    response['Content-type'] = 'application/json; charset=utf-8'
    response['body'] = json.dumps(data)
    return response
```

[Implemetation](https://github.com/calaldees/frameworks_and_languages_module/blob/0cfd7c18081da94854f2a8423b12c39ac136d19a/example_server/app/web_utils.py#L4-L12)

This middleware is used to return a response as json.

Ihe response object is modified to include the `Content-type` of `application/json`, and sets the response body to the json encoded data, this ensures all responses are returned as json from every route.

```python


(Technical description of the feature - 40ish words)
(A code block snippet example demonstrating the feature)
(Explain the problem-this-is-solving/why/benefits/problems - 40ish words)
(Provide reference urls to your sources of information about the feature - required)


### (name of Feature 2)

(Technical description of the feature - 40ish words)
(A code block snippet example demonstrating the feature)
(Explain the problem-this-is-solving/why/benefits/problems - 40ish words)
(Provide reference urls to your sources of information about the feature - required)


### (name of Feature 3)

(Technical description of the feature - 40ish words)
(A code block snippet example demonstrating the feature)
(Explain the problem-this-is-solving/why/benefits/problems - 40ish words)
(Provide reference urls to your sources of information about the feature - required)


Server Language Features
-----------------------

### (name of Feature 1)

(Technical description of the feature - 40ish words)
(A code block snippet example demonstrating the feature)
(Explain the problem-this-is-solving/why/benefits/problems - 40ish words)
(Provide reference urls to your sources of information about the feature - required)


### (name of Feature 2)

(Technical description of the feature - 40ish words)
(A code block snippet example demonstrating the feature)
(Explain the problem-this-is-solving/why/benefits/problems - 40ish words)
(Provide reference urls to your sources of information about the feature - required)



Client Framework Features
-------------------------

### (name of Feature 1)

(Technical description of the feature - 40ish words)
(A code block snippet example demonstrating the feature)
(Explain the problem-this-is-solving/why/benefits/problems - 40ish words)
(Provide reference urls to your sources of information about the feature - required)


### (name of Feature 2)

(Technical description of the feature - 40ish words)
(A code block snippet example demonstrating the feature)
(Explain the problem-this-is-solving/why/benefits/problems - 40ish words)
(Provide reference urls to your sources of information about the feature - required)


### (name of Feature 3)

(Technical description of the feature - 40ish words)
(A code block snippet example demonstrating the feature)
(Explain the problem-this-is-solving/why/benefits/problems - 40ish words)
(Provide reference urls to your sources of information about the feature - required)


Client Language Features
------------------------

### (name of Feature 1)

(Technical description of the feature - 40ish words)
(A code block snippet example demonstrating the feature)
(Explain the problem-this-is-solving/why/benefits/problems - 40ish words)
(Provide reference urls to your sources of information about the feature - required)

### (name of Feature 2)

(Technical description of the feature - 40ish words)
(A code block snippet example demonstrating the feature)
(Explain the problem-this-is-solving/why/benefits/problems - 40ish words)
(Provide reference urls to your sources of information about the feature - required)



Conclusions
-----------

(justify why frameworks are recommended - 120ish words)
(justify which frameworks should be used and why 180ish words)

Notes
-----------------
- Routing is defined in server.py: [Lines 9-16](https://github.com/calaldees/frameworks_and_languages_module/blob/0cfd7c18081da94854f2a8423b12c39ac136d19a/example_server/app/server.py#L9-L16). Thousands of routes in a single file is not scalable. Each route requires its own import.
- CORS seems to be manually embedded in the response here: [Line 71](https://github.com/calaldees/frameworks_and_languages_module/blob/0cfd7c18081da94854f2a8423b12c39ac136d19a/example_server/app/http_server.py#L71).
- Middleware is used to build modularality into an application. It's used to enable customization and or modification of data incoming and outgoing from a route. This enables a routes core functionallity to be left intact.