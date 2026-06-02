/**
 * Custom NoSQL Injection Sanitizer for Express 5
 * Replaces express-mongo-sanitize which has issues with read-only req.query in Express 5
 */
const mongoSanitizeCustom = (req, res, next) => {
    const sanitize = (obj) => {
        if (obj instanceof Object) {
            // If it's an array, sanitize each element
            if (Array.isArray(obj)) {
                return obj.map(item => sanitize(item));
            }

            const sanitizedObj = {};
            for (const key in obj) {
                // Remove keys starting with $ or containing .
                if (!key.startsWith('$') && !key.includes('.')) {
                    sanitizedObj[key] = sanitize(obj[key]);
                }
            }
            return sanitizedObj;
        }
        return obj;
    };

    if (req.body) {
        req.body = sanitize(req.body);
    }

    if (req.params) {
        req.params = sanitize(req.params);
    }

    if (req.query) {
        // In Express 5, req.query is often read-only or a getter
        // We must use Object.defineProperty if we want to overwrite it safely
        const sanitizedQuery = sanitize(req.query);
        Object.defineProperty(req, 'query', {
            value: sanitizedQuery,
            writable: true,
            enumerable: true,
            configurable: true
        });
    }

    next();
};

module.exports = mongoSanitizeCustom;
