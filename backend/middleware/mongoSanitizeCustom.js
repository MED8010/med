const sanitize = (v) => {
  if (v instanceof Object) {
    for (const key in v) {
      if (key.startsWith('$') || key.includes('.')) {
        delete v[key];
      } else {
        sanitize(v[key]);
      }
    }
  }
  return v;
};

const mongoSanitizeCustom = (req, res, next) => {
  if (req.query) {
    const sanitizedQuery = JSON.parse(JSON.stringify(req.query));
    sanitize(sanitizedQuery);
    Object.defineProperty(req, 'query', {
      value: sanitizedQuery,
      writable: true,
      configurable: true
    });
  }
  if (req.params) {
    const sanitizedParams = JSON.parse(JSON.stringify(req.params));
    sanitize(sanitizedParams);
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
