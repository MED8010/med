/**
 * Custom middleware to sanitize NoSQL injection in Express 5
 * This replaces express-mongo-sanitize which has issues with read-only properties in Express 5
 */
const mongoSanitizeCustom = (req, res, next) => {
    const sanitize = (obj) => {
        if (obj instanceof Object) {
            for (const key in obj) {
                if (key.startsWith('$') || key.includes('.')) {
                    delete obj[key];
                } else if (obj[key] instanceof Object) {
                    sanitize(obj[key]);
                }
            }
        }
    };

    if (req.body) sanitize(req.body);
    if (req.params) sanitize(req.params);
    if (req.headers) sanitize(req.headers);

    // In Express 5, req.query is often read-only, so we redefine it if needed
    if (req.query) {
        const sanitizedQuery = { ...req.query };
        sanitize(sanitizedQuery);
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
