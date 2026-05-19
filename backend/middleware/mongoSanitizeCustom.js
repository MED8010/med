const sanitize = (obj) => {
  if (obj instanceof Object) {
    const sanitized = Array.isArray(obj) ? [...obj] : { ...obj };
    for (const key in sanitized) {
      if (key.startsWith('$')) {
        delete sanitized[key];
      } else {
        sanitized[key] = sanitize(sanitized[key]);
      }
    }
    return sanitized;
  }
  return obj;
};

const mongoSanitizeCustom = (req, res, next) => {
  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.params) {
    const sanitizedParams = sanitize(req.params);
    Object.defineProperty(req, 'params', {
      value: sanitizedParams,
      writable: true,
      configurable: true
    });
  }
  if (req.query) {
    const sanitizedQuery = sanitize(req.query);
    Object.defineProperty(req, 'query', {
      value: sanitizedQuery,
      writable: true,
      configurable: true
    });
  }
  next();
};

module.exports = mongoSanitizeCustom;
