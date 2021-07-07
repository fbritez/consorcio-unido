import datetime

class Claim:

    def __init__(self, identifier, consortium_id, owner, title, state, creation_date, messages=[]):
        self.identifier = identifier
        self.consortium_id = consortium_id
        self.owner = owner
        self.title = title
        self.messages = messages
        self.state = state
        self.creation_date = creation_date if creation_date else datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S')

    def get_identifier(self):
        return self.identifier

    def set_identifier(self, identifier):
        self.identifier = identifier

    def get_consortium_id(self):
        return self.consortium_id

    def get_state(self):
        return self.state

    def open(self):
        self.state = 'Open'


class ClaimMessage:

    def __init__(self, owner, message, filename):
        self.owner = owner
        self.message = message
        self.filename = filename
