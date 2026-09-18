const express = require('express');
const indexRoutes = require('./routes/index.routes');
const tasksRoutes = require('./routes/tasks.routes');

const app = express();

app.use(express.json());
app.use('/', indexRoutes);
app.use('/tasks', tasksRoutes);

module.exports = app;
