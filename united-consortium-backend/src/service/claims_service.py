
from src.DAO.mongo_DAO import ClaimsDAO
from src.service.consorsium_service import ConsortiumService


class ClaimsService:

    def __init__(self, dao=ClaimsDAO()):
        self.dao = dao
        self.consortium_service = ConsortiumService()

    def save_or_update(self, claim):

        if claim.get_identifier():
            self.dao.update_all({'identifier': claim.get_identifier()}, claim)
        else:
            claim.set_identifier(self.generate_identifier(claim.get_consortium_id()))
            claim.open()
            self.dao.insert(claim)

    def get_claims_for(self, consortium_id, member_name=None):
        query_obj = {'consortium_id': consortium_id}
        if member_name:
            query_obj['owner'] = member_name

        return self.dao.get_all(query_obj)

    def generate_identifier(self, consortium_id):
        consortium = self.consortium_service.get_consortium(consortium_id)
        number = len(self.dao.get_all({'consortium_id': consortium_id})) + 1
        identifier = f"{consortium.get_name()}-{number}".upper().replace(' ', '')
        return identifier

    def create_model(self, expense_json):
        return self.dao.create_model(expense_json)