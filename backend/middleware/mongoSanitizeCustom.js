const mongoSanitizeCustom = (req, res, next) => {
    const sanitize = (obj) => {
        if (obj instanceof Object) {
            for (let key in obj) {
                if (/^\$/.test(key)) {
                    delete obj[key];
                } else {
                    sanitize(obj[key]);
                }
            }
        }
        return obj;
    };

    if (req.body) sanitize(req.body);

    // Express 5 req.query and req.params are read-only for assignment,
    // but we can modify the contents or use defineProperty if needed.
    // Actually, for NoSQL injection protection, we can just check if they contain $ starting keys.

    const checkInjection = (obj) => {
        if (obj instanceof Object) {
            for (let key in obj) {
                if (/^\$/.test(key)) {
                    return true;
                }
                if (checkInjection(obj[key])) return true;
            }
        }
        return false;
    };

    if (checkInjection(req.query) || checkInjection(req.params)) {
        return res.status(400).json({ message: 'Injection NoSQL détectée' });
    }

    // If we want to really sanitize req.query in Express 5, we have to do this:
    if (req.query) {
        const sanitizedQuery = sanitize({ ...req.query });
        Object.defineProperty(req, 'query', {
            value: sanitizedQuery,
            writable: true,
            configurable: true
        });
    }

    if (req.params) {
        const sanitizedParams = sanitize({ ...req.params });
        Object.defineProperty(req, 'params', {
            value: sanitizedParams,
            writable: true,
            configurable: true
        });
    }

    next();
};

module.exports = mongoSanitizeCustom;
