import functools


class ExpensesReceipt:

    def __init__(self, consortium, expense_items=[]):
        self.consortium = consortium
        self.expense_items = expense_items

    def get_consortium(self):
        return self.consortium

    def get_expeses_items(self):
        return self.expense_items

    def get_total_amount(self):
        return sum([item.get_amount() for item in self.expense_items])
