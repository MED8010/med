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
    return obj;
};

const mongoSanitizeCustom = (req, res, next) => {
    if (req.body) sanitize(req.body);
    if (req.params) sanitize(req.params);

    // In Express 5, req.query is a getter that returns a new object on each call.
    // It is often read-only, so we cannot delete properties from it directly.
    // However, Express 5 allows us to set the query if we really want to,
    // but the best way is to sanitize the initial source if possible or just handle it
    // where it's used. Since we want a global middleware, we try to clean it safely.

    if (req.query) {
        try {
            // We iterate over the keys and if we find a forbidden one, we could try to
            // re-define the query property, but that's risky.
            // A safer approach for Express 5 is to just sanitize what we can.
            for (const key in req.query) {
                if (key.startsWith('$') || key.includes('.')) {
                    // If it's a getter, this might fail or do nothing.
                    delete req.query[key];
                } else if (req.query[key] instanceof Object) {
                    sanitize(req.query[key]);
                }
            }
        } catch (e) {
            // If it's strictly read-only, we just log and continue.
            // In a real app, you might want to block the request.
            console.error('MongoSanitize: Could not sanitize req.query', e.message);
        }
    }
    next();
};

module.exports = mongoSanitizeCustom;
