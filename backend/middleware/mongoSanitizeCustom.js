/**
 * Custom NoSQL injection sanitizer for Express 5
 * Express 5 has read-only properties for req.query/req.params in some environments,
 * and express-mongo-sanitize might fail to modify them.
 */
const mongoSanitizeCustom = (req, res, next) => {
  const sanitize = (obj) => {
    if (obj instanceof Object) {
      for (const key in obj) {
        if (key.startsWith('$')) {
          delete obj[key];
        } else {
          sanitize(obj[key]);
        }
      }
    }
    return obj;
  };

  // For Express 5 compatibility, we might need to redefine the properties
  // if they are read-only, but usually re-assigning the whole object works if it's not frozen.
  if (req.body) sanitize(req.body);

  if (req.query) {
    try {
      const sanitizedQuery = sanitize({ ...req.query });
      Object.defineProperty(req, 'query', {
        value: sanitizedQuery,
        writable: true,
        configurable: true
      });
    } catch (e) {
      console.error("Failed to sanitize req.query", e);
    }
  }

  if (req.params) {
    try {
      const sanitizedParams = sanitize({ ...req.params });
      Object.defineProperty(req, 'params', {
        value: sanitizedParams,
        writable: true,
        configurable: true
      });
    } catch (e) {
      console.error("Failed to sanitize req.params", e);
    }
  }

  next();
};

module.exports = mongoSanitizeCustom;
