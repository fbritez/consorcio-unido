import json
import io
from flask import Blueprint, request, make_response, send_file
from flask_cors import cross_origin, CORS
import logging

from src.service.image_service import ImageService

image_api = Blueprint('image_api', __name__)
CORS(image_api, suppport_credentials=True)

imageService = ImageService()


@image_api.route('/storeTicket', methods=['POST'])
@cross_origin(support_credentials=True)
def store_expense_ticket():
    """Store an expense ticket image.
    --
    tags:
        - Images
    consumes:
        - multipart/form-data
    parameters:
        - name: file
            in: formData
            required: true
            type: file
    responses:
            200:
                description: Image stored
        """
    try:
        file = request.files.get('file')
        imageService.store(file.filename, file)


    except Exception as ex:
        logging.error(ex)

    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}


@image_api.route('/getTicket', methods=['GET'])
@cross_origin(support_credentials=True)
def get_ticket():
    """Download an expense ticket image.
    --
    tags:
        - Images
    parameters:
        - name: file_id
            in: query
            required: true
            type: string
        produces:
            - image/jpeg
        responses:
            200:
                description: Ticket image
        """

    file_id = request.args.get('file_id')
    image = imageService.read(file_id)

    return send_file(
        io.BytesIO(image),
        mimetype='image/jpeg',
        as_attachment=True,
        attachment_filename='%s.jpg' % file_id)

