class EspensesReceiptNotification:

    def __init__(self, expenses_receipt, consortium):
        self.expenses_receipt = expenses_receipt
        self.consortium = consortium

    def get_consortium(self):
        return self.consortium

    def text_for_notifications(self):
        message = 'Ya se encuentra disponible la liquidación correspondiente al mes de {} del año {}.'.format \
            (self.expenses_receipt.get_month(), self.expenses_receipt.get_year())
        return {'consortium_id': self.expenses_receipt.consortium_identifier(), 'message': message}

    def data_for_email(self):

        message = f"<h3>Nueva Liquidacion</h3>" \
                  f"<p>Ya se encuentra disponible la liquidación correspondiente al mes de <strong>{self.expenses_receipt.get_month()}</strong> del año <strong>{self.expenses_receipt.get_year()}</strong></p>"

        return f"Nueva Liquidacion {self.consortium.get_name()}", message
