const mongoSanitizeCustom = () => (req, res, next) => {
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

  if (req && req.body) sanitize(req.body);

  if (req && req.query) {
    const sanitizedQuery = sanitize({ ...req.query });
    try {
      Object.defineProperty(req, 'query', {
        value: sanitizedQuery,
        writable: true,
        configurable: true
      });
    } catch (e) {}
  }

  if (req && req.params) {
    const sanitizedParams = sanitize({ ...req.params });
    try {
      Object.defineProperty(req, 'params', {
        value: sanitizedParams,
        writable: true,
        configurable: true
      });
    } catch (e) {}
  }

  if (typeof next === 'function') {
    next();
  }
};

module.exports = mongoSanitizeCustom;
