import json
import logging
from functools import wraps

def object_to_json(element):
    return json.loads(json.dumps(element.__dict__, default=lambda obj: obj.__dict__))


def objects_to_json(elements):
    return [object_to_json(element) for element in elements]


def handle_errors(f=None, return_error_code=500):
    if f is None:
        return lambda function: handle_errors(function, return_error_code)

    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            logging.exception('Error in %s', f.__name__)
            return json.dumps({'error': str(e)}), return_error_code

    return wrapper