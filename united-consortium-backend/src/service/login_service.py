from src.DAO.mongo_DAO import LoginDAO
from src.service.consorsium_service import ConsortiumService


class LoginService:

    def __init__(self, dao=LoginDAO(), consortium_service=ConsortiumService()):
        self.dao = dao
        self.consortium_service = consortium_service

    def validate_user_email(self, email):
        consortiums = self.consortium_service.get_consortium_for(email)

        if consortiums:
            result = self.dao.get_all(query_obj={'$or': [{'user_email': email}, {'secondary_email': email}]})
        else:
            raise Exception('Invalid User')

        return not bool(result)

    def set_credentials(self, email, password):
        self.dao.insert({'user_email': email, 'password': password})

    def authenticate(self, email, password):
        return bool(self.dao.get_all({'user_email': email, 'password': password}))
