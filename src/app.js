const express = require('express');
const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./docs/openapi');
const indexRoutes = require('./routes/index.routes');
const tasksRoutes = require('./routes/tasks.routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.get('/api-docs.json', (req, res) => res.json(openapiSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.use('/', indexRoutes);
app.use('/tasks', tasksRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
