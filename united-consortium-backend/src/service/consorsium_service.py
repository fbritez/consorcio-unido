from src.DAO.mongo_DAO import ConsortiumDAO
from src.model.consortium import Consortium


class ConsortiumService:

    def __init__(self):
        self.dao = ConsortiumDAO()
        #self.initMockData()

    def initMockData(self):
        consortiums = [Consortium('Deco Palermo', 'Godoy Cruz 3200'), Consortium('Deco Barrio Norte', 'Austria 1900')]
        self.dao.insert_all(consortiums)

    def get_consortium_for(self):
        return self.dao.get_all()
