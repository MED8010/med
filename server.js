require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
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

// Custom sanitization for Express 5 compatibility
// express-mongo-sanitize ^2.2.0 might have issues with Express 5's read-only req.query
app.use((req, res, next) => {
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
    return obj;
  };
  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);
  if (req.query) {
    try {
      // Create a plain object for sanitization to avoid read-only issues
      const queryObj = { ...req.query };
      sanitize(queryObj);
      // Try to re-assign if possible, otherwise Express 5 usually handles it
      // if it's already a plain object in some middleware chains
      req.query = queryObj;
    } catch (e) {
      // Fallback: If req.query is read-only, we skip sanitizing it here
      // but body and params are still covered.
    }
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
