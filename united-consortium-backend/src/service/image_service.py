from src.DAO.mongo_DAO import ImageDAO


class ImageService:

    def __init__(self, dao=ImageDAO()):
        self.dao = dao

    def store(self, file_id, file):
        self.dao.store(file_id, file)

    def read(self, file_id):
        return self.dao.read(file_id)