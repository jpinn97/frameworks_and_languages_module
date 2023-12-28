# Technical Report

The purpose of this report is to evaluate and critique the current framework-less example server and client prototype, and justify and describe an implementation that includes frameworks and specific language features. For a simple CRUD (Create, Read, Update, Delete) Single Page Application (SPA), the usage of frameworks and specific languages are a necessity for the development of a commercial application.

Building from scratch may offer complete control over every aspect of the application if our application was highly unique, but we needn't reinvent the wheel. Well-established frameworks generally have large communities, and thus have a wealth of resources, documentation, and support in addition to thoroughly tested and community driven features. Which will enable us to develop faster, and maintain our application more easily over the long term.

## Critique of Server/Client prototype

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

## Server Framework Features

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

## Server Language Features

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

## Client Framework Features

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

## Client Language Features

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

## Conclusions

(justify why frameworks are recommended - 120ish words)
(justify which frameworks should be used and why 180ish words)

## Notes

- Routing is defined in server.py: [Lines 9-16](https://github.com/calaldees/frameworks_and_languages_module/blob/0cfd7c18081da94854f2a8423b12c39ac136d19a/example_server/app/server.py#L9-L16). Thousands of routes in a single file is not scalable. Each route requires its own import.
- CORS seems to be manually embedded in the response here: [Line 71](https://github.com/calaldees/frameworks_and_languages_module/blob/0cfd7c18081da94854f2a8423b12c39ac136d19a/example_server/app/http_server.py#L71).
- Middleware is used to build modularality into an application. It's used to enable customization and or modification of data incoming and outgoing from a route. This enables a routes core functionallity to be left intact.
