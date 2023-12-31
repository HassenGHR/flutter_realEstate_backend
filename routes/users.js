const express = require('express');
const userController = require('../controllers/usersControllers');

const router = express.Router();

// Route for adding a new user
router.post('/addUser', userController.addUser);
router.get('/:userId/', userController.getRealtorByUserId);


module.exports = router;
