

class EspensesReceiptNotification:

    def __init__(self, expenses_receipt):
        self.expenses_receipt = expenses_receipt

    def text_for_notifications(self):
        message = 'Ya se encuentra disponible la liquidación correspondiente al mes de {} del año {}.'.format(self.expenses_receipt.get_month(), self.expenses_receipt.get_year())
        return {'consortium_id': self.expenses_receipt.consortium_identifier(), 'message': message}