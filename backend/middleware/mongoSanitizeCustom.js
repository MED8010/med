/**
 * Custom NoSQL Injection Sanitizer for Express 5
 * Works by shallow-cloning req.query and req.params using defineProperty
 * to bypass Express 5 read-only restrictions.
 */
const mongoSanitizeCustom = (req, res, next) => {
  const sanitize = (obj) => {
    if (obj && typeof obj === 'object') {
      const isArray = Array.isArray(obj);
      const newObj = isArray ? [...obj] : { ...obj };
      let hasChanged = false;

      Object.keys(newObj).forEach((key) => {
        if (key.startsWith('$') || key.includes('.')) {
          delete newObj[key];
          hasChanged = true;
        } else if (typeof newObj[key] === 'object') {
          const { sanitized, changed } = sanitize(newObj[key]);
          newObj[key] = sanitized;
          if (changed) hasChanged = true;
        }
      });
      return { sanitized: newObj, changed: hasChanged };
    }
    return { sanitized: obj, changed: false };
  };

  if (req.query) {
    const { sanitized } = sanitize(req.query);
    Object.defineProperty(req, 'query', {
      value: sanitized,
      writable: true,
      configurable: true
    });
  }

  if (req.params) {
    const { sanitized } = sanitize(req.params);
    Object.defineProperty(req, 'params', {
      value: sanitized,
      writable: true,
      configurable: true
    });
  }

  if (req.body) {
    const { sanitized } = sanitize(req.body);
    req.body = sanitized;
  }

  next();
};

module.exports = mongoSanitizeCustom;
