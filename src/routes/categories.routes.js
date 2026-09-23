const { Router } = require('express');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categories.controller');
const { ensureAuthenticated } = require('../middleware/auth');

const router = Router();

// Reads are public.
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Writes require a logged-in user (GitHub OAuth via /auth/github).
router.post('/', ensureAuthenticated, createCategory);
router.put('/:id', ensureAuthenticated, updateCategory);
router.delete('/:id', ensureAuthenticated, deleteCategory);

module.exports = router;
