from src.DAO.mongo_DAO import ConsortiumDAO
import uuid
from src.model.consortium import Consortium


class ConsortiumService:

    def __init__(self):
        self.dao = ConsortiumDAO()

    def get_consortium_for(self):
        return self.dao.get_all()

    def save_consortium(self, consortiums):
        consortiums.set_id(uuid.uuid4())

        self.dao.insert_all([consortiums])

    def update_consortium(self, consortium):
        query_obj = {
            '': ''
        }
        return self.dao.update_all(query_obj, consortium)

