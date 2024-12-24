// server/routes/imageRoutes.js

const express = require('express');
const multer = require('multer'); // Multer for handling file uploads
const path = require('path');
const imageController = require('../controllers/imageController'); // Image controller for logic

const router = express.Router();

// Setup multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save uploaded images in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use unique filenames
  },
});

const upload = multer({ storage: storage });

// Route to handle image upload and return image path
router.post('/upload', upload.single('image'), imageController.uploadImage);

// Example route for other image processing tasks (like detecting objects)
router.post('/process', imageController.processImage);

module.exports = router;
