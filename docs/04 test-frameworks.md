Test Frameworks
===============

Objectives:
* Understand the purpose of a unit test framework
* Understand the purpose of a browser test framework
* Understand how to use the automated tests in relation to your assignment


What are Test Frameworks
-----

* Framework to help us check that code is functioning correctly
* There are different frameworks for different parts of our software (server, client)
* Most languages have `assert`ions as a language feature
    * Example of writing a test without a framework or without `assert`
        *   ```python
            expected = "my expected result"
            result = do_thing()
            if (result == expected) {
                print("it worked")
                add_test_to_passed_list('do_thing')
            } else {
                print(f'it failed - I expected {expected=} but I got {result=}')
                add_test_to_failed_list('do_thing', expected, result)
            }
            ```
    * With framework
        *   ```python
            def test_do_thing() {
                assert do_thing() == "my expected result"
            }
            ```
* Types of Testing
    * Unit test 
        * test individual functions (or specific functionality) without dependencies
        * Dependent services are normally "mocked" (key terminology)
        * Super fast feedback! (in seconds or minuets)
    * Integration tests
        * Test if two or more components of a system can work with each other
    * End-to-End tests
        * Test that a whole system, end to end, with all dependencies are working
        * e.g. with a full database + gui
        * Normally take a lot of resources and time (10's of minuets or hours)


PyTest (A unittest framework)
------

* [pytest.org](https://pytest.org/)
    * pytest: helps you write better programs
    * The pytest framework makes it easy to write small tests, yet scales to support complex functional testing for applications and libraries.

### TASK: run the basic PyTest example

```bash
pip install pytest  # (only once)

mkdir -p pytest_example
cd pytest_example
touch test_sample.py  # Create `test_sample.py` file form https://pytest.org/
pytest
# should run test_sample.py and produce an error
```

### TASK: Create some tests

* Create the following files
    * `example.py`
        *   ```python
            def add(a, b):
                return 0

            def multiply(a, b):
                return 0
            ```
    * `test_example.py`
        *   ```python
            from example import *

            def test_add():
                assert add(1, 2) == 3
                assert add(1, -2) == -1
                assert add(1000000000000000000, 2) == 1000000000000000002

            def test_multiply():
                assert False, "please implement the rest of this test"
            ```
* Add some positive tests for these functions
    * Think about possible values to test with 
        * (positive? negative? BIG numbers?)
* Add some erroneous tests for these functions
    * `add(2, "thing")` - you expect to generate an exception
        * https://docs.pytest.org/en/latest/how-to/assert.html#assertions-about-expected-exceptions
* Create a new function and some new test
    * Test for exceptions
    * `div(a, b)` -> `div(100, 0)`


### Task: Testing `jsonplaceholder`

* [jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com/)
    * [guide](https://jsonplaceholder.typicode.com/guide/)
        * ```bash
          curl https://jsonplaceholder.typicode.com/posts/1
            # Important: resource will not be really updated on the server but it will be faked as if.
          curl -X POST -d '{"title": "foo", "body": "bar", "userId": "1"}' https://jsonplaceholder.typicode.com/posts
          curl -X DELETE https://jsonplaceholder.typicode.com/posts/1
            ```

```bash
pip install pytest requests
```

`test_jsonplaceholder.py` (pytest files must start with `test_`)
```python
"""
Complete the pytest tests below for https://jsonplaceholder.typicode.com/guide/
Test the endpoints by:
* making a request using the `requests library`
* Assert/Check/Verify some aspect of the data you get back is correct to the spec/examples
* use `breakpoint()` and `dir(response)` to debug the response object to get the `status` somehow

Hints (Components you will need - these are not in order):

    ITEM={"title": "foo", "body": "bar", "userId": "1"}
    response = requests.post(ENDPOINT + 'posts', json=ITEM)

    data = response.json()

    response = requests.delete(ENDPOINT + '???/???')

    assert data['id'] > 100

    assert response.??? == 200
"""
import requests

ENDPOINT="https://jsonplaceholder.typicode.com/"

def test_get_post_1():
    response = requests.get(ENDPOINT + 'posts/1')
    # Find out what the request should return with
    # curl https://jsonplaceholder.typicode.com/posts/1
    # Assert the right data is returned
    pass  # remove me

def test_create_post():
    # Post and item and assert the id created is greater than 100
    pass  # remove me

def test_delete_post_1():
    pass  # remove me
```

### Task: install plugin

* [pytest-html](https://pytest-html.readthedocs.io/)
    * `pip install pytest-html`
    * `pytest --html=report.html --self-contained-html`
* view generated report
    * `python3 -m http.server` or right-click + download
* Advanced (Optional)
    * Create a `pytest.ini` file
    *   ```ini
        [pytest]
        addopts = --html=report.html --self-contained-html
        ```
    * Typing `pytest` will run automatically with those options

### Task: Debugger

* Change one of your tests so that it fails
* run pytest with the command below
*   ```bash
    pytest --pdb
    ```
* Inspect the `response` object
    * `dir(???)` repl


### Task: Run individual tests for this project
```bash
# Run server on :8000
cd example_server
make run_local

# -- separate terminal

# Run individual test
cd test_server
pytest test_api.py::test_root
# look for more test names in `test_server/test_api.py`
# use `--pdb` for debug powers
```

### Framework Features
* Fixtures
    * Setup and teardown for data
    *   ```python
        @pytest.fixture(scope="session")
        def DB():
            # conenct/login to database
            yield database_object
            # disconnect/close database

        @pytest.fixture
        def new_item(DB):
            # create it before the test
            DB.create('thing')
            yield "???"   # NOTE: `yield`` is a language_feature we can discuss in future sessions
            # tidy up after test
            DB.delete('thing')

        def test_thing(new_item):
            pass  # do test with new_item
        ```
    * [Fixture Scope](https://docs.pytest.org/en/6.2.x/fixture.html#scope-sharing-fixtures-across-classes-modules-packages-or-session)
* Mocks
    * Mock/Pretend objects
        * [unittest.mock — getting started¶](https://docs.python.org/3/library/unittest.mock-examples.html)
    *   ```python
        from unittest.mock import Mock
        m = Mock()
        m.close('moose')
        dir(m.close)
        m.close.assert_called_once_with('moose')
        ```
    * Static languages (Java, C#) use [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection) rather than mocks
* Plugins
    * https://docs.pytest.org/en/latest/reference/plugin_list.html
    * Task: look at this list ... why is this important?

### Caution: Cache files

* Cache files make me sad ... (I personally refer to them a 'file cancer')
* PyTest by default creates hidden cache files.
    * `__pycache__`, `.pytest_cache`
    * DO NOT COMMIT THESE TO YOUR REPO!
        * add these folder/files to `.gitignore`
    * Don't copy them when building containers (this can conflict with the container execution environment)
        * add these folders/files to `.dockerignore`


Jasmine (Javascript)
--------------------

* https://jasmine.github.io/
    * Look at the test example on the main page - note the similarities with `pytest` - all test have a name and perform some kind of assertion

### Task: Let's try Jasmine

* https://jasmine.github.io/setup/nodejs.html
*   ```bash
    mkdir -p jasmine_example && cd jasmine_example
    npm install --save-dev jasmine-node
    npx jasmine init
    npx jasmine examples
    npx jasmine
     # look in jasmine_example/spec/jasmine_examples/PlayerSpec.js
    ```

### Plugins

* Test Frameworks often have plugins
    * https://www.npmjs.com/package/jasmine-pretty-html-reporter


Other UnitTest Frameworks
-------------------------

* C#
    * [Get started with unit testing](https://docs.microsoft.com/en-us/visualstudio/test/getting-started-with-unit-testing) in Visual Studio
    * [github.com/calaldees/VisualStudioUnitTestExample](https://github.com/calaldees/VisualStudioUnitTestExample)
* Java
    * [JUnit](https://junit.org/)
        * [User Guide - example](https://junit.org/junit5/docs/current/user-guide/#writing-tests)
* Javascript
    * [JavaScript unit testing frameworks in 2020: A comparison](https://raygun.com/blog/javascript-unit-testing-frameworks/)
        * https://jasmine.github.io/
        * https://mochajs.org/
        * https://github.com/avajs/ava
            * Async tests
        * https://jestjs.io/





Cypress (A Browser/End-to-End test Framework)
-------

* Demo full local cypress environment
* Technical:
    * The entire test suite runs in the browser in javascript - when finished it uploaded the results to the test orchestrator
* Terminology: Headless
    * Does not need to run the renderer/gui/window-system/x11/Wayland - much lighter memory footprint and less processor time
    * Caution: this it NOT the same as an actual browser with a user. There are edge cases it can miss


### Task: Create a Cypress test to search with Google

### X11 VNC GUI in CodeSpaces

Combining
* https://notes.dt.in.th/CodespacesDisplayServer
* https://babyprogrammer.com/blog/running-gui-code-applications-in-github-codespaces-on-windows/
```bash
sudo apt update && sudo apt install -y x11-apps

mkdir -p ${CODESPACE_VSCODE_FOLDER}/setup-display && cd ${CODESPACE_VSCODE_FOLDER}/setup-display
cat > docker-compose.yml <<EOF
services:
  display:
    image: ghcr.io/dtinth/xtigervnc-docker:main
    tmpfs: /tmp
    restart: always
    environment:
      VNC_GEOMETRY: 1440x900
    ports:
      - 127.0.0.1:5900:5900
      - 127.0.0.1:6000:6000
  novnc:
    image: geek1011/easy-novnc
    restart: always
    command: -a :5800 -h display --no-url-password
    ports:
      - 127.0.0.1:5800:5800
EOF
docker compose up -d
export DISPLAY=127.0.0.1:0

xeyes
```


```bash
# Setup cypress folder and base files
_CY=${CODESPACE_VSCODE_FOLDER}/cypress_test
mkdir -p ${_CY}/cypress
cp ${CODESPACE_VSCODE_FOLDER}/test_client/cypress.config.js ${_CY}
touch ${_CY}/cypress/google.spec.cy.js
cd ${_CY}

npm install cypress
npx cypress open
```
<details>
        
```bash
    ## or GITPOD_REPO_ROOTS
sudo apt-get update && sudo apt-get install -y ???  # 5min install of 1GB X11  https://docs.cypress.io/guides/continuous-integration/introduction#UbuntuDebian
```
</details>

* Save as `cypress/google.spec.cy.js`
```javascript
describe('Google', () => {
    it('Search for university webpage and check university logo is present', () => {
        cy.visit("https://www.google.co.uk?&hl=en&lr=lang_en")
        // * Hint: "Terms and Conditions" must be accepted
            //    Visit the site in a private browser - F12 - inspect 'Accept All' button and think about how to identify it
            //    click the 'Accept All' button
        // * Perform a google search for canterbury christ church university (with a spelling mistake)
            // type text into the right input box?
        // * Check that `canterbury.ac.uk` is somewhere in the returned list of searches and click it
        // * Follow the google search link to the main university webpage and check the logo is visible
        // * Hint: Cookie Popup will block your way. Your test should deal with this - interestingly there are multiple "Accept All Cookies" buttons, use the id with the css selection `#` to find the correct one
    })
})
/*
* Run with
	* With GUI: `npx cypress open`
	* Local Headless: `npx cypress run --spec cypress/google.spec.cy.js`
	* Container Headless: `make cypress_cmd CYPRESS_CMD="run --spec cypress/google.spec.cy.js"`
* https://docs.cypress.io/api/table-of-contents
	* `.visit("https://site")`
	* `.contains("text on webpage")`
	* `.scrollIntoView()`
	* `.should('be.visible')`
	* `.click()`
	* `.type("the text you want to type{enter}")`
	* `.get('???')`
		* `.get('input[title="???"]')`
		* `.get('#id_of_element')`
		* `.get('img[alt="???"')`
*/
```



Other Browser/End-to-End test Frameworks
----------------------------------------

### Selenium

https://www.selenium.dev/
* Very established
* Technical
    * The test orcestrator runs in (almost) any language and communicates with the browser via a special binary network binding called selenium-driver
    * Each browser must install (at the system level) the special selenium driver

### puppeteer

https://developers.google.com/web/tools/puppeteer

Googles own headless browser test


Discussion: Selenium Vs Cypress
--------------------------------

Architecturally - which one would you choose and why?



Quiz
----

* Omega Thinky Quiz - Use your brain! - Most questions need multiple answers
* https://www.socrative.com/
    * [Login -> Student Login](https://b.socrative.com/login/student/)
        * callaghan1818


Assignment
==========

* Can run server individual test from terminal and enter debugger
* Can run client cypress gui from terminal
    * Can run client with exemplar server


Solutions
=========

<details>
<summary>jsonplaceholder Solution</summary>

```python
import requests

ENDPOINT="https://jsonplaceholder.typicode.com/"

def test_get_post_1():
    response = requests.get(ENDPOINT + 'posts/1')
    data = response.json()
    assert data == {'userId': 1, 'id': 1, 'title': 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit', 'body': 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto'}

def test_create_post():
    ITEM={"title": "foo", "body": "bar", "userId": "1"}
    response = requests.post(ENDPOINT + 'posts', json=ITEM)
    data = response.json()
    assert data['id'] > 100

def test_delete_post_1():
    response = requests.delete(ENDPOINT + 'posts/1')
    assert response.status_code == 200

```
</details>

<details>
<summary>Cypress Solution</summary>

```javascript
describe('Google', () => {
	it('Search for university webpage and check university logo is present', () => {
		cy.visit("https://www.google.co.uk?&hl=en&lr=lang_en")
		cy.get('button').contains("Accept all").scrollIntoView().should('be.visible').click()
		cy.get('textarea[title="Search"]').should('be.visible').type("Canterbury christ chcurch uni{enter}")
		cy.contains("canterbury.ac.uk").should('be.visible').click()
		cy.get("#onetrust-accept-btn-handler").click()
		cy.get('img[alt="Canterbury Christ Church University Logo"]').should('be.visible')
	})
})
```
</details>

<details>
<summary>backup of Quiz questions</summary>

PFL: 04 Test Frameworks


1.

Why don't we do all our web application testing with Browser test frameworks

They are difficult to construct

X They are slow

X They require lots of system resources to run

X They alert us to a problem, but it's hard to diagnose where the problem actually might be

2.

Assertions:

X Are sometimes a language feature

Can only be used in tests

X Allow us to succinctly check for truthy-ness with a concise syntax

Can give more detail to failing tests

Assertions can typically be used anywhere in code. They are sometimes used to detect problematic runtime conditions.

"More detail" is a trap and a vague term - they do not give us more detail in themselfs, however they may point us to error cases 'sooner rather than later' and this may help debugging
3.

Testing "Headless" means ...

Is a framework

X browser tests do not need to produce any user interact-able GUI

X a browser that uses less system resources than a full browser

Requires less code

"Requires less code" than what? This is vague.

A headless browser does not need to waste time rendering the screen for a real user and can save on resourse
4.

Which is better

Unit Tests

Browser Tests

X Unit and Browser tests are both good

Unit and Browser tests are optional

Try telling a business that "Unit and Browser tests are optional".

You need both for all projects. Don't start a project without them!
5.

CORS is

A server framework

A server technique

A client framework

X A security feature of modern browsers

X Implemented with HTTP headers

Implemented with HTTP status codes


6.

A test report

Is a legal requirement

is useful for measuring developer performance

X Is a useful report for developers

Is a useful report for managers

X Can be generated by CI

Managers dont use test-reports - Developers use them to identify where problems in the code are

"Developer Performance" who would anyone measure this?

"Legal requirement"? Have we ever mentioned the law in these lectures?

7.

Testing

X It is possible to just write browser tests as your main job

X Every developer must be able to write tests

Testing is normally done by another department

X Tests should be added later in a projects lifecycle

This is bit of a trick question - Tests should be added when a project is started. If it's setup later in a project life-cycle, this can be difficult as the code was not written with testability in mind and may need re-factoring.

It is possible be employed specifically as a browser test expert. These testers are highly valued by organisations!

Developers that can't write tests don't get very far in their profession

8.

What should always be in .gitignore AND .dockerignore files

Makefile

X node_modules

X __pycache__ (if a python project)

*.js

README.md

Dockerfile

X Test report folder

node_modules should never be comitted to a repo under any circumstance. this is megabytes of binary files!

Cache files should be ignored (why would we ever store these? they are temporary guff)

Test reports should never be commited, these are transient and can be regenerated. They are normally 1000's of lines long and this will contaminate your repo

The other files are legitmate files Makefile, Dockerfile, README.md and *.js are all possibly legitimate files.

The question was ALWAYS be in .gitignore AND .dockerignore some of those files could be in one of them


</details>