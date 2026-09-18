const Task = require('../models/task.model');

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, done } = req.body;
    const task = await Task.create({ title, done });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { title, done } = req.body;
    const update = {};
    if (title !== undefined) update.title = title;
    if (done !== undefined) update.done = done;

    const task = await Task.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
