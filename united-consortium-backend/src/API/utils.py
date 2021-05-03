import json


def object_to_json(element):
    return json.loads(json.dumps(element.__dict__, default=lambda obj: obj.__dict__))
