class ExpenseItem:

    def __init__(self, title, description, amount, ticket_name='', members=[]):
        self.title = title
        self.description = description
        self.amount = amount
        self.ticket = ticket_name
        self.members = members

    def get_amount(self):
        return self.amount

    def get_members(self):
        return self.members

    def set_values_for(self, consortium, user_email):
        count = consortium.get_members_count()

        if self.is_only_for_this_user(user_email):
            count = len(self.get_members())

        self.amount = self.amount / count

    def is_only_for_this_user(self, user_email):
        p =[member for member in self.get_members() if member.get_email() == user_email or member.get_secondary_email() == user_email]
        return p

    def is_for(self, user_email):
        return self.is_only_for_this_user(user_email) or not self.get_members()
