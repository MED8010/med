/**
 * Custom NoSQL injection sanitizer for Express 5.
 * Express 5 makes req.query and req.params read-only (getters).
 * This middleware uses Object.defineProperty to bypass that.
 */
const mongoSanitizeCustom = (req, res, next) => {
    const sanitize = (obj) => {
        if (!obj || typeof obj !== 'object') return obj;

        const newObj = Array.isArray(obj) ? [] : {};

        for (const key in obj) {
            if (key.startsWith('$') || key.includes('.')) {
                // Skip or sanitize NoSQL operators
                continue;
            }

            if (typeof obj[key] === 'object' && obj[key] !== null) {
                newObj[key] = sanitize(obj[key]);
            } else {
                newObj[key] = obj[key];
            }
        }
        return newObj;
    };

    if (req.query) {
        const sanitizedQuery = sanitize(req.query);
        Object.defineProperty(req, 'query', {
            value: sanitizedQuery,
            writable: true,
            configurable: true
        });
    }

    if (req.params) {
        const sanitizedParams = sanitize(req.params);
        Object.defineProperty(req, 'params', {
            value: sanitizedParams,
            writable: true,
            configurable: true
        });
    }

    if (req.body) {
        req.body = sanitize(req.body);
    }

    next();
};

module.exports = mongoSanitizeCustom;
