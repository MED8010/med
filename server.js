require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
// const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./backend/config/database');
const auditMiddleware = require('./backend/middleware/audit');

// Routes
const authRoutes = require('./backend/routes/authRoutes');
const employeRoutes = require('./backend/routes/employeRoutes');
const pointageRoutes = require('./backend/routes/pointageRoutes');
const congeRoutes = require('./backend/routes/congeRoutes');
const salaireRoutes = require('./backend/routes/salaireRoutes');
const structureRoutes = require('./backend/routes/structureRoutes');
const auditRoutes = require('./backend/routes/auditRoutes');
const notificationRoutes = require('./backend/routes/notifications');
const userRoutes = require('./backend/routes/userRoutes');

// Connexion à la BD
connectDB();

const app = express();

// Security Middlewares
app.use(helmet()); // Secure headers
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: 'Trop de requêtes, veuillez réessayer plus tard.' }
});
app.use('/api/', limiter);

app.use(express.json());
// app.use(mongoSanitize()); // Prevent NoSQL injection

// Simple custom sanitizer for Express 5 compatibility (sanitizes body, params, and query)
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (obj && typeof obj === 'object') {
      const sanitizedObj = Array.isArray(obj) ? [] : {};
      for (const key in obj) {
        if (!key.startsWith('$')) {
          sanitizedObj[key] = sanitize(obj[key]);
        }
      }
      return sanitizedObj;
    }
    return obj;
  };

  if (req.body) req.body = sanitize(req.body);
  if (req.params) req.params = sanitize(req.params);
  if (req.query) {
    // In Express 5, req.query is a getter. We need to overwrite it.
    const sanitizedQuery = sanitize(req.query);
    Object.defineProperty(req, 'query', {
      value: sanitizedQuery,
      enumerable: true,
      configurable: true,
      writable: true
    });
  }
  next();
});

app.use(auditMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employes', employeRoutes);
app.use('/api/pointages', pointageRoutes);
app.use('/api/conges', congeRoutes);
app.use('/api/salaires', salaireRoutes);
app.use('/api/structure', structureRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Serveur est en ligne' });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Écouter sur le port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Serveur démarré sur le port ${PORT}`);
});
