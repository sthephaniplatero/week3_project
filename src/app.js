const express = require('express');
const indexRoutes = require('./routes/index.routes');
const tasksRoutes = require('./routes/tasks.routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use('/', indexRoutes);
app.use('/tasks', tasksRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
