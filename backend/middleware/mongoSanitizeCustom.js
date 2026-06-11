// Custom NoSQL injection sanitizer for Express 5
// Express 5 makes req.query a read-only property (getter only)
// so express-mongo-sanitize fails when trying to overwrite it.

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
  if (req.body) {
    req.body = sanitize({ ...req.body });
  }

  // We can't overwrite req.query directly, but we can try to sanitize its content
  // OR we can redefine it if it's configurable
  if (req.query) {
     try {
       const sanitizedQuery = sanitize({ ...req.query });
       Object.defineProperty(req, 'query', {
         value: sanitizedQuery,
         writable: true,
         enumerable: true,
         configurable: true
       });
     } catch (e) {
       // If redefinition fails, we at least sanitized body and params
     }
  }

  if (req.params) {
    req.params = sanitize({ ...req.params });
  }

  next();
};

module.exports = mongoSanitizeCustom;
