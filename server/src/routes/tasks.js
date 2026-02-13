const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask } = require('../controllers/taskController');

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id', updateTask);

module.exports = router;
