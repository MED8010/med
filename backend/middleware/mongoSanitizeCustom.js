const mongoSanitizeCustom = (req, res, next) => {
    const sanitize = (obj) => {
        if (!obj || typeof obj !== 'object') return obj;

        let sanitized;
        if (Array.isArray(obj)) {
            sanitized = [...obj];
        } else {
            sanitized = { ...obj };
        }

        for (const key in sanitized) {
            if (key.startsWith('$')) {
                delete sanitized[key];
            } else if (typeof sanitized[key] === 'object') {
                sanitized[key] = sanitize(sanitized[key]);
            }
        }
        return sanitized;
    };

    if (req.query) {
        Object.defineProperty(req, 'query', {
            value: sanitize(req.query),
            writable: true,
            configurable: true
        });
    }
    if (req.params) {
        Object.defineProperty(req, 'params', {
            value: sanitize(req.params),
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
