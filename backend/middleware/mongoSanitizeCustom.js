/**
 * Custom NoSQL injection sanitizer for Express 5
 * Replaces express-mongo-sanitize because of read-only req.query in Express 5
 */
const mongoSanitizeCustom = (req, res, next) => {
    const sanitize = (obj) => {
        if (obj instanceof Object) {
            // If it's an array, handle it separately to avoid object transformation
            if (Array.isArray(obj)) {
                return obj.map(v => sanitize(v));
            }

            // For objects, create a new object to avoid issues with read-only properties
            const newObj = {};
            Object.keys(obj).forEach((key) => {
                if (key.startsWith('$') || key.includes('.')) {
                    // Skip keys that start with $ or contain .
                } else {
                    newObj[key] = sanitize(obj[key]);
                }
            });
            return newObj;
        }
        return obj;
    };

    if (req.query) {
        const sanitized = sanitize(req.query);
        Object.defineProperty(req, 'query', {
            value: sanitized,
            writable: true,
            configurable: true
        });
    }
    if (req.params) {
        const sanitized = sanitize(req.params);
        Object.defineProperty(req, 'params', {
            value: sanitized,
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
