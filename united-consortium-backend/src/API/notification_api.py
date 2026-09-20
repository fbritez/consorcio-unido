import json

from flask import Blueprint, request
from flask_cors import cross_origin, CORS
import logging

from src.service.notification_service import NotificationService
from src.service.notification_reaction_service import NotificationReactionService

notification_api = Blueprint('notification_api', __name__)
CORS(notification_api, suppport_credentials=True)

service = NotificationService()
reaction_service = NotificationReactionService()


@notification_api.route('/notification/notificationFor', methods=['GET'])
@cross_origin(support_credentials=True)
def get_notifications():
    """Get notifications for a consortium.
        --
        tags:
            - Notifications
        parameters:
            - name: consortiumID
                in: query
                required: true
                type: string
        responses:
            200:
                description: Consortium notifications
    """
    consortium_id = request.args.get('consortiumID')

    notifications = service.get_notifications(consortium_id)

    return {'notifications': notifications}


@notification_api.route('/notification/update', methods=['POST'])
@cross_origin(support_credentials=True)
def update_notifications():
    """Create or update a notification.
        --
        tags:
            - Notifications
        parameters:
            - in: body
                name: notification
                required: true
                schema:
                    type: object
                    properties:
                        notification:
                            type: object
        responses:
            200:
                description: Notification saved
    """
    try:
        notification = request.json.get('notification')

        service.save_or_update(notification)
    except Exception as ex:
        logging.error(ex)

    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}


@notification_api.route('/notification/reaction', methods=['POST'])
@cross_origin(support_credentials=True)
def add_reaction():
    """Add or update user reaction to a notification.
        --
        tags:
            - Notifications
        parameters:
            - in: body
                name: body
                required: true
                schema:
                    type: object
                    properties:
                        notificationId:
                            type: integer
                        userEmail:
                            type: string
                        reactionType:
                            type: string
        responses:
            200:
                description: Reaction saved
    """
    try:
        data = request.json
        notification_id = data.get('notificationId')
        user_email = data.get('userEmail')
        reaction_type = data.get('reactionType')

        existing_reaction = reaction_service.get_user_reaction(notification_id, user_email)

        if existing_reaction == reaction_type:
            reaction_service.remove_reaction(notification_id, user_email, reaction_type)
        elif existing_reaction:
            reaction_service.remove_reaction(notification_id, user_email, existing_reaction)
            reaction_service.add_reaction(notification_id, user_email, reaction_type)
        else:
            reaction_service.add_reaction(notification_id, user_email, reaction_type)
    except Exception as ex:
        logging.error(ex)
        return json.dumps({'success': False, 'error': str(ex)}), 500, {'ContentType': 'application/json'}

    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}


@notification_api.route('/notification/reactions', methods=['GET'])
@cross_origin(support_credentials=True)
def get_reactions():
    """Get reaction counts and user reaction for a notification.
        --
        tags:
            - Notifications
        parameters:
            - name: notificationId
                in: query
                required: true
                type: integer
            - name: userEmail
                in: query
                required: false
                type: string
        responses:
            200:
                description: Reaction data
    """
    try:
        notification_id = request.args.get('notificationId', type=int)
        user_email = request.args.get('userEmail')

        counts = reaction_service.get_reactions_count(notification_id)
        user_reaction = None

        if user_email:
            user_reaction = reaction_service.get_user_reaction(notification_id, user_email)

        return json.dumps({
            'counts': counts,
            'userReaction': user_reaction
        }), 200, {'ContentType': 'application/json'}
    except Exception as ex:
        logging.error(ex)
        return json.dumps({'success': False, 'error': str(ex)}), 500, {'ContentType': 'application/json'}