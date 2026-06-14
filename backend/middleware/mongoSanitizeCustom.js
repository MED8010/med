/**
 * Custom NoSQL Injection Sanitizer
 * Replaces express-mongo-sanitize to avoid read-only property issues in Express 5
 */
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
  return obj;
};

const mongoSanitizeCustom = (req, res, next) => {
  // We need to be careful with Express 5 as req.query might be read-only (getter)
  // We'll create sanitized copies if needed

  if (req.body) {
    sanitize(req.body);
  }

  if (req.params) {
    sanitize(req.params);
  }

  if (req.query) {
    // If it's a getter/read-only, we might need to redefine it or just sanitize the object if it's mutable
    try {
      const sanitizedQuery = sanitize({ ...req.query });
      Object.defineProperty(req, 'query', {
        value: sanitizedQuery,
        writable: true,
        enumerable: true,
        configurable: true
      });
    } catch (e) {
      // Fallback if defineProperty fails
      sanitize(req.query);
    }
  }

  next();
};

module.exports = mongoSanitizeCustom;
