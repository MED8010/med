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

  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);

  // Express 5 makes req.query read-only in some environments,
  // so we redefine it to be writable if needed
  if (req.query) {
    const newQuery = JSON.parse(JSON.stringify(req.query));
    sanitize(newQuery);
    Object.defineProperty(req, 'query', {
      value: newQuery,
      writable: true,
      configurable: true
    });
  }

  next();
};

module.exports = mongoSanitizeCustom;
