// server/server.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 5000;

// Setup multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.static('public'));

// Route to upload image
app.post('/upload', upload.single('image'), (req, res) => {
  res.json({ imagePath: req.file.path });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
