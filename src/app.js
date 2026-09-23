const express = require('express');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const swaggerUi = require('swagger-ui-express');
const passport = require('./config/passport');
const openapiSpec = require('./docs/openapi');
const indexRoutes = require('./routes/index.routes');
const authRoutes = require('./routes/auth.routes');
const tasksRoutes = require('./routes/tasks.routes');
const categoriesRoutes = require('./routes/categories.routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET is not set in the environment');
}

const app = express();

// Render (and most PaaS hosts) sit behind a reverse proxy that terminates
// HTTPS, so Express needs this to know the original request was secure and
// set `secure` cookies correctly.
app.set('trust proxy', 1);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/api-docs.json', (req, res) => res.json(openapiSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/tasks', tasksRoutes);
app.use('/categories', categoriesRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
