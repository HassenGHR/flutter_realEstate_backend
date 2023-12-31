const pool = require("../db");

const usersControllers = {
    addUser: async (req, res) => {
        try {
          const userData = req.body;
        
          // Extract necessary information from the user data
          const { name, first_name, last_name, email, id } = userData;
        
          console.log(userData);
        
          let newUser;
          let newRealtor;
      
          // Check if the user already exists
          const existingUserResult = await pool.query(
            'SELECT * FROM users WHERE facebook_id = $1',
            [id]
          );
      
          if (existingUserResult.rows.length > 0) {
            // User already exists, get the existing user_id
            newUser = existingUserResult.rows[0];
            newRealtor = newUser.id;
          } else {
            // Perform the database insertion for the user
            const userResult = await pool.query(
              'INSERT INTO users (name, email, facebook_id) VALUES ($1, $2, $3) RETURNING *',
              [name, email, id]
            );
      
            newUser = userResult.rows[0];

            const facebookProfile = `"https://web.facebook.com/profile.php?id="${id}`
      
            // Create a corresponding entry in realtors_realtor with a generated realtor_id
            const realtorResult = await pool.query(
              'INSERT INTO realtors_realtor (user_id, date_hired, facebook_profile) VALUES ($1, NOW(), $2) RETURNING *',
              [newUser.id,facebookProfile]
            );
      
            newRealtor = realtorResult.rows[0].user_id;
          }
      
          // Attach realtor_id to the response
          res.status(200).json({ newRealtor });
        } catch (error) {
          // Handle errors appropriately
          console.error('Error during user addition:', error.message);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      },
      
       getRealtorByUserId : async (req, res) => {
        const userId = req.params.userId
        try {
          // Retrieve the realtor by user ID
          const realtorResult = await pool.query(
            'SELECT * FROM realtors_realtor WHERE user_id = $1',
            [userId]
          );
      
          const realtor = realtorResult.rows[0];
      
          res.status(200).json({ realtor });
        } catch (error) {
          console.error('Error getting realtor by user ID:', error.message);
          throw error; // Propagate the error to be handled externally
        }
    }
      
      



}
module.exports = usersControllers;