enum SUCCESS_MESSAGES {
  ACCEPTED = 'Request has been accepted',
}

enum ERROR_MESSAGES {
  RESOURCE_NOT_FOUND = 'Resource not found',
  NOT_AUTHORIZED = 'This is not authorized',

  INVALID_ACCESS_PRIVILEGE = `Invalid access privilege!`,
  REQBODY_EMPTY = `Request body should not be empty!`,
  /**types of err */
  // TODO : To be removed, not used
  VALIDATION_ERR = 'ValidationError',
  UNAUTHORIZED_ERR = 'UnauthorizedError',
  NOT_FOUND_ERR = 'NotFoundError',
  METHOD_NOT_ALLOWED_ERR = 'MethodNotAllowedError',
  PREC0NDITION_ERR = 'PreconditionError',
  REQUEST_ENTITY_SIZE_ERR = 'RequestEntitySizeError',
  SERVICE_ERR = 'ServiceError',
  GATEWAY_TIMEOUT_ERR = 'GatewayTimeoutError',

  /** Generic error messages */
  CREATION = 'REQUEST_TYPE creation failed',
  UPDATE = 'REQUEST_TYPE update failed',
  DELETION = 'REQUEST_TYPE deletion failed',
  CONFIRMATION = 'REQUEST_TYPE confirmation failed',
  RECEIPT = 'REQUEST_TYPE receipt creation failed',
  UPLOAD = 'REQUEST_TYPE upload failed',
  INVALID_METHOD = 'Method is not allowed',

  /** Generic error messages for services */
  COSMOS_DB = `Database service is unavailable`,
  SERVICE_BUS = `Queue service is unavailable`,
  BLOCKCHAIN = `Blockchain service is unavailable`,
  BLOCKCHAIN_CONTRACT = `Getting error while calling contract`,
}

export { SUCCESS_MESSAGES, ERROR_MESSAGES };
