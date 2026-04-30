/**
 * Custom middleware to sanitize NoSQL queries for Express 5
 */
const sanitize = (obj) => {
    if (obj && typeof obj === 'object') {
      const keys = Object.keys(obj);
      for (const key of keys) {
        if (key.startsWith('$')) {
          delete obj[key];
        } else if (typeof obj[key] === 'object') {
          sanitize(obj[key]);
        }
      }
    }
    return obj;
  };

  const mongoSanitizeCustom = (req, res, next) => {
    if (req.body) sanitize(req.body);

    // In Express 5, req.query and req.params might be read-only.
    // We sanitize them by creating a new sanitized object if they contain $ operators.
    if (req.query) {
      const sanitizedQuery = sanitize({ ...req.query });
      // Use Object.defineProperty to bypass read-only restriction if necessary,
      // but only if we actually changed something to minimize side effects.
      if (JSON.stringify(sanitizedQuery) !== JSON.stringify(req.query)) {
        try {
          Object.defineProperty(req, 'query', {
            value: sanitizedQuery,
            writable: true,
            configurable: true
          });
        } catch (e) {
          // Fallback: just update the object if it's writable
          req.query = sanitizedQuery;
        }
      }
    }

    if (req.params) {
      const sanitizedParams = sanitize({ ...req.params });
      if (JSON.stringify(sanitizedParams) !== JSON.stringify(req.params)) {
        try {
          Object.defineProperty(req, 'params', {
            value: sanitizedParams,
            writable: true,
            configurable: true
          });
        } catch (e) {
          req.params = sanitizedParams;
        }
      }
    }

    next();
  };

  module.exports = mongoSanitizeCustom;
