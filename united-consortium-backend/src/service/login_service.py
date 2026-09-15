from src.DAO.dao_factory import DAOFactory
from src.service.consorsium_service import ConsortiumService
from src.service.password_service import PasswordService


class LoginService:

    def __init__(self, dao=None, consortium_service=None):
        self.dao = dao or DAOFactory.create_dao('login')
        self.consortium_service = consortium_service or ConsortiumService()
        self.password_service = PasswordService()

    def validate_user_email(self, email):

        result = self.dao.get_all(query_obj={'$or': [{'user_email': email}, {'secondary_email': email}]})

        return not bool(result)

    def set_credentials(self, email, password):
        hashed_password = self.password_service.hash_password(password)
        self.dao.insert({'user_email': email, 'password': hashed_password})

    def authenticate(self, email, password):
        users = self.dao.get_all({'user_email': email})
        if not users:
            return False
        user = users[0]
        stored_password = user.get('password')
        if not stored_password:
            return False
        return self.password_service.verify_password(password, stored_password)
