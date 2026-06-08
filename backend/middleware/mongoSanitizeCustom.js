const sanitize = (obj) => {
    if (obj instanceof Object) {
        for (const key in obj) {
            if (key.startsWith('$')) {
                delete obj[key];
            } else if (obj[key] instanceof Object) {
                sanitize(obj[key]);
            }
        }
    }
    return obj;
};

const mongoSanitizeCustom = (req, res, next) => {
    if (req.body) {
        req.body = sanitize({ ...req.body });
    }
    if (req.params) {
        req.params = sanitize({ ...req.params });
    }
    if (req.query) {
        const sanitizedQuery = sanitize({ ...req.query });
        Object.defineProperty(req, 'query', {
            value: sanitizedQuery,
            writable: true,
            configurable: true
        });
    }
    next();
};

module.exports = mongoSanitizeCustom;
