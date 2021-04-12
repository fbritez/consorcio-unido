
class Consortium:

    def __init__(self, name, address):
        self.name = name
        self.address = address
        self.members = []

    def get_name(self):
        return self.name

    def get_address(self):
        return self.address

    def add_member(self, neighbour):
        self.members.append(neighbour)

    def get_members(self):
        return self.members
