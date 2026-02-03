const express = require('express');
const router = express.Router();
const {
  getTasks,
  getMyTasks,
  getTask,
  createTask,
  updateTask,
  completeTask,
  deleteTask
} = require('../controllers/task.controller');
const { protect, authorize } = require('../middleware/auth');
const { createTaskValidator, mongoIdValidator } = require('../middleware/validators');

router.use(protect);

router.get('/my', getMyTasks);
router.route('/')
  .get(getTasks)
  .post(createTaskValidator, createTask);

router.route('/:id')
  .get(mongoIdValidator, getTask)
  .put(mongoIdValidator, updateTask)
  .delete(mongoIdValidator, authorize('admin'), deleteTask);

router.put('/:id/complete', mongoIdValidator, completeTask);

module.exports = router;
