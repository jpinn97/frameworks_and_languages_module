Investigate Reference Implementations (2 hours)
=====================================

In industry, we need to be able to read code and evaluate solutions.
We need to describe and justify why an approach is flawed.
Today we are going to attempt to build some of these skills.
This is a requirement of you Assignment 2.

* Task 1 (1 hour)
    * For each of the server (30min) + client (30min)
        * (20min) Individually, view the code attempting to identify permalinks to the items listed below
        * (10min) In pairs, compare your answers, are they different?
    * `example_server` [example_server/app](https://github.com/calaldees/frameworks_and_languages_module/tree/main/example_server/app)
        * Where is the routing handled? (permalink)
            * Is this expandable?
        * Where are the CORS headers set? (permalink)
            * Is this good/bad? why?
        * The socket/network handling is very weak - why? (permalink)
        * What features are missing? (compare the features with a frameworks features)
    * `example_client` [example_client/index.html](https://github.com/calaldees/frameworks_and_languages_module/blob/main/example_client/index.html)
        * Client frameworks typically have - state, actions, views
            * Can you permalink to 
                * an item of state (where are the items stored? - this is particularly bad in this client!)
                * an action? (button press logic?) (permalink)
                * some kind of view (view logic?) (permalink)
        * Can you describe 'Why' the client is difficult to follow/read/understand?
        * What is `renderItemListFieldLookup` trying to do?
        * What is `.cloneNode(true)`?

* Task 2 (1 hour)
    * (30min) Write some draft answers to `technical_report.md` and commit them
    * (30min) Teacher feedback and discussion

<details>

* `http_server.py` is unneeded - this is reinventing the wheel - Python already has stubs for this in the standard library
    * https://docs.python.org/3/library/http.server.html
    * https://docs.python.org/3/library/wsgiref.html
        * http://wsgi.tutorial.codepoint.net/environment-dictionary
</details>