

class ExpensesReceipt:

    def __init__(self, consortium, month, year, expense_items=[]):
        self.consortium = consortium
        self.month = month
        self.year = year
        self.expense_items = expense_items

    def get_consortium(self):
        return self.consortium

    def consortium_name(self):
        return self.consortium.get_name()

    def get_month(self):
        return self.month

    def get_year(self):
        return self.year

    def get_expeses_items(self):
        return self.expense_items

    def get_total_amount(self):
        return sum([item.get_amount() for item in self.expense_items])
