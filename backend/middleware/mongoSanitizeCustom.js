/**
 * Custom NoSQL injection sanitizer for Express 5
 * Express 5 makes req.query, req.params and req.body read-only getters
 * for the original objects, but they can still be modified if handled correctly.
 */
function mongoSanitizeCustom(req, res, next) {
    const sanitize = (obj) => {
        if (!obj || typeof obj !== 'object') return obj;

        if (Array.isArray(obj)) {
            return obj.map(v => sanitize(v));
        }

        const sanitized = {};
        Object.keys(obj).forEach(key => {
            if (!key.startsWith('$')) {
                sanitized[key] = sanitize(obj[key]);
            }
        });
        return sanitized;
    };

    if (req.body) {
        const sanitizedBody = sanitize(req.body);
        Object.defineProperty(req, 'body', {
            value: sanitizedBody,
            writable: true,
            enumerable: true,
            configurable: true
        });
    }

    if (req.query) {
        const sanitizedQuery = sanitize(req.query);
        Object.defineProperty(req, 'query', {
            value: sanitizedQuery,
            writable: true,
            enumerable: true,
            configurable: true
        });
    }

    if (req.params) {
        const sanitizedParams = sanitize(req.params);
        Object.defineProperty(req, 'params', {
            value: sanitizedParams,
            writable: true,
            enumerable: true,
            configurable: true
        });
    }

    next();
}

module.exports = mongoSanitizeCustom;
