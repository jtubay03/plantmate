-- db-schema.sql
CREATE DATABASE IF NOT EXISTS plantmate;
USE plantmate;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  profile_image_url VARCHAR(255),
  date_joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  theme VARCHAR(20) DEFAULT 'light',
  measurement_unit VARCHAR(10) DEFAULT 'metric',
  notification_enabled BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Plants table - catalog of all plant types
CREATE TABLE IF NOT EXISTS plant_catalog (
  id INT AUTO_INCREMENT PRIMARY KEY,
  common_name VARCHAR(255) NOT NULL,
  scientific_name VARCHAR(255) NOT NULL,
  description TEXT,
  care_difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
  light_requirements TEXT,
  water_frequency TEXT,
  temperature_range VARCHAR(100),
  humidity_needs VARCHAR(100),
  pet_friendly BOOLEAN DEFAULT FALSE,
  image_url VARCHAR(255)
);

-- User plants - junction table between users and plants they own
CREATE TABLE IF NOT EXISTS user_plants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  plant_id INT NOT NULL,
  nickname VARCHAR(255),
  acquisition_date DATE,
  last_watered DATE,
  next_water_date DATE,
  notes TEXT,
  plant_health ENUM('healthy', 'needs_attention', 'critical') DEFAULT 'healthy',
  location VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (plant_id) REFERENCES plant_catalog(id) ON DELETE CASCADE
);