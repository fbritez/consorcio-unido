from src.DAO.dao_factory import DAOFactory
from src.service.consorsium_service import ConsortiumService


class LoginService:

    def __init__(self, dao=None, consortium_service=None):
        self.dao = dao or DAOFactory.create_dao('login')
        self.consortium_service = consortium_service or ConsortiumService()

    def validate_user_email(self, email):

        result = self.dao.get_all(query_obj={'$or': [{'user_email': email}, {'secondary_email': email}]})

        return not bool(result)

    def set_credentials(self, email, encrypted_password):
        self.dao.insert({'user_email': email, 'password': encrypted_password})

    def authenticate(self, email, encrypted_password):
        users = self.dao.get_all({'user_email': email})
        if not users:
            return False
        user = users[0]
        stored_password = user.get('password')
        if not stored_password:
            return False
        return encrypted_password == stored_password
