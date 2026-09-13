from src.DAO.dao_factory import DAOFactory
from src.service.consorsium_service import ConsortiumService


class LoginService:

    def __init__(self, dao=None, consortium_service=None):
        self.dao = dao or DAOFactory.create_dao('login')
        self.consortium_service = consortium_service or ConsortiumService()

    def validate_user_email(self, email):
     
        result = self.dao.get_all(query_obj={'$or': [{'user_email': email}, {'secondary_email': email}]})

        return not bool(result)

    def set_credentials(self, email, password):
        self.dao.insert({'user_email': email, 'password': password})

    def authenticate(self, email, password):
        return bool(self.dao.get_all({'user_email': email, 'password': password}))
