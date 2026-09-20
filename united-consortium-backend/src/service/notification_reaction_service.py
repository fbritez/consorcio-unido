from src.DAO.dao_factory import DAOFactory


class NotificationReactionService:

    def __init__(self, dao=None):
        self.dao = dao or DAOFactory.create_dao('notification_reaction')

    def add_reaction(self, notification_id, user_email, reaction_type):
        self.dao.insert({
            'notification_id': notification_id,
            'user_email': user_email,
            'reaction_type': reaction_type
        })

    def remove_reaction(self, notification_id, user_email, reaction_type):
        self.dao.delete({
            'notification_id': notification_id,
            'user_email': user_email,
            'reaction_type': reaction_type
        })

    def get_user_reaction(self, notification_id, user_email):
        reactions = self.dao.get({
            'notification_id': notification_id,
            'user_email': user_email
        })
        return reactions[0].get('reaction_type') if reactions else None

    def get_reactions_count(self, notification_id):
        reactions = self.dao.get({'notification_id': notification_id})
        counts = {'like': 0, 'heart': 0}
        for reaction in reactions:
            reaction_type = reaction.get('reaction_type')
            if reaction_type in counts:
                counts[reaction_type] += 1
        return counts
