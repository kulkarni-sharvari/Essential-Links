enum BC_DEFAULTS {
  GAS_PRICE = 0,
  GAS = 350000000,
  PRIVACY_FLAG = 3,
}

enum BC_ERROR_CODE {
  SC_ACCESS_ERROR = `SC-ACCESS-ERROR`,
  SC_DUPLICATE_RECORD = `SC-DUPLICATE-RECORD`,
  SC_INVALID_INPUT = `SC-INVALID-INPUT`,
  SC_INVALID_OPERATION = `SC-INVALID-OPERATION`,
  SC_RECORD_NOT_FOUND = `SC-RECORD-NOT-FOUND`,
}

enum CONTRACT_NAME {
  SS = 'storage',
}

const GET_LIST_DEFAULT_PAGE_LIMIT = {
  LIMIT: 1000,
};

enum USER_ROLE {
  FARMER = `FARMER`,
  PROCESSING_PLANT = `PROCESSING_PLANT`,
  SHIPMENT_COMPANY = `SHIPMENT_COMPANY`,
  RETAILER = `RETAILER`,
  CONSUMER = `CONSUMER`
}


export { BC_DEFAULTS, BC_ERROR_CODE, CONTRACT_NAME, GET_LIST_DEFAULT_PAGE_LIMIT, USER_ROLE };
