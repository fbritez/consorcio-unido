class ExpenseItem:

    def __init__(self, title, description, amount, ticket_name=''):
        self.title = title
        self.description = description
        self.amount = amount
        self.ticket = ticket_name

    def get_amount(self):
        return self.amount
