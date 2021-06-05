from src.DAO.mongo_DAO import SettingsDAO


class SettingsService:

    def __init__(self, dao=SettingsDAO()):
        self.dao = dao

    def get(self, type, id):
        settings = self.dao.get({'type': type, 'id': id})
        return settings[0] if settings else {}

    def saveOrUpdate(self, element):
        if self.get(element.get('type'), element.get('id')):
            self.dao.update({'type': element.get('type'), 'id': element.get('id')}, element)
        else:
            self.dao.insert(element)