const mongoSanitizeCustom = (req, res, next) => {
  const sanitize = (obj) => {
    if (obj instanceof Object) {
      for (const key in obj) {
        if (/^\$/.test(key)) {
          delete obj[key];
        } else {
          sanitize(obj[key]);
        }
      }
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitize({ ...req.body });
  }

  // Handling req.query and req.params which might be read-only in Express 5
  if (req.query) {
    const sanitizedQuery = sanitize({ ...req.query });
    Object.defineProperty(req, 'query', {
      value: sanitizedQuery,
      writable: true,
      configurable: true
    });
  }

  if (req.params) {
    const sanitizedParams = sanitize({ ...req.params });
    Object.defineProperty(req, 'params', {
      value: sanitizedParams,
      writable: true,
      configurable: true
    });
  }

  next();
};

module.exports = mongoSanitizeCustom;
