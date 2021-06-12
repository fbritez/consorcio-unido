from src.DAO.mongo_DAO import UserDAO
from src.model.user import User


class UserService:

    def __init__(self, dao=UserDAO()):
        self.dao = dao

    def get_user(self, email):
        return self.dao.get_all({'email': email})

    def update_members(self, members):
        for member in members:
            self.store_new_user(member.get_email())
            self.store_new_user(member.get_secondary_email())

    def store_new_user(self, email):
        if not self.get_user(email):
            self.dao.insert(User(email, 'Usuario No identificado'))