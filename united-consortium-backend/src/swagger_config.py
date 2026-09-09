def query_parameter(name, required=True):
    parameter = {
        'name': name,
        'in': 'query',
        'schema': {'type': 'string'}
    }
    if required:
        parameter['required'] = True
    return parameter


def json_body(properties, required=None):
    schema = {'type': 'object', 'properties': properties}
    if required:
        schema['required'] = required
    return {
        'required': True,
        'content': {'application/json': {'schema': schema}}
    }


def operation(summary, responses, parameters=None, request_body=None):
    result = {'summary': summary, 'responses': responses}
    if parameters:
        result['parameters'] = parameters
    if request_body:
        result['requestBody'] = request_body
    return result


OK = {'description': 'Request completed successfully'}
SUCCESS = {'200': OK}

swagger_template = {
    'openapi': '3.0.2',
    'info': {
        'title': 'United Consortium API',
        'version': '1.0.0',
        'description': 'API for managing consortiums, users and expenses.'
    },
    'paths': {
        '/validateUserEmail': {'get': operation('Validate a user email', {'200': {'description': 'Validation result'}, '401': {'description': 'Validation failed'}}, [query_parameter('user_email')])},
        '/setCredentials': {'post': operation('Set user credentials', {'200': {'description': 'Credentials updated'}, '500': {'description': 'Update failed'}}, request_body=json_body({'user_email': {'type': 'string'}, 'password': {'type': 'string'}}, ['user_email', 'password']))},
        '/authenticate': {'post': operation('Authenticate a user', {'200': {'description': 'Authentication successful'}, '401': {'description': 'Invalid credentials'}}, request_body=json_body({'user_email': {'type': 'string'}, 'password': {'type': 'string'}}, ['user_email', 'password']))},
        '/consortiums': {'get': operation('Get user consortiums', SUCCESS, [query_parameter('user_identifier')])},
        '/updateConsortium': {'post': operation('Create or update a consortium', SUCCESS, request_body=json_body({'updatedConsortium': {'type': 'object'}}))},
        '/claims/claimsFor': {'get': operation('Get claims for a member', SUCCESS, [query_parameter('consortiumID'), query_parameter('member', False)])},
        '/claims/all/claims': {'get': operation('Get all consortium claims', SUCCESS, [query_parameter('consortiumID')])},
        '/claims/update': {'post': operation('Create or update a claim', SUCCESS, request_body=json_body({'claim': {'type': 'object'}}))},
        '/expenses': {'get': operation('Get expenses', SUCCESS, [query_parameter('consortium_identifier'), query_parameter('user_identifier')])},
        '/newExpenses': {'post': operation('Create or update an expense', SUCCESS, request_body=json_body({'updatedExpensesReceipt': {'type': 'object'}}))},
        '/expensesID': {'get': operation('Get an expense by identifier', SUCCESS, [query_parameter('expensesID')])},
        '/generateReceipt': {'post': operation('Generate an expense receipt', SUCCESS, request_body=json_body({'updatedExpensesReceipt': {'type': 'object'}}))},
        '/storeTicket': {'post': operation('Store an expense ticket image', SUCCESS, request_body={'required': True, 'content': {'multipart/form-data': {'schema': {'type': 'object', 'required': ['file'], 'properties': {'file': {'type': 'string', 'format': 'binary'}}}}}})},
        '/getTicket': {'get': operation('Download an expense ticket image', SUCCESS, [query_parameter('file_id')])},
        '/notification/notificationFor': {'get': operation('Get consortium notifications', SUCCESS, [query_parameter('consortiumID')])},
        '/notification/update': {'post': operation('Create or update a notification', SUCCESS, request_body=json_body({'notification': {'type': 'object'}}))},
        '/settings/get': {'get': operation('Get application settings', SUCCESS, [query_parameter('type'), query_parameter('id')])},
        '/settings/update': {'post': operation('Create or update application settings', SUCCESS, request_body=json_body({'applicationSettings': {'type': 'object'}}))},
        '/userData': {'get': operation('Get user data', SUCCESS, [query_parameter('userEmail')])}
    }
}
