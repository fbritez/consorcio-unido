
class Consortium(object):

    def __init__(self, name, address, members=[], administrators=[], disabled=False, identifier=None):
        self.name = name
        self.address = address
        self.members = members
        self.administrators = administrators
        self.id = identifier
        self.disabled = disabled

    def __eq__(self, obj):
        return isinstance(obj, Consortium) and obj.name == self.name

    def get_name(self):
        return self.name

    def get_address(self):
        return self.address

    def get_id(self):
        return self.id

    def set_id(self, id):
        self.id = id

    def add_member(self, neighbour):
        self.members.append(neighbour)

    def get_members(self):
        return self.members

    def get_members_count(self):
        return len(self.get_members())

    def get_administrators(self):
        return self.administrators

    def is_administrator(self, user_email):
        return user_email in self.get_administrators()

