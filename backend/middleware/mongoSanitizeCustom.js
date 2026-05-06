/**
 * Custom NoSQL injection sanitizer for Express 5
 * Bypasses read-only property restrictions on req.query and req.params
 */
const mongoSanitizeCustom = (req, res, next) => {
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
  };

  if (req.body) sanitize(req.body);

  if (req.query) {
    const sanitizedQuery = { ...req.query };
    sanitize(sanitizedQuery);
    Object.defineProperty(req, 'query', {
      value: sanitizedQuery,
      writable: true,
      configurable: true
    });
  }

  if (req.params) {
    const sanitizedParams = { ...req.params };
    sanitize(sanitizedParams);
    Object.defineProperty(req, 'params', {
      value: sanitizedParams,
      writable: true,
      configurable: true
    });
  }

  next();
};

module.exports = mongoSanitizeCustom;
