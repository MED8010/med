const mongoSanitizeCustom = (req, res, next) => {
  const sanitize = (obj) => {
    if (obj instanceof Object) {
      for (const key in obj) {
        if (key.startsWith('$') || key.includes('.')) {
          delete obj[key];
        } else {
          sanitize(obj[key]);
        }
      }
    }
    return obj;
  };

  if (req.body) sanitize(req.body);

  // In Express 5, req.query and req.params might be read-only (getters)
  // We try to redefine them if they are not writable
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

  next();
};

module.exports = mongoSanitizeCustom;
