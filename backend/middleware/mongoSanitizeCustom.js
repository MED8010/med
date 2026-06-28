const mongoSanitizeCustom = (req, res, next) => {
    const sanitize = (obj) => {
        if (obj && typeof obj === 'object') {
            const newObj = Array.isArray(obj) ? [] : {};
            for (const key in obj) {
                if (key.startsWith('$') || key.includes('.')) {
                    // Skip keys that start with $ or contain .
                    continue;
                }
                if (typeof obj[key] === 'object') {
                    newObj[key] = sanitize(obj[key]);
                } else {
                    newObj[key] = obj[key];
                }
            }
            return newObj;
        }
        return obj;
    };

    if (req.body) {
        req.body = sanitize(req.body);
    }

    // For req.query and req.params in Express 5, they might be read-only getters
    // or protected. We try to redefine them if they are not what we want.
    try {
        if (req.query) {
            const sanitizedQuery = sanitize(req.query);
            Object.defineProperty(req, 'query', {
                value: sanitizedQuery,
                writable: true,
                enumerable: true,
                configurable: true
            });
        }
        if (req.params) {
            const sanitizedParams = sanitize(req.params);
            Object.defineProperty(req, 'params', {
                value: sanitizedParams,
                writable: true,
                enumerable: true,
                configurable: true
            });
        }
    } catch (e) {
        console.error('Error sanitizing req.query or req.params:', e);
    }

    next();
};

module.exports = mongoSanitizeCustom;
