"""
My own hand rolled HTTP Server
This was created as a learning exercise.
DO NOT EVER DO THIS!
DO NOT EVER USE THIS OUTSIDE A CLASSROOM!

Python already has a built in mini http framework
https://docs.python.org/3/library/http.server.html
"""

import socket
import re
import logging
import traceback
import urllib.parse

log = logging.getLogger(__name__)

class InvalidHTTPRequest(Exception):
    pass
# https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
RE_HTTP_HEADER = re.compile(r'(?P<method>GET|HEAD|POST|PUT|DELETE|CONNECT|OPTIONS|TRACE|PATCH) (?P<path>.+) HTTP/(?P<version>.+)\r\n')
RE_HTTP_HEADER_KEY_VALUE = re.compile(r'(?P<key>.+): (?P<value>.+)\r\n')
RE_HTTP_BODY = re.compile(r'\r\n\r\n(?P<body>.*)', flags=re.MULTILINE)
def parse_request(data):
    r"""
    >>> parse_request(b'GET /?key1=value1&key2=value2 HTTP/1.1\r\nHost: localhost:8000\r\nUser-Agent: curl/7.68.0\r\nAccept: */*\r\n\r\n')
    {'method': 'GET', 'path': '/', 'version': '1.1', 'query': {'key1': 'value1', 'key2': 'value2'}, 'host': 'localhost:8000', 'user-agent': 'curl/7.68.0', 'accept': '*/*', 'body': ''}
    >>> parse_request(b'Not a http request')
    Traceback (most recent call last):
    app.http_server.InvalidHTTPRequest: Not a http request
    """
    data = data.decode('utf8')
    match_header = RE_HTTP_HEADER.search(data)
    if not match_header:
        log.error(data)
        raise InvalidHTTPRequest(data)
    request = match_header.groupdict()
    request['query'] = {}
    path_query = request['path'].split('?', maxsplit=1)
    if (len(path_query) == 2):
        request['path'], request['query'] = path_query
        request['query'] = {k: '|'.join(v) for k,v in urllib.parse.parse_qs(request['query']).items()}
    for header in RE_HTTP_HEADER_KEY_VALUE.finditer(data):
        key, value = header.groupdict().values()
        request[key.lower()] = value
    request.update(RE_HTTP_BODY.search(data).groupdict())
    log.debug(request)
    return request

# https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
RESPONSE_CODES = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    301: 'Moved Permanently',
    304: 'Not Modified',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    500: 'Internal Server Error',
    501: 'Not Implemented',
}
RESPONSE_DEFAULTS = {
    'code': 200, 
    'body': '',
    'Content-type': 'text/html; charset=utf-8',
    'Server': 'CustomHTTP/0.0 Python/3.9.0+',
    'Access-Control-Allow-Origin': '*',
    #'Date': 'Thu, 12 Aug 2021 10:02:02 GMT',  # TODO replace with strp format
}
RESPONSE_SEPARATOR = b'\r\n'
def encode_response(response):
    r"""
    >>> encode_response({'body': '<html></html>'})
    b'HTTP/1.0 200 OK\r\nContent-type: text/html; charset=utf-8\r\nServer: CustomHTTP/0.0 Python/3.9.0+\r\nAccess-Control-Allow-Origin: *\r\nContent-Length: 13\r\n\r\n<html></html>'
    """
    response = {**RESPONSE_DEFAULTS, **response}
    log.debug(response)
    code = response.pop('code')
    head = f"HTTP/1.0 {code} {RESPONSE_CODES[code]}".encode('utf8')
    body = response.pop('body')
    if isinstance(body, str):
        body = body.encode('utf8')
    response['Content-Length'] = len(body)
    return RESPONSE_SEPARATOR.join((
        head,
        RESPONSE_SEPARATOR.join(
            f'{k}: {v}'.encode('utf8')
            for k, v in response.items()
        ),
        b'',
        body,
    ))


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

                    try:
                        response = func_app(request)
                    except Exception as ex:
                        log.error(request)
                        traceback.print_exc()
                        response = {'code': 500, 'body': f'<PRE>{traceback.format_exc()}</PRE>'}
                    # TODO: the code and content length do not work here - they are currently applied in encode response.
                    log.info(f"{addr} - {request.get('path')} - {response.get('code')} {response.get('Content-length')}")
                    conn.send(encode_response(response))


# https://developer.mozilla.org/en-US/docs/Web/HTTP/Session

# python3 -m http.server
# curl http://localhost:8000/ -vvv
# curl -d '{"user_id": "user1234", "keywords": ["hammer", "nails", "tools"], "description": "A hammer and nails set. In canterbury", "lat": 51.2798438, "lon": 1.0830275}' -H "Content-Type: application/json" -X POST https://8000-silver-wildebeest-8e6oafen.ws-eu18.gitpod.io/item
# curl https://8000-silver-wildebeest-8e6oafen.ws-eu18.gitpod.io/items

#< HTTP/1.0 200 OK
#< Server: SimpleHTTP/0.6 Python/3.9.0+
#< Date: Thu, 12 Aug 2021 10:02:02 GMT
#< Content-type: text/html; charset=utf-8
#< Content-Length: 471
#<