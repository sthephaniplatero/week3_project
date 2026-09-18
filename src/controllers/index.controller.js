const getRoot = (req, res) => {
  res.json({ message: 'Tasks API is running', health: '/health', tasks: '/tasks' });
};

const getHealth = (req, res) => {
  res.json({ status: 'ok' });
};

module.exports = { getRoot, getHealth };
