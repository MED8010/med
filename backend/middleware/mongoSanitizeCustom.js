/**
 * Custom NoSQL Injection Sanitizer
 * Replaces express-mongo-sanitize because of Express 5 read-only req.query issues.
 */

const sanitizeObject = (obj) => {
  if (obj instanceof Object) {
    const sanitized = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
      if (key.startsWith('$') || key.includes('.')) {
        // Skip keys that start with $ or contain .
        continue;
      }

      const value = obj[key];
      if (value instanceof Object) {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }
  return obj;
};

const mongoSanitizeCustom = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  if (req.query) {
    // In Express 5, req.query is a getter/setter or read-only depending on config.
    // We attempt to redefine it or just clear the properties.
    const sanitizedQuery = sanitizeObject(req.query);

    // Using Object.defineProperty to bypass potential read-only issues in Express 5
    try {
      Object.defineProperty(req, 'query', {
        value: sanitizedQuery,
        writable: true,
        configurable: true
      });
    } catch (e) {
      // Fallback: modify in place if possible
      for (const key in req.query) {
        if (key.startsWith('$') || key.includes('.')) {
          delete req.query[key];
        }
      }
    }
  }

  next();
};

module.exports = mongoSanitizeCustom;
