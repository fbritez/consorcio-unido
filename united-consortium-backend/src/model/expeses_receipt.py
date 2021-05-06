

class ExpensesReceipt:

    def __init__(self, consortium_id, month, year, expense_items=[]):
        self.consortium_id = consortium_id
        self.month = month
        self.year = year
        self.expense_items = expense_items

    def __eq__(self, obj):
        return isinstance(obj, ExpensesReceipt) and obj.consortium_id == self.consortium_id and obj.month == self.month and obj.year == self.year

    def consortium_identifier(self):
        return self.consortium_id

    def get_month(self):
        return self.month

    def get_year(self):
        return self.year

    def get_expeses_items(self):
        return self.expense_items

    def get_total_amount(self):
        return sum([item.get_amount() for item in self.expense_items])
