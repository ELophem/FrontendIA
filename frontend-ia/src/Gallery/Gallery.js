// import React, { useEffect, useRef, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { storage } from '../Firebase/firebaseConfig'; 
// import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'; 
// import { v4 } from 'uuid'; 
// import { firestore } from '../Firebase/firebaseConfig';
// import { addDoc, collection } from 'firebase/firestore';

// const GalleryPage = () => {
//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const file = params.get('file'); 

//   const canvasRef = useRef(null);
//   const [imageDisplayed, setImageDisplayed] = useState(false); 
//   const [imageUploaded, setImageUploaded] = useState(false); 

//   useEffect(() => {
//     if (file && !imageDisplayed) {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext('2d');

//       const image = new Image();
//       image.src = file;

//       image.onload = () => {
//         canvas.width = image.width;
//         canvas.height = image.height;

//         // Rotate the image by 180°
//         ctx.translate(image.width / 2, image.height / 2);
//         ctx.rotate(Math.PI);
//         ctx.drawImage(image, -image.width / 2, -image.height / 2);

//         const AIimage = canvas.toDataURL('image/jpeg');

//         // Display rotated image
//         const AIimageElement = document.createElement('img');
//         AIimageElement.src = AIimage;

//         const galleryContainer = document.getElementById('gallery-container');
//         galleryContainer.innerHTML = '';
//         galleryContainer.appendChild(AIimageElement);

//         setImageDisplayed(true); // Set imageDisplayed to true after image is displayed

//         // Implement AI function here (for future use)
//         // YourAIFunction(AIimage);
//         // This is where you'll integrate AI processing with the rotated image
//         // For now, this section serves as a placeholder for AI integration.
//       };
//     }
//   }, [file, imageDisplayed]);

//   useEffect(() => {
//     if (imageDisplayed && !imageUploaded) {
//       uploadImage();
//     }
//   }, [imageDisplayed, imageUploaded]);

//   const uploadImage = async () => {
//     try {
//       const canvas = canvasRef.current;
//       const AIimage = canvas.toDataURL('image/jpeg');
  
//       const imageRef = ref(storage, `${v4()}.jpg`);
//       const byteCharacters = atob(AIimage.split(',')[1]);
//       const byteNumbers = new Array(byteCharacters.length);
  
//       for (let i = 0; i < byteCharacters.length; i++) {
//         byteNumbers[i] = byteCharacters.charCodeAt(i);
//       }
  
//       const byteArray = new Uint8Array(byteNumbers);
//       const imageBlob = new Blob([byteArray], { type: 'image/jpeg' });
  
//       const snapshot = await uploadBytes(imageRef, imageBlob);
//       console.log('Image uploaded successfully:', snapshot);
  
//       // Get download URL of the uploaded image
//       const downloadURL = await getDownloadURL(snapshot.ref);
//       console.log('Download URL:', downloadURL);
  
//       const db = firestore;
//       console.log(db);
  
//       const personsRef = collection(db, 'Persons');
//       await addDoc(personsRef, {
//         name: 'John',
//         surname: 'Doe',
//         photo: downloadURL // Store the download URL in the Firestore document
//       });
  
//       setImageUploaded(true); // Set imageUploaded to true after successful upload
//     } catch (error) {
//       console.error('Error uploading image:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Gallery:</h2>
//       <div id="gallery-container">
//         <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
//       </div>
//     </div>
//   );
// };

// export default GalleryPage;

import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { storage } from '../Firebase/firebaseConfig';
import { ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
import { getDownloadURL} from 'firebase/storage'; 
import { firestore } from '../Firebase/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
 
const GalleryPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const file = params.get('file');
 
  const canvasRef = useRef(null);
  const [imageDisplayed, setImageDisplayed] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const names = location.state?.names.result;
   
  useEffect(() => {
    if (file && !imageDisplayed) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
 
      const image = new Image();
      image.src = file;
 
      image.onload = () =>  {

        const centerX = canvas.width /2 - image.width/2;
        const centerY = canvas.height/2 - image.height/2;
 
        canvas.width = image.width;
        canvas.height = image.height;
        
        ctx.clearRect(0,0,canvas.width, canvas.height);
        ctx.drawImage(image, centerX, centerY);
 
        const AIimage = canvas.toDataURL('image/jpeg');
       
        const AIimageElement = document.createElement('img');
        AIimageElement.src = AIimage;

        const galleryContainer = document.getElementById('gallery-container');
        galleryContainer.innerHTML = '';
        galleryContainer.appendChild(AIimageElement);

        setImageDisplayed(true);
      };
    }
}, [file, imageDisplayed, names]);
 
  useEffect(() => {
    if (imageDisplayed && !imageUploaded) {
      uploadImage();
    }
  }, [imageDisplayed, imageUploaded]);
 
  const uploadImage = async () => {
    try {
      const canvas = canvasRef.current;
      const AIimage = canvas.toDataURL('image/jpeg');
 
      const imageRef = ref(storage, `${v4()}.jpg`);
      const byteCharacters = atob(AIimage.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
 
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
 
      const byteArray = new Uint8Array(byteNumbers);
      const imageBlob = new Blob([byteArray], { type: 'image/jpeg' });
 
      const snapshot = await uploadBytes(imageRef, imageBlob);
      console.log('Image uploaded successfully:', snapshot);
 
      // Get download URL of the uploaded image
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Download URL:', downloadURL);
 
      const db = firestore;
      console.log(db);
 
      const personsRef = collection(db, 'Persons');

      const data = {
        Photo: downloadURL
      };

      names.forEach((name, index) => {
        data[`Person${index + 1}`] = name;
      });

      await addDoc(personsRef, data);
      setImageUploaded(true); // Set imageUploaded to true after successful upload
    } catch (error) {
      console.error('Error uploading image:', error);
    }
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
