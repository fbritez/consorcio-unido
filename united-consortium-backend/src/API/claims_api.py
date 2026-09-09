import json

from flask import Blueprint, request
from flask_cors import cross_origin, CORS
from src.utils.utils import json_dumps
import logging


from src.service.claims_service import ClaimsService

claims_api = Blueprint('claims_api', __name__)
CORS(claims_api, suppport_credentials=True)

service = ClaimsService()


def get_claims(consortium_id, member_name=None):
    claims = service.get_claims_for(consortium_id, member_name)

    return {'claims': [json_dumps(claim) for claim in claims]}

@claims_api.route('/claims/claimsFor', methods=['GET'])
@cross_origin(support_credentials=True)
def get_claims_for():
    """Get claims for a consortium and optionally a member.
        --
        tags:
            - Claims
        parameters:
            - name: consortiumID
                in: query
                required: true
                type: string
            - name: member
                in: query
                required: false
                type: string
        responses:
            200:
                description: Claims for the requested consortium
    """
    consortium_id = request.args.get('consortiumID')
    member_name = request.args.get('member')

    return get_claims(consortium_id, member_name)


@claims_api.route('/claims/all/claims', methods=['GET'])
@cross_origin(support_credentials=True)
def get_all_claims():
    """Get all claims for a consortium.
        --
        tags:
            - Claims
        parameters:
            - name: consortiumID
                in: query
                required: true
                type: string
        responses:
            200:
                description: All claims for the requested consortium
    """
    consortium_id = request.args.get('consortiumID')

    return get_claims(consortium_id)

@claims_api.route('/claims/update', methods=['POST'])
@cross_origin(support_credentials=True)
def update_claim():
    """Create or update a claim.
        --
        tags:
            - Claims
        parameters:
            - in: body
                name: claim
                required: true
                schema:
                    type: object
                    properties:
                        claim:
                            type: object
        responses:
            200:
                description: Claim saved
    """
    try:
        claim = service.create_model(request.json.get('claim'))

        service.save_or_update(claim)
    except Exception as ex:
        logging.error(ex)

    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}