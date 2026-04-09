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
};

const mongoSanitizeCustom = (req, res, next) => {
  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);

  // In Express 5, req.query is a getter-only property on the prototype,
  // so we need to define it on the instance if we want to modify it directly.
  if (req.query) {
    const sanitizedQuery = { ...req.query };
    sanitize(sanitizedQuery);
    Object.defineProperty(req, 'query', {
      value: sanitizedQuery,
      writable: true,
      enumerable: true,
      configurable: true
    });
  }

  next();
};

module.exports = mongoSanitizeCustom;
