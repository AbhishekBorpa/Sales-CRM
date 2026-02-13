const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getAllUsers } = require('../controllers/userController');

router.get('/me', getProfile);
router.patch('/me', updateProfile);
router.get('/', getAllUsers);

module.exports = router;
