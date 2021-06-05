import json

from flask import Blueprint, request
from flask_cors import cross_origin, CORS
import logging

from src.service.settings_service import SettingsService

settings_api = Blueprint('settings_api', __name__)
CORS(settings_api, suppport_credentials=True)

service = SettingsService()


@settings_api.route('/settings/get', methods=['GET'])
@cross_origin(support_credentials=True)
def get_settings():
    type = request.args.get('type')
    id = request.args.get('id')

    settings = service.get(type, id)

    return settings


@settings_api.route('/settings/update', methods=['POST'])
@cross_origin(support_credentials=True)
def update_settings():
    try:
        selectedSettings = request.json.get('applicationSettings')

        service.save_or_update(selectedSettings)
    except Exception as ex:
        logging.error(ex)

    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}

