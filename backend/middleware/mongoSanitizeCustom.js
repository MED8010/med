/**
 * Custom NoSQL injection sanitizer for Express 5
 * Express 5 makes req.query and req.params read-only via standard assignment
 * We use Object.defineProperty to bypass this.
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
    return obj;
};

const mongoSanitizeCustom = (req, res, next) => {
    if (req.query) {
        const sanitizedQuery = sanitize({ ...req.query });
        Object.defineProperty(req, 'query', {
            value: sanitizedQuery,
            writable: true,
            configurable: true,
            enumerable: true
        });
    }
    if (req.params) {
        const sanitizedParams = sanitize({ ...req.params });
        Object.defineProperty(req, 'params', {
            value: sanitizedParams,
            writable: true,
            configurable: true,
            enumerable: true
        });
    }
    if (req.body) {
        sanitize(req.body);
    }
    next();
};

module.exports = mongoSanitizeCustom;
