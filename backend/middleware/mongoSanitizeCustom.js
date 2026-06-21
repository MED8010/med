/**
 * Custom NoSQL Sanitize middleware for Express 5
 * Express 5 makes req.query a getter-only property on some IncomingMessage instances
 */
const mongoSanitizeCustom = (req, res, next) => {
    const sanitize = (obj) => {
        if (!obj || typeof obj !== 'object') return obj;

        if (Array.isArray(obj)) {
            return obj.map(sanitize);
        }

        const sanitized = { ...obj };
        Object.keys(sanitized).forEach(key => {
            if (key.startsWith('$') || key.includes('.')) {
                delete sanitized[key];
            } else {
                sanitized[key] = sanitize(sanitized[key]);
            }
        });
        return sanitized;
    };

    if (req.body) req.body = sanitize(req.body);
    if (req.params) req.params = sanitize(req.params);

    // For req.query, we try to redefine it or just replace the object content if possible
    if (req.query) {
        const sanitizedQuery = sanitize(req.query);
        try {
            Object.defineProperty(req, 'query', {
                value: sanitizedQuery,
                writable: true,
                enumerable: true,
                configurable: true
            });
        } catch (e) {
            // Fallback: if it's really read-only, we can't do much without proxying
            // but usually Object.defineProperty works on the request object
        }
    }

    next();
};

module.exports = mongoSanitizeCustom;
