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
    try:
        file = request.files.get('file')
        imageService.store(file.filename, file)


    except Exception as ex:
        logging.error(ex)

    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}


@image_api.route('/getTicket', methods=['GET'])
@cross_origin(support_credentials=True)
def get_ticket():

    file_id = request.args.get('file_id')
    image = imageService.read(file_id)
    '''
    response = make_response(image)
    response.headers.set('Content-Type', 'image/jpeg')
    response.headers.set(
        'Content-Disposition', 'attachment', filename='%s.jpg' % file_id)
    return response
    '''
    return send_file(
        io.BytesIO(image),
        mimetype='image/jpeg',
        as_attachment=True,
        attachment_filename='%s.jpg' % file_id)

