const { Router } = require('express');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/tasks.controller');
const { ensureAuthenticated } = require('../middleware/auth');

const router = Router();

// Reads are public.
router.get('/', getTasks);
router.get('/:id', getTaskById);

// Writes require a logged-in user (GitHub OAuth via /auth/github).
router.post('/', ensureAuthenticated, createTask);
router.put('/:id', ensureAuthenticated, updateTask);
router.delete('/:id', ensureAuthenticated, deleteTask);

module.exports = router;
