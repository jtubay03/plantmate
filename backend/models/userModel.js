const db = require('./db');
const bcrypt = require('bcrypt');

const userModel = {
  // Create a new user
  async create(userData) {
    try {
      const { username, email, password } = userData;
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Insert user into database
      const [result] = await db.execute(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );
      
      const userId = result.insertId;
      
      // Create default preferences
      await db.execute(
        'INSERT INTO user_preferences (user_id) VALUES (?)',
        [userId]
      );
      
      // Get the created user (without password)
      const [users] = await db.execute(
        'SELECT id, username, email, profile_image_url, date_joined FROM users WHERE id = ?',
        [userId]
      );
      
      return users[0];
    } catch (error) {
      throw error;
    }
  },
  
  // Find user by email
  async findByEmail(email) {
    try {
      const [users] = await db.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      
      return users[0];
    } catch (error) {
      throw error;
    }
  },
  
  // Find user by ID
  async findById(id) {
    try {
      const [users] = await db.execute(
        'SELECT id, username, email, profile_image_url, date_joined FROM users WHERE id = ?',
        [id]
      );
      
      if (!users.length) return null;
      
      // Get user preferences
      const [preferences] = await db.execute(
        'SELECT theme, measurement_unit FROM user_preferences WHERE user_id = ?',
        [id]
      );
      
      // Combine user data with preferences
      const user = {
        ...users[0],
        preferences: preferences[0] || null
      };
      
      return user;
    } catch (error) {
      throw error;
    }
  },
  
  // Update user profile
  async updateProfile(id, data) {
    try {
      const { username, profile_image_url } = data;
      
      let query = 'UPDATE users SET ';
      const values = [];
      
      if (username) {
        query += 'username = ?, ';
        values.push(username);
      }
      
      if (profile_image_url) {
        query += 'profile_image_url = ?, ';
        values.push(profile_image_url);
      }
      
      // Remove trailing comma and space
      query = query.slice(0, -2);
      
      // Add WHERE clause
      query += ' WHERE id = ?';
      values.push(id);
      
      // Execute query if there are fields to update
      if (values.length > 1) {
        await db.execute(query, values);
      }
      
      // Return updated user
      return this.findById(id);
    } catch (error) {
      throw error;
    }
  },
  
  // Update user preferences
  async updatePreferences(userId, data) {
    try {
      const { theme, measurement_unit } = data;
      
      let query = 'UPDATE user_preferences SET ';
      const values = [];
      
      if (theme) {
        query += 'theme = ?, ';
        values.push(theme);
      }
      
      if (measurement_unit) {
        query += 'measurement_unit = ?, ';
        values.push(measurement_unit);
      }
      
      // Remove trailing comma and space
      query = query.slice(0, -2);
      
      // Add WHERE clause
      query += ' WHERE user_id = ?';
      values.push(userId);
      
      // Execute query if there are fields to update
      if (values.length > 1) {
        await db.execute(query, values);
      }
      
      // Get updated preferences
      const [preferences] = await db.execute(
        'SELECT theme, measurement_unit FROM user_preferences WHERE user_id = ?',
        [userId]
      );
      
      return preferences[0];
    } catch (error) {
      throw error;
    }
  },

  // Get user's plants
  async getUserPlants(userId) {
    try {
      const [plants] = await db.execute(`
        SELECT up.*, pc.common_name, pc.scientific_name, pc.image_url, pc.care_difficulty
        FROM user_plants up
        JOIN plant_catalog pc ON up.plant_id = pc.id
        WHERE up.user_id = ?
      `, [userId]);
      
      return plants;
    } catch (error) {
      throw error;
    }
  },

  // Add a plant to user's collection
  async addPlant(userId, plantData) {
    try {
      const { 
        plant_id, 
        nickname, 
        acquisition_date, 
        last_watered,
        next_water_date,
        notes,
        location
      } = plantData;
      
      // Verify that the plant exists in the catalog
      const [plantExists] = await db.execute(
        'SELECT id FROM plant_catalog WHERE id = ?',
        [plant_id]
      );
      
      if (!plantExists.length) {
        throw new Error('Plant not found in catalog');
      }
      
      // Add plant to user's collection
      const [result] = await db.execute(`
        INSERT INTO user_plants 
        (user_id, plant_id, nickname, acquisition_date, last_watered, next_water_date, notes, location)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        userId, 
        plant_id, 
        nickname || null, 
        acquisition_date || null, 
        last_watered || null,
        next_water_date || null,
        notes || null,
        location || null
      ]);
      
      // Get the newly added plant with plant catalog info
      const [plants] = await db.execute(`
        SELECT up.*, pc.common_name, pc.scientific_name, pc.image_url, pc.care_difficulty
        FROM user_plants up
        JOIN plant_catalog pc ON up.plant_id = pc.id
        WHERE up.id = ?
      `, [result.insertId]);
      
      return plants[0];
    } catch (error) {
      throw error;
    }
  },

  // Update a user's plant
  async updatePlant(userId, plantId, updateData) {
    try {
      // Make sure the plant belongs to the user
      const [userPlant] = await db.execute(
        'SELECT id FROM user_plants WHERE id = ? AND user_id = ?',
        [plantId, userId]
      );
      
      if (!userPlant.length) {
        throw new Error('Plant not found or does not belong to user');
      }
      
      // Build update query
      let query = 'UPDATE user_plants SET ';
      const values = [];
      const allowedFields = [
        'nickname', 
        'acquisition_date', 
        'last_watered', 
        'next_water_date', 
        'notes', 
        'plant_health', 
        'location'
      ];
      
      // Add fields to update
      const fieldsToUpdate = Object.keys(updateData).filter(key => 
        allowedFields.includes(key) && updateData[key] !== undefined
      );
      
      if (fieldsToUpdate.length === 0) {
        throw new Error('No valid fields to update');
      }
      
      fieldsToUpdate.forEach((field, index) => {
        query += `${field} = ?`;
        values.push(updateData[field]);
        
        if (index < fieldsToUpdate.length - 1) {
          query += ', ';
        }
      });
      
      query += ' WHERE id = ? AND user_id = ?';
      values.push(plantId, userId);
      
      // Execute update
      await db.execute(query, values);
      
      // Return updated plant
      const [plants] = await db.execute(`
        SELECT up.*, pc.common_name, pc.scientific_name, pc.image_url, pc.care_difficulty
        FROM user_plants up
        JOIN plant_catalog pc ON up.plant_id = pc.id
        WHERE up.id = ?
      `, [plantId]);
      
      return plants[0];
    } catch (error) {
      throw error;
    }
  },

  // Remove a plant from user's collection
  async removePlant(userId, plantId) {
    try {
      // Make sure the plant belongs to the user
      const [userPlant] = await db.execute(
        'SELECT id FROM user_plants WHERE id = ? AND user_id = ?',
        [plantId, userId]
      );
      
      if (!userPlant.length) {
        throw new Error('Plant not found or does not belong to user');
      }
      
      // Delete the plant
      await db.execute(
        'DELETE FROM user_plants WHERE id = ? AND user_id = ?',
        [plantId, userId]
      );
      
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  // Get full user profile with plants
  async getFullProfile(userId) {
    try {
      // Get user data
      const user = await this.findById(userId);
      if (!user) return null;
      
      // Get user's plants
      const plants = await this.getUserPlants(userId);
      
      // Return combined data
      return {
        ...user,
        plants
      };
    } catch (error) {
      throw error;
    }
  }
};

module.exports = userModel;