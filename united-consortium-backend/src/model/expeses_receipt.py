MONTH_VALUES = ['Enero',
                'Febrero',
                'Marzo',
                'Abril',
                'Mayo',
                'Junio',
                'Julio',
                'Agosto',
                'Septimbre',
                'Octubre',
                'Noviembre',
                'Diciembre'
                ]


class ExpensesReceipt:

    def __init__(self, consortium_id, month, year, expense_items=[], is_open=True, identifier=None, member_expenses_receipt_details=[], payment_processed=False):
        self.consortium_id = consortium_id
        self.month = month
        self.year = year
        self.expense_items = expense_items
        self.is_open = is_open
        self.identifier = identifier
        self.member_expenses_receipt_details = member_expenses_receipt_details
        self.payment_processed = payment_processed

    def __eq__(self, obj):
        return isinstance(obj,
                          ExpensesReceipt) and obj.consortium_id == self.consortium_id and obj.month == self.month and obj.year == self.year

    def consortium_identifier(self):
        return self.consortium_id

    def get_month(self):
        return self.month

    def get_year(self):
        return self.year

    def set_expenses_items(self, items):
        self.expense_items = items

    def get_expenses_items(self):
        return self.expense_items

    def add_expenses_items(self, items):
        self.expense_items.extend(items)

    def add_expenses_item(self, item):
        self.expense_items.append(item)

    def process_payment(self):
        self.payment_processed = True

    def get_total_amount(self):
        return sum([item.get_amount() for item in self.expense_items])

    def _month_sort_value(self):
        return MONTH_VALUES.index(self.get_month())

    def get_sort_criteria(self):
        return '{} - {}'.format(self.get_year(), self._month_sort_value())

    def set_member_receipts(self, set_member_receipts):
        self.member_expenses_receipt_details = set_member_receipts

    def get_non_payment_receipts(self):
        return [receipt for receipt in self.member_expenses_receipt_details if receipt.is_non_payment()]


class MemberExpensesReceipt:

    def __init__(self, member, expense_items=[], paid=False, paid_amount=0):
        self.member = member
        self.expenses_items = expense_items
        self.paid = paid
        self.paid_amount = paid_amount

    def get_member(self):
        return self.member

    def total_amount(self):
        return sum([item.get_amount() for item in self.expenses_items])

    def is_non_payment(self):
        return not self.get_pending_amount() == 0

    def get_pending_amount(self):
        return self.total_amount() - self.paid_amount
