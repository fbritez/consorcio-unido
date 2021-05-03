
class User:

    def __init__(self, email, name):
        self.name = name
        self.email = email

    def get_email(self):
        return self.email

    def get_name(self):
        return self.name

class ConsortiumMember:

    def __init__(self, user, member_name):
        self.user = user
        self.member_name = member_name

    def get_email(self):
        return self.user.get_email()

    def get_name(self):
        return self.member_name
