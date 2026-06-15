/**
 * Custom NoSQL Injection Sanitizer
 * Replaces express-mongo-sanitize for Express 5 compatibility
 * Express 5 uses read-only getters for req.query/req.params, so we must replace the object
 */

const sanitize = (obj) => {
  if (obj instanceof Object) {
    // Handle Arrays
    if (Array.isArray(obj)) {
      return obj.map(v => sanitize(v));
    }

    const newObj = {};
    for (const key in obj) {
      if (key.startsWith('$') || key.includes('.')) {
        // Skip keys that start with $ or contain .
        continue;
      }
      newObj[key] = sanitize(obj[key]);
    }
    return newObj;
  }
  return obj;
};

const mongoSanitizeCustom = (req, res, next) => {
  if (req.params) {
    req.params = sanitize({ ...req.params });
  }
  if (req.query) {
    // In Express 5 req.query is a getter, we need to redefine it or just replace the object if possible
    // Actually, we can define a new property
    const sanitizedQuery = sanitize({ ...req.query });
    Object.defineProperty(req, 'query', {
      value: sanitizedQuery,
      writable: true,
      enumerable: true,
      configurable: true
    });
  }
  if (req.body) {
    req.body = sanitize(req.body);
  }
  next();
};

module.exports = mongoSanitizeCustom;
