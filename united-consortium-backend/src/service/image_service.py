from src.DAO.dao_factory import DAOFactory


class ImageService:

    def __init__(self, dao=None):
        self.dao = dao or DAOFactory.create_dao('image')

    def store(self, file_id, file):
        self.dao.store(file_id, file)

    def read(self, file_id):
        return self.dao.read(file_id)