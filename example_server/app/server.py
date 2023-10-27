import logging

from .web_utils import find_route_func, decode_json_request, options_response

log = logging.getLogger(__name__)


from .views import get_index, get_item, post_item, delete_item, get_items
ROUTES = (
    ('OPTIONS', r'.*', options_response),
    ('GET', r'/$', get_index),
    ('POST', r'/item$', post_item),
    ('GET', r'/item/(?P<id>\d+)$', get_item),
    ('DELETE', r'/item/(?P<id>\d+)$', delete_item),
    ('GET', r'/items$', get_items),
)

def app(request):
    request = decode_json_request(request)

    if _func := find_route_func(request, ROUTES):
        return _func(request)

    return {'code': 404, 'body': 'no route'}
