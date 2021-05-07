from src.DAO.mongo_DAO import ConsortiumDAO
import uuid


class ConsortiumService:

    def __init__(self):
        self.dao = ConsortiumDAO()

    def get_consortium_for(self, user_identifier=None):
        values = []
        if user_identifier:
            query_obj = {'$or': [{'members.user_email' : user_identifier}, {'administrators' : user_identifier}]}
            values = self.dao.get_all(query_obj)
        else:
            values = self.dao.get_all()

        return values

    def save_consortium(self, consortiums):
        consortiums.set_id(uuid.uuid4())

        self.dao.insert(consortiums)

    def update_consortium(self, consortium):
        return self.dao.update_all({'id': consortium.get_id()}, consortium)

