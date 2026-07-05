/**
 * Custom NoSQL Injection Sanitizer
 * Replaces express-mongo-sanitize due to Express 5 compatibility issues
 * with read-only req.query properties.
 */
function mongoSanitizeCustom(req, res, next) {
    // If not a middleware call (like app.use(mongoSanitize())), return the function
    if (!req || !res || !next) {
        return mongoSanitizeCustom;
    }

    const sanitize = (obj) => {
        if (!obj || typeof obj !== 'object') return obj;

        if (Array.isArray(obj)) {
            return obj.map(item => sanitize(item));
        }

        const sanitizedObj = {};
        Object.keys(obj).forEach(key => {
            if (key.startsWith('$') || key.includes('.')) return;

            const value = obj[key];
            if (value && typeof value === 'object') {
                sanitizedObj[key] = sanitize(value);
            } else {
                sanitizedObj[key] = value;
            }
        });
        return sanitizedObj;
    };

    if (req.body) {
        req.body = sanitize(req.body);
    }

    if (req.params) {
        req.params = sanitize(req.params);
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

    next();
}

module.exports = mongoSanitizeCustom;
