import json

from flask import Blueprint, request
from flask_cors import cross_origin, CORS
import logging

from src.service.notification_service import NotificationService

notification_api = Blueprint('notification_api', __name__)
CORS(notification_api, suppport_credentials=True)

service = NotificationService()


@notification_api.route('/notification/notificationFor', methods=['GET'])
@cross_origin(support_credentials=True)
def get_notifications():
    consortium_id = request.args.get('consortiumID')

    notifications = service.get_notifications(consortium_id)

    return {'notifications': notifications}


@notification_api.route('/notification/update', methods=['POST'])
@cross_origin(support_credentials=True)
def update_notifications():
    try:
        notification = request.json.get('notification')

        service.save_or_update(notification)
    except Exception as ex:
        logging.error(ex)

    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}