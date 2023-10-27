from typing import NamedTuple


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
        True



ITEMS = {}


class DataModelPythonDict():
    def __init__(self, items):
        self.items = items or {}
        self.items_id_max = max(self.items.keys() or (0,))
    def get_item(self, item_id):
        return self.items.get(item_id)
    def delete_item(self, item_id):
        del self.items[item_id]
    def create_item(self, data):
        self.items_id_max += 1
        _id = self.items_id_max
        self.items[_id] = data
        data['id'] = _id  # Annoyingly this model needs to understand that `data` is a plain dict
        return data
    def filter_items(self, func_filter):
        assert callable(filter)
        return filter(func_filter, self.items.values())


datastore = DataModelPythonDict(ITEMS)
