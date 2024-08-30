import { MiddlewareFn } from 'type-graphql';
import sanitizeHtml from 'sanitize-html';

export const sanitizeInput: MiddlewareFn<any> = async ({ args }, next) => {
    // Sanitize all string arguments
    args = sanitizeObject(args);
    return next();
};

// Recursive function to sanitize nested objects
function sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
        return sanitizeHtml(obj);
    } else if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
    } else if (obj !== null && typeof obj === 'object') {
        const sanitizedObj: any = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                sanitizedObj[key] = sanitizeObject(obj[key]);
            }
        }
        return sanitizedObj;
    }
    return obj;
}
