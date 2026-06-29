const sanitize = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  const isArray = Array.isArray(obj);
  const newObj = isArray ? [] : {};

  for (const key in obj) {
    if (key.startsWith('$')) continue;

    if (typeof obj[key] === 'object') {
      newObj[key] = sanitize(obj[key]);
    } else {
      newObj[key] = obj[key];
    }
  }

  return newObj;
};

const mongoSanitizeCustom = (req, res, next) => {
  if (req.body) {
    req.body = sanitize(req.body);
  }

  // Handle read-only properties in Express 5
  if (req.query) {
    const sanitizedQuery = sanitize(req.query);
    Object.defineProperty(req, 'query', {
      value: sanitizedQuery,
      writable: true,
      configurable: true,
      enumerable: true
    });
  }

  if (req.params) {
    const sanitizedParams = sanitize(req.params);
    Object.defineProperty(req, 'params', {
      value: sanitizedParams,
      writable: true,
      configurable: true,
      enumerable: true
    });
  }

  next();
};

module.exports = mongoSanitizeCustom;
