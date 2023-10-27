import logging

from app.server import app
from app.http_server import serve_app

log = logging.getLogger(__name__)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    PORT = 8000
    log.info(f'Start server on {PORT}')
    serve_app(app, port=PORT)
