from src.DAO.dao_factory import DAOFactory


class NotificationReactionService:

    def __init__(self, dao=None, consortium_dao=None):
        self.dao = dao or DAOFactory.create_dao('notification_reaction')
        self.consortium_dao = consortium_dao or DAOFactory.create_dao('consortium')

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

    def get_users_by_reaction(self, notification_id, reaction_type=None):
        if reaction_type:
            reactions = self.dao.get({'notification_id': notification_id, 'reaction_type': reaction_type})
        else:
            reactions = self.dao.get({'notification_id': notification_id})

        users = []
        for reaction in reactions:
            user_email = reaction.get('user_email')
            member_info = self._get_member_info(user_email)
            users.append({
                'email': user_email,
                'memberName': member_info.get('member_name', user_email),
                'reaction': reaction.get('reaction_type')
            })
        return users

    def _get_member_info(self, user_email):
        try:
            consortiums = self.consortium_dao.get({'members.user_email': user_email})
            if consortiums:
                consortium = consortiums[0]
                members = consortium.get('members', [])
                for member in members:
                    if member.get('user_email') == user_email:
                        return member
        except Exception:
            pass
        return {}
