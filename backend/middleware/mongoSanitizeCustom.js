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
};

const mongoSanitizeCustom = (req, res, next) => {
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
