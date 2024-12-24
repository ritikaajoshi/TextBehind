// server/controllers/imageController.js

const path = require('path');
const fs = require('fs');

// Handle image upload
exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  
  const imagePath = req.file.path; // Path of the uploaded image
  res.status(200).json({
    success: true,
    imagePath: imagePath, // Return the image path to frontend
  });
};

// Example image processing function (this can be extended for text detection, etc.)
exports.processImage = (req, res) => {
  const { imagePath } = req.body;

  // Simulating an image processing task (like object detection)
  // In real implementation, this would include TensorFlow.js code for detecting objects in the image
  if (fs.existsSync(imagePath)) {
    // Here you could add logic to process the image (like drawing text on it, etc.)
    res.status(200).json({
      success: true,
      message: 'Image processed successfully.',
      processedImagePath: imagePath, // Returning the processed image path
    });
  } else {
    res.status(404).send('Image not found.');
  }
};
