/**
 * Custom NoSQL injection sanitizer for Express 5.
 *
 * Express 5 changed req.query, req.params to have only a getter (read-only),
 * which breaks libraries like express-mongo-sanitize that try to delete keys or reassign them.
 */
const mongoSanitizeCustom = (req, res, next) => {
    const sanitize = (obj) => {
      if (obj instanceof Object) {
        // Handle arrays separately to keep them as arrays
        if (Array.isArray(obj)) {
          return obj.map(v => sanitize(v));
        }

        const newObj = { ...obj };
        for (let key in newObj) {
          if (key.startsWith('$') || key.includes('.')) {
            delete newObj[key];
          } else {
            newObj[key] = sanitize(newObj[key]);
          }
        }
        return newObj;
      }
      return obj;
    };

    // In Express 5, req.query and req.params are read-only properties (getters).
    // We must use Object.defineProperty to overwrite them if they have only a getter.
    if (req.query) {
      const sanitizedQuery = sanitize(req.query);
      Object.defineProperty(req, 'query', {
        value: sanitizedQuery,
        writable: true,
        configurable: true,
        enumerable: true
      });
    }

    if (req.params) {
      const sanitizedParams = sanitize(req.params);
      Object.defineProperty(req, 'params', {
        value: sanitizedParams,
        writable: true,
        configurable: true,
        enumerable: true
      });
    }

    if (req.body) {
      req.body = sanitize(req.body);
    }

    next();
  };

  module.exports = mongoSanitizeCustom;
