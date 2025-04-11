const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected user profile routes
router.get('/profile', authMiddleware.verifyToken, userController.getProfile);
router.get('/profile/full', authMiddleware.verifyToken, userController.getFullProfile);
router.put('/profile', authMiddleware.verifyToken, userController.updateProfile);
router.put('/preferences', authMiddleware.verifyToken, userController.updatePreferences);

// Plant management routes
router.get('/plants', authMiddleware.verifyToken, userController.getUserPlants);
router.post('/plants', authMiddleware.verifyToken, userController.addPlant);
router.put('/plants/:id', authMiddleware.verifyToken, userController.updatePlant);
router.delete('/plants/:id', authMiddleware.verifyToken, userController.removePlant);

module.exports = router;