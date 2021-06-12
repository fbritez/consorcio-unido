from src.DAO.mongo_DAO import ConsortiumDAO
from src.service.user_service import UserService
import uuid


class ConsortiumService:

    def __init__(self, user_service=UserService()):
        self.dao = ConsortiumDAO()
        self.user_service = user_service

    def get_consortium(self, consortium_id):
        return self.dao.get_all({'id': consortium_id})[0]

    def get_consortium_for(self, user_identifier=None):
        values = []
        if user_identifier:
            query_obj = {'disabled': False,
                         '$or': [
                             {'$or': [{'members.user_email': user_identifier}, {'members.secondary_email': user_identifier}]}
                             , {'administrators': user_identifier}]}

            values = self.dao.get_all(query_obj)
        else:
            values = self.dao.get_all()

        return values

    def save_consortium(self, consortiums):
        consortiums.set_id(uuid.uuid4().hex)

        self.dao.insert(consortiums)

    def save_update_consortium(self, consortium):
        self.user_service.update_members(consortium.get_members())
        if consortium.get_id():
            self.update_consortium(consortium)
        else:
            self.save_consortium(consortium)

    def update_consortium(self, consortium):
        return self.dao.update_all({'id': consortium.get_id()}, consortium)

    def create_model(self, expense_json):
        return self.dao.create_model(expense_json)
