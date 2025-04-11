const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

exports.register = async (req, res) => {
  try {
    const { username, email, password, password2 } = req.body;
    
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Check if email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    if (password != password2) {
      return res.status(400).json({ message: 'Both passwords must match'});
    }
    
    // Create user
    const user = await User.create({ username, email, password });
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFullProfile = async (req, res) => {
  try {
    const profile = await User.getFullProfile(req.user.id);
    if (!profile) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Get full profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, profile_image_url } = req.body;
    
    const user = await User.updateProfile(req.user.id, { username, profile_image_url });
    
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const { theme, measurement_unit } = req.body;
    
    const preferences = await User.updatePreferences(req.user.id, { theme, measurement_unit });
    
    res.json({ preferences });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Plant management
exports.getUserPlants = async (req, res) => {
  try {
    const plants = await User.getUserPlants(req.user.id);
    res.json({ plants });
  } catch (error) {
    console.error('Get user plants error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addPlant = async (req, res) => {
  try {
    const { plant_id, nickname, acquisition_date, last_watered, next_water_date, notes, location } = req.body;
    
    if (!plant_id) {
      return res.status(400).json({ message: 'Plant ID is required' });
    }
    
    const plant = await User.addPlant(req.user.id, {
      plant_id,
      nickname,
      acquisition_date,
      last_watered,
      next_water_date,
      notes,
      location
    });
    
    res.status(201).json({
      message: 'Plant added to your collection',
      plant
    });
  } catch (error) {
    console.error('Add plant error:', error);
    
    if (error.message === 'Plant not found in catalog') {
      return res.status(404).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePlant = async (req, res) => {
  try {
    const plantId = req.params.id;
    const updateData = req.body;
    
    const plant = await User.updatePlant(req.user.id, plantId, updateData);
    
    res.json({
      message: 'Plant updated successfully',
      plant
    });
  } catch (error) {
    console.error('Update plant error:', error);
    
    if (error.message === 'Plant not found or does not belong to user' || 
        error.message === 'No valid fields to update') {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removePlant = async (req, res) => {
  try {
    const plantId = req.params.id;
    
    await User.removePlant(req.user.id, plantId);
    
    res.json({
      message: 'Plant removed from your collection'
    });
  } catch (error) {
    console.error('Remove plant error:', error);
    
    if (error.message === 'Plant not found or does not belong to user') {
      return res.status(404).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};