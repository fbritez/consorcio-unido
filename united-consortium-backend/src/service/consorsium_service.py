from src.DAO.mongo_DAO import ConsortiumDAO
from src.model.consortium import Consortium


class ConsortiumService:

    def __init__(self):
        self.dao = ConsortiumDAO()

    def get_consortium_for(self):
        return self.dao.get_all()
