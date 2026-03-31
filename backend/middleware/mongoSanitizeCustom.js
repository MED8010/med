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

const mongoSanitizeCustom = (req, res, next) => {
  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);
  if (req.query) {
    // In Express 5, req.query is a getter.
    // We create a sanitized copy and then redefine the property on the request.
    const sanitizedQuery = sanitize({ ...req.query });
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
