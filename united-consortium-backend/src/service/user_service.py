from src.DAO.mongo_DAO import UserDAO
from src.model.user import User


class UserService:

    def __init__(self, dao=UserDAO()):
        self.dao = dao
        u = User('test@example', 'Example user')

        self.dao.insert(u)

    def get_user(self, email):
        return self.dao.get_all({'email': email})