class ExpenseItem:

    def __init__(self, title, description, amount):
        self.title = title
        self.description = description
        self.amount = amount

    def get_amount(self):
        return self.amount
