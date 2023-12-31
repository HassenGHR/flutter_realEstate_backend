const pool = require("../db");
// const jwt = require('jsonwebtoken');

// const CryptoJS = require('crypto-js');

const realtorController = {
  getAllRealtors: async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM realtors_realtor;");
      const realtors = result.rows;
      res.status(200).json(realtors);
    } catch (error) {
      console.error("Failed to get realtors:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  addedNewRealtor: async (req, res) => {
    const {
      name,
      photo,
      description,
      phone,
      top_seller,
      date_hired,
      facebook_profile,
      email,
    } = newRealtor;

    const query = `
    INSERT INTO realtors_realtor (name, photo, description, phone, top_seller, date_hired, facebook_profile, email)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;

    try {
      const result = await pool.query(query, [
        name,
        photo,
        description,
        phone,
        top_seller,
        date_hired,
        facebook_profile,
        email,
      ]);

      const newRealtor = result.rows[0];
      return newRealtor;
    } catch (error) {
      console.error("Failed to add realtor:", error.message);
      throw new Error("Internal Server Error");
    }
  },
  getRealtorsByListingId: async (req, res) => {
    try {
        const listingId = req.params.id;
        const query = `SELECT * FROM realtors_realtor WHERE id = $1;`;
        
        // Execute the query using the pool
        const result = await pool.query(query, [listingId]);
        
        // Extract the rows from the result
        const realtors = result.rows;

        // Respond with the realtors data
        res.status(200).json(realtors);
    } catch (error) {
        // Handle errors
        console.error("Failed to get realtors:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
},

  

};

module.exports = realtorController;
