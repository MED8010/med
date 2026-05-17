const sanitize = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => sanitize(v));
  } else if (obj !== null && typeof obj === 'object') {
    const newObj = {};
    Object.keys(obj).forEach(key => {
      if (key.startsWith('$') || key.includes('.')) {
        // Skip or sanitize the key
      } else {
        newObj[key] = sanitize(obj[key]);
      }
    });
    return newObj;
  }
  return obj;
};

const mongoSanitizeCustom = (req, res, next) => {
  if (req.query) {
    const sanitized = sanitize(req.query);
    Object.defineProperty(req, 'query', {
      value: sanitized,
      writable: true,
      configurable: true
    });
  }
  if (req.params) {
    const sanitized = sanitize(req.params);
    Object.defineProperty(req, 'params', {
      value: sanitized,
      writable: true,
      configurable: true
    });
  }
  if (req.body) {
    req.body = sanitize(req.body);
  }
  next();
};

module.exports = mongoSanitizeCustom;
