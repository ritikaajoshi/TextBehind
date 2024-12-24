import React, { useState, useRef } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

const ImageProcessor = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const canvasRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
        setImageUrl(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const loadModel = async () => {
    try {
      return await cocoSsd.load();
    } catch (error) {
      console.error('Error loading model:', error);
      alert('Failed to load model. Please try again later.');
    }
  };

  const processImage = async () => {
    if (!imageUrl) {
      alert('Please upload an image first.');
      return;
    }

    const img = new Image();
    img.src = imageUrl;
    img.onload = async () => {
      const model = await loadModel();
      if (!model) return;

      const predictions = await model.detect(img);

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);

      predictions.forEach((prediction) => {
        const { bbox } = prediction;
        const [x, y, width, height] = bbox;

        // Draw text with semi-transparent background
        context.save();
        context.globalAlpha = 0.5;
        context.fillStyle = 'black';
        context.fillRect(x, y + height + 10, context.measureText(text).width + 20, 40);
        context.globalAlpha = 1;
        context.fillStyle = 'white';
        context.font = '20px Arial';
        context.fillText(text, x + 10, y + height + 35);
        context.restore();
      });
    };
    img.onerror = () => {
      alert('Failed to load image. Please try another image.');
    };
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      alert('No processed image available to download.');
      return;
    }
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'processed-image.png';
    link.click();
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>TextBehind - Place Text Behind Object</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginBottom: '10px' }} />
      <br />
      <input
        type="text"
        placeholder="Enter text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px', width: '200px' }}
      />
      <br />
      <button onClick={processImage} style={{ marginRight: '10px', padding: '10px 20px' }}>
        Process Image
      </button>
      <button onClick={handleDownload} style={{ padding: '10px 20px' }}>
        Download Image
      </button>
      <br />
      {imageUrl && <img src={imageUrl} alt="Uploaded Preview" width="300" style={{ marginTop: '20px' }} />}
      <br />
      <canvas ref={canvasRef} style={{ display: 'block', margin: '20px auto', border: '1px solid black' }}></canvas>
    </div>
  );
};

export default ImageProcessor;
