// All of the imports
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { storage } from '../Firebase/firebaseConfig';
import { ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
import { getDownloadURL} from 'firebase/storage'; 
import { firestore } from '../Firebase/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import './Display.css'

// Page where the result of the images going through the AI are shown.
const DisplayPage = () => {
  //Using React Router and useLocation it extracts the file parameter
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const file = params.get('file');
  // Canvas element referencing
  const canvasRef = useRef(null);
  const [imageDisplayed, setImageDisplayed] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const names = location.state?.names.result;
  
  //UseEffect that is used to display the image on the canvas when there is no file and image displayed on it.
  useEffect(() => {
    if (file && !imageDisplayed) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
 
      const image = new Image();
      image.src = file;
 
      image.onload = () =>  {
        //Calculating image position and size on the canvas
        const centerX = canvas.width /2 - image.width/2;
        const centerY = canvas.height/2 - image.height/2;
 
        canvas.width = image.width;
        canvas.height = image.height;
        // Drawing the image on the canvas
        ctx.clearRect(0,0,canvas.width, canvas.height);
        ctx.drawImage(image, centerX, centerY);
        //converting the canvas content to a url
        const AIimage = canvas.toDataURL('image/jpeg');
        // creating an img element to be able to show the image that went through the AI
        const AIimageElement = document.createElement('img');
        AIimageElement.src = AIimage;
        AIimageElement.classList.add('display-image');

        //Displaying the image
        const displayContainer = document.getElementById('display-container');
        displayContainer.innerHTML = '';
        displayContainer.appendChild(AIimageElement);

        setImageDisplayed(true);
      };
    }
}, [file, imageDisplayed, names]);
  //UseEffect to upload the displayed image when it is displayed but not uploaded yet
  useEffect(() => {
    if (imageDisplayed && !imageUploaded) {
      uploadImage(); //Uploading the image to firebase storage
    }
  }, [imageDisplayed, imageUploaded]);
  //function to upload the AI processedd image to Firebase
  const uploadImage = async () => {
    try {
      const canvas = canvasRef.current;
      const AIimage = canvas.toDataURL('image/jpeg');
       // Convert base64 image data to a Uint8Array and then to a Blob
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
      // Add name and data to firebase storage for each detected person
      names.forEach((name, index) => {
        data[`Person${index + 1}`] = name;
      });
      // Adding the data as a document in the Persons collection of firebase storage
      await addDoc(personsRef, data);
      setImageUploaded(true);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  // Format names for display part of the page
  const formattedNames = names.join(', ').replace(/,(?!.*,)/gmi, ' and');
  return (
    <div className='display-page-container'>
      <h2 className='page-title'>AI result</h2>
      <div id="display-container" className='display-container'>
        <canvas ref={canvasRef} style={{ display: 'none' }}className='display-canvas'></canvas>
      </div>
      <p className="names-detected">The AI detected that {formattedNames} {names.length>1? 'are' : 'is'} in this image</p>
    </div>
  );
};
 
export default DisplayPage;
