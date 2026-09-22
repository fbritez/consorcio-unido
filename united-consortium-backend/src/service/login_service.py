from src.DAO.dao_factory import DAOFactory
from src.service.consorsium_service import ConsortiumService
from src.service.emailService import EmailService


class LoginService:

    def __init__(self, dao=None, consortium_service=None, email_service=None):
        self.dao = dao or DAOFactory.create_dao('login')
        self.consortium_service = consortium_service or ConsortiumService()
        self.email_service = email_service or EmailService()

    def validate_user_email(self, email):

        result = self.dao.get_all(query_obj={'$or': [{'user_email': email}, {'secondary_email': email}]})

        return not bool(result)

    def set_credentials(self, email, password):
        self.dao.insert({'user_email': email, 'password': password})

    def authenticate(self, email, password):
        return bool(self.dao.get_all({'user_email': email, 'password': password}))

    def send_contact_message(self, name, email, message):
        subject = f"Nuevo mensaje de contacto de {name}"
        contact_message = self._format_contact_message(name, email, message)
        self.email_service.send('consorcio.unido.notifications@gmail.com', subject, contact_message)

    def _format_contact_message(self, name, email, message):
        return f"""
        <h3>Nuevo mensaje de contacto</h3>
        <p><strong>Nombre:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>{message}</p>
        """
