import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { storage } from '../Firebase/firebaseConfig'; 
import { ref, uploadBytes } from 'firebase/storage'; 
import { v4 } from 'uuid'; 

const GalleryPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const file = params.get('file'); 

  const canvasRef = useRef(null);
  const [imageDisplayed, setImageDisplayed] = useState(false); 
  const [imageUploaded, setImageUploaded] = useState(false); 

  useEffect(() => {
    if (file && !imageDisplayed) {
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

        // Display rotated image
        const rotatedImageElement = document.createElement('img');
        rotatedImageElement.src = rotatedImage;

        const galleryContainer = document.getElementById('gallery-container');
        galleryContainer.innerHTML = '';
        galleryContainer.appendChild(rotatedImageElement);

        setImageDisplayed(true); // Set imageDisplayed to true after image is displayed

        // Implement AI function here (for future use)
        // YourAIFunction(rotatedImage);
        // This is where you'll integrate AI processing with the rotated image
        // For now, this section serves as a placeholder for AI integration.
      };
    }
  }, [file, imageDisplayed]);

  useEffect(() => {
    if (imageDisplayed && !imageUploaded) {
      uploadImage();
    }
  }, [imageDisplayed, imageUploaded]);

  const uploadImage = () => {
    const canvas = canvasRef.current;
    const rotatedImage = canvas.toDataURL('image/jpeg');

    const imageRef = ref(storage, `Photos/${v4()}.jpg`);
    const byteCharacters = atob(rotatedImage.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const imageBlob = new Blob([byteArray], { type: 'image/jpeg' });

    uploadBytes(imageRef, imageBlob)
      .then((snapshot) => {
        console.log('Image uploaded successfully:', snapshot);
        // You can get the uploaded image URL from snapshot.metadata.fullPath or snapshot.ref.getDownloadURL()
        setImageUploaded(true); // Set imageUploaded to true after successful upload
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
      });
  };

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
