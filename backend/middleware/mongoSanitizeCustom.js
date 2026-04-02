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

    // In Express 5, req.query is read-only by default in some configurations
    // or when using certain middleware. We'll use a safer way to sanitize it.
    if (req.query) {
        const sanitizedQuery = { ...req.query };
        sanitize(sanitizedQuery);
        Object.defineProperty(req, 'query', {
            value: sanitizedQuery,
            writable: true,
            configurable: true
        });
    }

    next();
};

module.exports = mongoSanitizeCustom;
