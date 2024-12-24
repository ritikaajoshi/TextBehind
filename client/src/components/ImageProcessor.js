import React, { useState, useRef } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

const ImageProcessor = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const canvasRef = useRef(null);
  const inputRef = useRef(null);

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
    return await cocoSsd.load();
  };

  const processImage = async () => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = async () => {
      const model = await loadModel();
      const predictions = await model.detect(img);

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);

      predictions.forEach((prediction) => {
        const { bbox } = prediction;
        const [x, y, width, height] = bbox;

        context.save();
        context.globalAlpha = 0.5;
        context.fillStyle = 'black';
        context.font = '30px Arial';
        context.fillText(text, x + 10, y + height + 30);
        context.restore();
      });
    };
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'modified-image.png';
    link.click();
  };

  return (
    <div>
      <h1>TextBehind - Place Text Behind Object</h1>
      <input type="file" onChange={handleImageUpload} />
      <br />
      <input
        type="text"
        placeholder="Enter text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button onClick={processImage}>Process Image</button>
      <button onClick={handleDownload}>Download Image</button>
      <br />
      {imageUrl && <img src={imageUrl} alt="Uploaded" width="200" />}
      <br />
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default ImageProcessor;
