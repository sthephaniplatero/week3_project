let tasks = [
  { id: 1, title: 'Learn Express', done: false },
  { id: 2, title: 'Build a REST API', done: false },
];
let nextId = 3;

const getTasks = (req, res) => {
  res.json(tasks);
};

const getTaskById = (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
};

const createTask = (req, res) => {
  const { title, done = false } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });

  const task = { id: nextId++, title, done };
  tasks.push(task);
  res.status(201).json(task);
};

const updateTask = (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const { title, done } = req.body;
  if (title !== undefined) task.title = title;
  if (done !== undefined) task.done = done;

  res.json(task);
};

const deleteTask = (req, res) => {
  const index = tasks.findIndex((t) => t.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Task not found' });

  tasks.splice(index, 1);
  res.status(204).send();
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
