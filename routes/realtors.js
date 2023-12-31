const express = require('express');
const router = express.Router();
const realtorController = require('../controllers/realtorsControllers');

// Define routes
router.get('/', realtorController.getAllRealtors);
router.get('/:id', realtorController.getRealtorsByListingId)

module.exports = router;