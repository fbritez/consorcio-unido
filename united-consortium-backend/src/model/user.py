class User:

    def __init__(self, email, name):
        self.name = name
        self.email = email

    def get_email(self):
        return self.email

    def get_name(self):
        return self.name

    def __eq__(self, obj):
        return isinstance(obj, User) and obj.name == self.name and obj.email == self.email


class ConsortiumMember:

    def __init__(self, user_email, member_name):
        self.user_email = user_email
        self.member_name = member_name

    def get_email(self):
        return self.user_email

    def get_name(self):
        return self.member_name
