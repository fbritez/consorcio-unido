from flask import Blueprint, request
from flask_cors import cross_origin, CORS
import logging
import json
from src.service.consorsium_service import ConsortiumService

consortium_api = Blueprint('consortium_api', __name__)
CORS(consortium_api, suppport_credentials=True)

service = ConsortiumService()


@consortium_api.route('/consortiums', methods=['GET'])
@cross_origin(support_credentials=True)
def consortiums():
    return {
        'consortiums': [consortium.__dict__ for consortium in service.get_consortium_for()]
    }


@consortium_api.route('/update-consortium', methods=['POST'])
@cross_origin(support_credentials=True)
def update_consortium():
    try:
        consortium = service.create_model(request.json.get('updatedConsortium'))

        service.update_consortium(consortium)
    except Exception as ex:
        logging.error(ex)

    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
