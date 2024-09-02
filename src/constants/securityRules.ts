import uniqid from 'uniqid'

const CSP_RULES = {
    scriptSrc: ["'strict-dynamic'", `nonce-${uniqid()}`, "'unsafe-inline'", "http:", "https:"],
    requireTrustedTypesFor: 'script',
    objectSrc: ["'none'"],
    defaultSrc: ["'self'"],
    baseUri: ["'self'"],
}

export {
    CSP_RULES
};
