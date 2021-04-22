import json

def json_dumps(some_object):
    return json.loads(json.dumps(some_object.__dict__, default=lambda obj: obj.__dict__))
