
class Consortium(object):

    def __init__(self, name, address, members=[], identifier=None):
        self.name = name
        self.address = address
        self.members = members
        self.id = identifier

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

