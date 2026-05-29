/**
 * Custom NoSQL injection sanitizer for Express 5
 * Express 5 makes req.query, req.params, etc. read-only (getters),
 * so we need to use Object.defineProperty or replace the object entirely.
 */
const sanitize = (obj) => {
    if (obj instanceof Object) {
        for (const key in obj) {
            if (key.startsWith('$')) {
                delete obj[key];
            } else {
                sanitize(obj[key]);
            }
        }
    }
};

const mongoSanitizeCustom = (req, res, next) => {
    ['query', 'params', 'body'].forEach(key => {
        if (req[key]) {
            // Clone the object to make it writable
            const sanitized = Array.isArray(req[key]) ? [...req[key]] : { ...req[key] };
            sanitize(sanitized);

            // Re-define the property on req
            Object.defineProperty(req, key, {
                value: sanitized,
                writable: true,
                configurable: true,
                enumerable: true
            });
        }
    });
    next();
};

module.exports = mongoSanitizeCustom;
