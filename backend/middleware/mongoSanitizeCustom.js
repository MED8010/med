const mongoSanitizeCustom = (req, res, next) => {
  const sanitize = (obj) => {
    if (obj && typeof obj === 'object') {
      // Create a shallow copy to avoid mutating the original object if it's read-only
      // or to allow us to delete properties.
      const newObj = Array.isArray(obj) ? [...obj] : { ...obj };

      Object.keys(newObj).forEach(key => {
        if (key.startsWith('$') || key.includes('.')) {
          delete newObj[key];
        } else if (typeof newObj[key] === 'object') {
          newObj[key] = sanitize(newObj[key]);
        }
      });
      return newObj;
    }
    return obj;
  };

  if (req.body) req.body = sanitize(req.body);
  if (req.params) req.params = sanitize(req.params);

  if (req.query) {
    // In Express 5, req.query is often a read-only getter.
    // We use Object.defineProperty to overwrite it with the sanitized version.
    const sanitizedQuery = sanitize(req.query);
    Object.defineProperty(req, 'query', {
      value: sanitizedQuery,
      writable: true,
      configurable: true,
      enumerable: true
    });
  }

  next();
};

module.exports = mongoSanitizeCustom;
