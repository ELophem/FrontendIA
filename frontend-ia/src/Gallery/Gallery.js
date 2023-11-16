import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const GalleryPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const file = params.get('file');

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const image = new Image();
    image.src = file;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;

      // Rotate the image by 180°
      ctx.translate(image.width / 2, image.height / 2);
      ctx.rotate(Math.PI);
      ctx.drawImage(image, -image.width / 2, -image.height / 2);

      const rotatedImage = canvas.toDataURL('image/jpeg');

      // Pass the rotatedImage data to your AI function here
      // For example:
      // YourAIFunction(rotatedImage);

      //Display rotated image
      const rotatedImageElement = document.createElement('img');
      rotatedImageElement.src = rotatedImage;


      const galleryContainer = document.getElementById('gallery-container');
      galleryContainer.innerHTML = '';
      galleryContainer.appendChild(rotatedImageElement);

      // // Simulate download/save of the rotated image
      // const downloadLink = document.createElement('a');
      // downloadLink.href = rotatedImage;
      // downloadLink.download = 'rotated_image.jpeg';
      // downloadLink.click();
    };
  }, [file]);

  return (
    <div>
      <h2>Gallery:</h2>
      <div id="gallery-container">
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      </div>
    </div>
  );
};

export default GalleryPage;

