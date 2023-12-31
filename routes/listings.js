const express = require('express');
const multer = require('multer');

const router = express.Router();
const listingController = require('../controllers/listingsController');
// Define routes
router.get('/', listingController.getAllListings);
router.get('/realtor/:realtorId', listingController.getRealtorListings);
router.delete('/:id', listingController.removeListing);
router.get('/search', listingController.getListingsByHomeAndSaleType);
router.get('/:listingId', listingController.getListingById)


module.exports = router;
