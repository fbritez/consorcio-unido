from src.DAO.dao_factory import DAOFactory


class SettingsService:

    def __init__(self, dao=None):
        self.dao = dao or DAOFactory.create_dao('settings')

    def get(self, type, id):
        settings = self.dao.get({'type': type, 'id': id})
        return settings[0] if settings else {}

    def save_or_update(self, element):
        if self.get(element.get('type'), element.get('id')):
            self.dao.update({'type': element.get('type'), 'id': element.get('id')}, element)
        else:
            self.dao.insert(element)