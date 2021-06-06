import datetime

from src.DAO.mongo_DAO import NotificationDAO


class NotificationService:

    def __init__(self, dao=NotificationDAO()):
        self.dao = dao

    def get_notifications(self, consortium_id):
        notifications = self.dao.get({'consortium_id': consortium_id})
        return sorted(notifications, key=lambda notification: notification['publishDate'], reverse=True)

    def save_or_update(self, element):

        if element.get('publishDate', None):
            self.dao.update({'consortium_id': element.get('consortium_id')}, element)
        else:
            element['publishDate'] = datetime.datetime.now()
            self.dao.insert(element)
