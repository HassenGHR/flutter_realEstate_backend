const pool = require("../db");
const multer = require('multer');
const upload = multer()
const listingController = {
  getAllListings: async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM listings_listing");
      const listings = result.rows;
  
      const listingsWithImages = await Promise.all(listings.map(async (listing) => {
        if (listing.photo_main) {
          // If photo_main exists, no need to get images from listing_images
          return listing;
        } else {
          // Retrieve images from listing_images for the corresponding listing
          const imagesResult = await pool.query("SELECT * FROM listing_images WHERE listing_id = $1", [listing.id]);
          const images = imagesResult.rows[0];
  
          // Combine listing data with images
          return { ...listing, images };
        }
      }));
  
      res.status(200).json(listingsWithImages);
    } catch (error) {
      console.error("Failed to get listings:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getListingById: async (req, res) => {
    const listingId = req.params.listingId;

    try {
      const result = await pool.query('SELECT * FROM listings_listing WHERE id = $1', [listingId]);
      const listings = result.rows;
  
      if (listings.length > 0) {
        // Send the listing data to the client
        res.json(listings[0]);
      } else {
        // If no listing is found with the specified ID
        res.status(404).json({ error: 'Listing not found' });
      }
    } catch (error) {
      // Handle database query errors
      console.error('Error fetching listing:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getListingsByHomeAndSaleType: async (req, res) => {
    try {
      const { home_type, sale_type } = req.query;
  
      if (!home_type || !sale_type) {
        return res
          .status(400)
          .json({
            error: "Both home_type and sale_type parameters are required",
          });
      }
  
      let query;
      let result;
  
      if (home_type === "All") {
        query = "SELECT * FROM listings_listing WHERE TRIM(sale_type) = $1";
        result = await pool.query(query, [sale_type]);
      } else if (sale_type === "All") {
        query = "SELECT * FROM listings_listing WHERE TRIM(home_type) = $1";
        result = await pool.query(query, [home_type]);
      } else {
        query =
          "SELECT * FROM listings_listing WHERE TRIM(home_type) = $1 AND TRIM(sale_type) = $2";
        result = await pool.query(query, [home_type, sale_type]);
      }
  
      const listings = result.rows;
  
      const listingsWithImages = await Promise.all(listings.map(async (listing) => {
        if (listing.photo_main) {
          // If photo_main exists, no need to get images from listing_images
          return listing;
        } else {
          // Retrieve images from listing_images for the corresponding listing
          const imagesResult = await pool.query("SELECT * FROM listing_images WHERE listing_id = $1", [listing.id]);
          const images = imagesResult.rows[0];
  
          // Combine listing data with images
          return { ...listing, images };
        }
      }));
  
      res.status(200).json(listingsWithImages);
    } catch (error) {
      console.error("Failed to get listings by home and sale type:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  removeListing: async (req, res) => {
    try {
        const listingId = req.params.id;

        const query = "DELETE FROM listings_listing WHERE id = $1";
        const result = await pool.query(query, [listingId]);

        // Handle the result or send a response as needed
        res.status(200).json({ success: true, message: 'Listing removed successfully' });

    } catch (error) {
        console.error('Error removing listing:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
},

  getRealtorListings:  async (req, res) => {
    try {
      // Get the realtor ID from the authenticated user
      
      const realtorId =  parseInt(req.params.realtorId)

  
      // Use parameterized query to prevent SQL injection
      const queryText = 'SELECT * FROM listings_listing WHERE realtor_id = $1';
      const result = await pool.query(queryText, [realtorId]);
  
      // Extract the listings from the query result
      const listings = result.rows;
  
      // Send the listings as JSON response
      res.status(200).json({ listings });
    } catch (error) {
      console.error('Error retrieving realtor listings:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  
};
module.exports = listingController;
