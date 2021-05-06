from flask import Blueprint, request
from flask_cors import cross_origin, CORS

from src.API.utils import objects_to_json
from src.service.user_service import UserService

user_api = Blueprint('user_api', __name__)
CORS(user_api, suppport_credentials=True)

service = UserService()


@user_api.route('/userData', methods=['GET'])
@cross_origin(support_credentials=True)
def user_data():
    email = request.args.get('userEmail')

    return {'user': objects_to_json(service.get_user(email))}
