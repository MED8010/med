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
  };

  // Shallow clone query to avoid Express 5 read-only issue if needed,
  // though sanitize function modifies in place.
  // In Express 5, req.query is a getter that returns a new object or a frozen one.

  if (req.query) {
    const newQuery = { ...req.query };
    sanitize(newQuery);
    // Use Object.defineProperty to override the getter if necessary,
    // but usually just modifying the clone and re-assigning might not work if it's only a getter.
    // However, we can try to override it.
    Object.defineProperty(req, 'query', {
      value: newQuery,
      writable: true,
      configurable: true
    });
  }

  if (req.body) sanitize(req.body);
  if (req.params) {
    const newParams = { ...req.params };
    sanitize(newParams);
    Object.defineProperty(req, 'params', {
      value: newParams,
      writable: true,
      configurable: true
    });
  }

  next();
};

module.exports = mongoSanitizeCustom;
