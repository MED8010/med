/**
 * Custom NoSQL Injection Sanitizer for Express 5
 * Express 5 makes req.query and req.params read-only (getters).
 * This middleware bypasses that by using Object.defineProperty to redefine them.
 */

const sanitize = (v) => {
  if (v && typeof v === 'object') {
    for (const key in v) {
      if (Object.prototype.hasOwnProperty.call(v, key)) {
        if (key.startsWith('$')) {
          delete v[key];
        } else {
          sanitize(v[key]);
        }
      }
    }
  }
  return v;
};

const mongoSanitizeCustom = (req, res, next) => {
  if (req.query) {
    const sanitizedQuery = sanitize({ ...req.query });
    Object.defineProperty(req, 'query', {
      value: sanitizedQuery,
      writable: true,
      enumerable: true,
      configurable: true
    });
  }

  if (req.params) {
    const sanitizedParams = sanitize({ ...req.params });
    Object.defineProperty(req, 'params', {
      value: sanitizedParams,
      writable: true,
      enumerable: true,
      configurable: true
    });
  }

  if (req.body) {
    sanitize(req.body);
  }

  next();
};

module.exports = mongoSanitizeCustom;
