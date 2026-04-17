const sanitize = (obj) => {
  if (obj instanceof Object) {
    for (let key in obj) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else if (obj[key] instanceof Object) {
        sanitize(obj[key]);
      }
    }
  }
  return obj;
};

const mongoSanitizeCustom = (req, res, next) => {
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
  if (req.body) {
    sanitize(req.body);
  }
  next();
};

module.exports = mongoSanitizeCustom;
